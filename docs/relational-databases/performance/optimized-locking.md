---
title: "Optimized Locking"
description: "Learn about the optimized locking enhancement to the database engine."
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: randolphwest, peskount, praspu, dfurman
ms.date: 01/28/2025
ms.service: sql
ms.subservice: performance
ms.topic: conceptual
ms.custom:
  - ignite-2024
helpviewer_keywords:
  - "optimized locking"
dev_langs:
  - "TSQL"
monikerRange: "=azuresqldb-current || =fabric"
---

# Optimized locking

[!INCLUDE [asdb-fabricsqldb](../../includes/applies-to-version/asdb-fabricsqldb.md)]

This article introduces optimized locking, a database engine capability that offers an improved transaction locking mechanism to reduce lock memory consumption and blocking for concurrent transactions.

## What is optimized locking?

Optimized locking helps to reduce lock memory as very few locks are held even for large transactions. In addition, optimized locking also avoids lock escalations. This allows more concurrent access to the table.

Optimized locking is composed of two primary components: **transaction ID (TID) locking** and **lock after qualification (LAQ)**.

- A transaction ID (TID) is a unique identifier of a transaction. Each row is labeled with the last TID that modified it. Instead of potentially many key or row identifier locks, a single lock on the TID is used. For more information, see [Transaction ID (TID) locking](#transaction-id-tid-locking).
- Lock after qualification (LAQ) is an optimization that evaluates query predicates using the latest committed version of the row without acquiring a lock, thus improving concurrency. For more information, see [Lock after qualification (LAQ)](#lock-after-qualification-laq).

For example:

- Without optimized locking, updating 1,000 rows in a table might require 1,000 exclusive (`X`) row locks held until the end of the transaction.
- With optimized locking, updating 1,000 rows in a table might require 1,000 `X` row locks but each lock is released as soon as each row is updated, and only one TID lock is held until the end of the transaction. Because locks are released quickly, lock memory usage is reduced and [lock escalation](/troubleshoot/sql/database-engine/performance/resolve-blocking-problems-caused-lock-escalation) is much less likely to occur, improving workload concurrency.

> [!NOTE]
> Enabling optimized locking reduces or eliminates row and page locks acquired by the Data Modification Language (DML) statements such as `INSERT`, `UPDATE`, `DELETE`, `MERGE`. It has no effect on other kinds of database and object locks, such as schema locks.

### Availability

Optimized locking is available in [!INCLUDE [Azure SQL Database](../../includes/ssazure-sqldb.md)] and [SQL database in Microsoft Fabric](/fabric/database/sql/overview) only, in all service tiers and compute sizes.

Optimized locking isn't currently available in [!INCLUDE [Azure SQL Managed Instance](../../includes/ssazuremi-md.md)] or in [!INCLUDE [SQL Server](../../includes/ssnoversion-md.md)].

#### Is optimized locking enabled?

Optimized locking is enabled per user database. Connect to your database, then use the following query to check if optimized locking is enabled:

```sql
SELECT IsOptimizedLockingOn = DATABASEPROPERTYEX(DB_NAME(), 'IsOptimizedLockingOn');
```

| Result | Description |
|:--|:--|
| `0` | Optimized locking is disabled. |
| `1` | Optimized locking is enabled. |
| `NULL` | Optimized locking isn't available. |

Optimized locking builds on other database features:

- Optimized locking requires [accelerated database recovery (ADR)](/azure/azure-sql/accelerated-database-recovery) to be enabled on the database.
- For the most benefit from optimized locking, [read committed snapshot isolation (RCSI)](../../t-sql/statements/alter-database-transact-sql-set-options.md?view=azuresqldb-current&preserve-view=true#read_committed_snapshot--on--off--1) should be enabled for the database. The [LAQ](#lock-after-qualification-laq) component of optimized locking is in effect only if RCSI is enabled.

Both ADR and RCSI are enabled by default in [!INCLUDE [asdb](../../includes/ssazure-sqldb.md)]. To verify that these options are enabled for your current database, connect to the database and run the following T-SQL query:

```sql
SELECT name,
       is_read_committed_snapshot_on,
       is_accelerated_database_recovery_on
FROM sys.databases
WHERE name = DB_NAME();
```

### Locking overview

This is a short summary of the behavior when optimized locking isn't enabled. For more information, review the [Transaction locking and row versioning guide](../sql-server-transaction-locking-and-row-versioning-guide.md).

In the database engine, locking is a mechanism that prevents multiple transactions from updating the same data simultaneously in order to guarantee the [ACID](../sql-server-transaction-locking-and-row-versioning-guide.md#Basics) properties of transactions.

When a transaction needs to modify data, it requests a lock on the data. The lock is granted if no other conflicting locks are held on the data, and the transaction can proceed with the modification. If another conflicting lock is held on the data, the transaction must wait for the lock to be released before it can proceed.

When multiple transactions attempt to access the same data concurrently, the database engine must resolve potentially complex conflicts with concurrent reads and writes. Locking is one of the mechanisms by which the engine can provide the semantics for the ANSI SQL transaction [isolation levels](../sql-server-transaction-locking-and-row-versioning-guide.md#isolation-levels-in-the-database-engine). Although locking in databases is essential, reduced concurrency, deadlocks, complexity, and lock overhead can affect performance and scalability.

### Transaction ID (TID) locking

When [row versioning](../sql-server-transaction-locking-and-row-versioning-guide.md#Row_versioning) based isolation levels are in use or when ADR is enabled, every row in the database internally contains a transaction ID (TID). This TID is persisted on disk. Every transaction modifying a row stamps that row with its TID.

With TID locking, instead of taking the lock on the key of the row, a lock is taken on the TID of the row. The modifying transaction holds an `X` lock on its TID. Other transactions acquire an `S` lock on the TID to wait until the first transaction completes. With TID locking, page and row locks continue to be taken for modifications, but each page and row lock is released as soon as each row is modified. The only lock held until the end of transaction is the single `X` lock on the TID resource, replacing multiple page and row (key) locks.

Consider the following example that shows locks for the current session while a write transaction is active:

```sql
/* Is optimized locking is enabled? */
SELECT IsOptimizedLockingOn = DATABASEPROPERTYEX(DB_NAME(), 'IsOptimizedLockingOn');

CREATE TABLE t0
(
a int PRIMARY KEY,
b int NULL
);

INSERT INTO t0 VALUES (1,10),(2,20),(3,30);
GO

BEGIN TRANSACTION;

UPDATE t0
SET b = b + 10;

SELECT *
FROM sys.dm_tran_locks
WHERE request_session_id = @@SPID
      AND
      resource_type IN ('PAGE','RID','KEY','XACT');

COMMIT TRANSACTION;
GO

DROP TABLE IF EXISTS t0;
```

If optimized locking is enabled, the request holds only a single `X` lock on the `XACT` (transaction) resource.

:::image type="content" source="media/optimized-locking/sys-dm-tran-locks-with-optimized-locking.png" alt-text="Screenshot of the result set of a query on sys.dm_tran_locks for a single session shows only one lock when optimized locking is enabled." lightbox="media/optimized-locking/sys-dm-tran-locks-with-optimized-locking.png":::

If optimized locking isn't enabled, the same request holds four locks - one `IX` (intent exclusive) lock on the page containing the rows, and three `X` key locks on each row:

:::image type="content" source="media/optimized-locking/sys-dm-tran-locks-without-optimized-locking.png" alt-text="Screenshot of the result set of a query on sys.dm_tran_locks for a single session shows three locks when optimized locking isn't enabled." lightbox="media/optimized-locking/sys-dm-tran-locks-without-optimized-locking.png":::

The [sys.dm_tran_locks](../system-dynamic-management-views/sys-dm-tran-locks-transact-sql.md) dynamic management view (DMV) is useful in examining or troubleshooting locking issues, such as observing optimized locking in action.

### Lock after qualification (LAQ)

Building on the TID infrastructure, optimized locking changes how DML statements such as `INSERT`, `UPDATE`, and `DELETE` acquire locks.

Without optimized locking, query predicates are checked row by row in a scan by first taking an update (`U`) row lock. If the predicate is satisfied, an exclusive (`X`) row lock is taken before updating the row and held until the end of transaction.

With optimized locking, and when the `READ COMMITTED` snapshot isolation level (RCSI) is enabled, predicates can be optimistically checked on latest committed version of the row without taking any locks. If the predicate doesn't satisfy, the query moves to the next row in the scan. If the predicate is satisfied, an `X` row lock is taken to update the row.

In other words, the lock is taken *after qualification* of the row for modification. The `X` row lock is released as soon as the row update is complete, before the end of the transaction.

Since predicate evaluation is performed without acquiring any locks, concurrent queries modifying different rows don't block each other.

For example:

```sql
CREATE TABLE t1
(
a int NOT NULL,
b int NULL
);

INSERT INTO t1
VALUES (1,10),(2,20),(3,30);
GO
```

| **Session 1** | **Session 2** |
| :-- | :-- |
| `BEGIN TRANSACTION;`<br />`UPDATE t1`<br />`SET b = b + 10`<br />`WHERE a = 1;` | |
| | `BEGIN TRANSACTION;`<br />`UPDATE t1`<br />`SET b = b + 10`<br />`WHERE a = 2;` |
| `COMMIT TRANSACTION;` | |
| | `COMMIT TRANSACTION;` |

Without optimized locking, session 2 is blocked because session 1 holds a `U` lock on the row session 2 needs to update. However, with optimized locking, session 2 isn't blocked because `U` locks aren't taken, and because in the latest committed version of row 1, column `a` equals to 1, which doesn't satisfy the predicate of session 2.

LAQ is performed optimistically on the assumption that a row isn't modified after checking the predicate. If the predicate is satisfied and the row hasn't been modified after checking the predicate, it is modified by the current transaction.

Because `U` locks aren't taken, a concurrent transaction might modify the row after the predicate has been evaluated. If there is an active transaction holding an `X` TID lock on the row, the database engine waits for it to complete. If the row has changed after the predicate was evaluated previously, the database engine re-evaluates (re-qualifies) the predicate again before modifying the row. If the predicate is still satisfied, the row is modified.

Predicate re-qualification is supported by a subset of the query engine operators. If predicate re-evaluation is needed, but the query plan uses an operator that doesn't support predicate re-qualification, the database engine internally aborts statement processing and restarts it without LAQ. When such an abort occurs, the `lock_after_qual_stmt_abort` extended event fires.

Some statements, for example `UPDATE` statements with variable assignment and statements with the [OUTPUT](../../t-sql/queries/output-clause-transact-sql.md) clause, cannot be aborted and restarted without changing their semantics. For such statements, LAQ is not used.

In the following example, the predicate is re-evaluated because another transaction has changed the row:

```sql
CREATE TABLE t3
(
a int NOT NULL,
b int NULL
);

INSERT INTO t3 VALUES (1,10),(2,20),(3,30);
GO
```

| **Session 1** | **Session 2** |
| :-- | :-- |
| `BEGIN TRANSACTION;`<br />`UPDATE t3`<br />`SET b = b + 10`<br />`WHERE a = 1;` | |
| | `BEGIN TRANSACTION;`<br />`UPDATE t3`<br />`SET b = b + 10`<br />`WHERE a = 1;` |
| `COMMIT TRANSACTION;` | |
| | `COMMIT TRANSACTION;` |

#### LAQ heuristics

As described in [Lock after qualification (LAQ)](#lock-after-qualification-laq), when LAQ is used, some statements might be internally restarted and processed without LAQ. If this happens frequently, the overhead of repeated processing might become significant. To keep this overhead to a minimum, optimized locking uses a heuristics mechanism to track repeated processing. This mechanism disables LAQ for the database if the overhead exceeds a threshold.

For the purposes of the heuristics mechanism, the work done by a statement is measured in the number of pages it has processed (logical reads). If the database engine is modifying a row that has been modified by another transaction after statement processing started, then the work done by the statement is treated as potentially wasted because the statement might be aborted and restarted. The system keeps track of the total potentially wasted work and the total work done by all statements in the database.

LAQ is disabled for the database if the percentage of the potentially wasted work exceeds a threshold. LAQ is also disabled if the number of restarted statements exceeds a threshold.

If the wasted work and the number of restarted statements fall below their respective thresholds, LAQ is re-enabled for the database.

### <a id="behavior"></a> Query behavior changes with optimized locking and RCSI

Concurrent workloads under read committed snapshot isolation (RCSI) that rely on strict execution order of transactions might experience differences in query behavior when optimized locking is enabled.

Consider the following example where transaction T2 is updating table `t4` based on column `b` that was updated during transaction T1.

```sql
CREATE TABLE t4
(
a int NOT NULL,
b int NULL
);

INSERT INTO t4
VALUES (1,1);
GO
```

| **Session 1** | **Session 2** |
| :-- | :-- |
| `BEGIN TRANSACTION T1;`<br />`UPDATE t4`<br />`SET b = 2`<br />`WHERE a = 1;` | |
| | `BEGIN TRANSACTION T2;`<br />`UPDATE t4`<br />`SET b = 3`<br />`WHERE b = 2;` |
| `COMMIT TRANSACTION;` | |
| | `COMMIT TRANSACTION;` |

Let's evaluate the outcome of the previous scenario with and without lock after qualification (LAQ).

**Without LAQ**

Without LAQ, the `UPDATE` statement in transaction T2 is blocked, waiting for transaction T1 to complete. Once T1 completes, T2 updates the row setting column `b` to `3` because its predicate is satisfied.

After both transactions commit, table `t4` contains the following rows:

```output
 a | b
 1 | 3
```

**With LAQ**

With LAQ, transaction T2 uses the latest committed version of the row where column `b` equals to `1` to evaluate its predicate (`b = 2`). The row doesn't qualify; hence it is skipped and the statement completes without having been blocked by transaction T1. In this example, LAQ removes blocking but leads to different results.

After both transactions commit, table `t4` contains the following rows:

```output
 a | b
 1 | 2
```

> [!IMPORTANT]  
> Even without LAQ, applications should not assume that the database engine guarantees strict ordering without using locking hints when row versioning based isolation levels are used. Our general recommendation for customers running concurrent workloads under RCSI that rely on strict execution order of transactions (as shown in the previous example) is to [use stricter isolation levels](../../t-sql/statements/set-transaction-isolation-level-transact-sql.md) such as `REPEATABLE READ` and `SERIALIZABLE`.

## Diagnostic additions for optimized locking

The following improvements help you monitor and troubleshoot blocking and deadlocks when optimized locking is enabled:

- Wait types for optimized locking
    - `XACT` wait types for the `S` lock on the TID, and resource descriptions in [sys.dm_os_wait_stats (Transact-SQL)](../system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql.md#lck_m_s_xact):
        - `LCK_M_S_XACT_READ` - Occurs when a task is waiting for a shared lock on an `XACT` `wait_resource` type, with an intent to read.
        - `LCK_M_S_XACT_MODIFY` - Occurs when a task is waiting for a shared lock on an `XACT` `wait_resource` type, with an intent to modify.
        - `LCK_M_S_XACT` - Occurs when a task is waiting for a shared lock on an `XACT` `wait_resource` type, where the intent can't be inferred. This scenario isn't common.
- Locking resources visibility
    - `XACT` locking resources. For more information, see `resource_description` in [sys.dm_tran_locks (Transact-SQL)](../system-dynamic-management-views/sys-dm-tran-locks-transact-sql.md).
- Wait resource visibility
    - `XACT` wait resources. For more information, see `wait_resource` in [sys.dm_exec_requests (Transact-SQL)](../system-dynamic-management-views/sys-dm-exec-requests-transact-sql.md).
- Deadlock graph
    - Under each resource in the deadlock report `<resource-list>`, each `<xactlock>` element reports the underlying resources and specific information for locks of each member of a deadlock. For more information and an example, see [Optimized locking and deadlocks](../sql-server-deadlocks-guide.md#optimized-locking-and-deadlocks).
- Extended events
    - The `lock_after_qual_stmt_abort` event fires when a statement is internally aborted and restarted because of a conflict with another transaction. For more information, see [Lock after qualification (LAQ)](#lock-after-qualification-laq).

## Best practices with optimized locking

### Enable read committed snapshot isolation (RCSI)

To maximize the benefits of optimized locking, it is recommended to enable [read committed snapshot isolation (RCSI)](../../t-sql/statements/alter-database-transact-sql-set-options.md?view=azuresqldb-current&preserve-view=true#read_committed_snapshot--on--off--1) on the database and use `READ COMMITTED` isolation as the default isolation level. If not already enabled, enable RCSI by connecting to the `master` database and executing the following statement:

```sql
ALTER DATABASE [your-database-name] SET READ_COMMITTED_SNAPSHOT ON;
```

In [!INCLUDE [asdb](../../includes/ssazure-sqldb.md)], RCSI is enabled by default and `READ COMMITTED` is the default isolation level. With RCSI enabled and when using `READ COMMITTED` isolation level, readers read a version of the row from the snapshot taken at the start of the statement. With LAQ, writers qualify rows per the predicate based on the latest committed version of the row and without acquiring `U` locks. With LAQ, a query waits only if the row qualifies and there's an active write transaction on that row. Qualifying based on the latest committed version and locking only the qualified rows reduces blocking and increases concurrency.

In addition to reduced blocking, the required lock memory is reduced. This is because readers don't take any locks, and writers take only short duration locks, instead of locks that are held until the end of the transaction. When you use stricter isolation levels such as `REPEATABLE READ` or `SERIALIZABLE`, the database engine holds row and page locks until the end of the transaction even with optimized locking enabled, for both readers and writers, resulting in increased blocking and lock memory usage.

### Avoid locking hints

While [table and query hints](../../t-sql/queries/hints-transact-sql.md) such as `UPDLOCK`, `READCOMMITTEDLOCK`, `XLOCK`, `HOLDLOCK`, etc. are honored when optimized locking is enabled, they reduce the benefit of optimized locking. Lock hints force the database engine to take row or page locks and hold them until the end of the transaction, to honor the intent of the lock hints. Some applications have logic where lock hints are needed, for example when reading a row with the `UPDLOCK` hint and then updating it later. We recommend using lock hints only where needed.

With optimized locking, there are no restrictions on existing queries and queries don't need to be rewritten. Queries that aren't using hints benefit from optimized locking most.

A table hint on one table in a query doesn't disable optimized locking for other tables in the same query. Further, optimized locking only affects the locking behavior of tables being updated by a DML statement such as `INSERT`, `UPDATE`, `DELETE`, or `MERGE`. For example:

```sql
CREATE TABLE t5
(
a int NOT NULL,
b int NOT NULL
);

CREATE TABLE t6
(
a int NOT NULL,
b int NOT NULL
);
GO

INSERT INTO t5 VALUES (1,10),(2,20),(3,30);
INSERT INTO t6 VALUES (1,10),(2,20),(3,30);
GO

UPDATE t5 SET t5.b = t6.b
FROM t5
INNER JOIN t6 WITH (UPDLOCK)
ON t5.a = t6.a;
```

In the previous query example, only table `t6` is affected by the locking hint, while `t5` can still benefit from optimized locking.

```sql
UPDATE t5
SET t5.b = t6.b
FROM t5 WITH (REPEATABLEREAD)
INNER JOIN t6
ON t5.a = t6.a;
```

In the previous query example, only table `t5` uses the `REPEATABLE READ` isolation level and hold locks until the end of the transaction. Other updates to `t5` can still benefit from optimized locking. The same applies to the `HOLDLOCK` hint.

## Frequently asked questions (FAQ)

### Is optimized locking on by default in both new and existing databases?

In [!INCLUDE [Azure SQL Database](../../includes/ssazure-sqldb.md)], yes.

### How can I detect if optimized locking is enabled?

See [Is optimized locking enabled?](#is-optimized-locking-enabled).

### What happens when accelerated database recovery (ADR) isn't enabled on my database?

If ADR is disabled, optimized locking is automatically disabled as well.

### What if I want to force queries to block despite optimized locking?

For customers using RCSI, to force blocking between two queries when optimized locking is enabled, use the `READCOMMITTEDLOCK` query hint.

### Is optimized locking used on read-only secondary replicas?

No, because DML statements can't run on read-only replicas, and the corresponding row and page locks aren't taken.

### Is optimized locking used when modifying data in tempdb and in temporary tables?

Not at this time.

## Related content

- [Transaction locking and row versioning guide](../sql-server-transaction-locking-and-row-versioning-guide.md)
- [Read committed snapshot isolation (RCSI)](../../t-sql/statements/alter-database-transact-sql-set-options.md?view=azuresqldb-current&preserve-view=true#read_committed_snapshot--on--off--1)
- [sys.dm_tran_locks (Transact-SQL)](../system-dynamic-management-views/sys-dm-tran-locks-transact-sql.md)
- [Accelerated database recovery](../accelerated-database-recovery-concepts.md)

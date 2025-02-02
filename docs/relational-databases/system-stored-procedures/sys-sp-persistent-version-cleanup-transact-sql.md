---
title: "sys.sp_persistent_version_cleanup (Transact-SQL)"
description: "Manually starts persistent version store (PVS) cleanup process, a key element of accelerated database recovery (ADR)."
author: rwestMSFT
ms.author: randolphwest
ms.reviewer: dfurman
ms.date: 02/03/2025
ms.service: sql
ms.subservice: system-objects
ms.topic: "reference"
f1_keywords:
  - "sp_persistent_version_cleanup"
  - "sys.sp_persistent_version_cleanup"
  - "sys.sp_persistent_version_cleanup_TSQL"
  - "sp_persistent_version_cleanup_TSQL"
dev_langs:
  - "TSQL"
monikerRange: ">=sql-server-ver15 || >=sql-server-linux-ver15 || =azuresqldb-mi-current || =azuresqldb-current"
---
# sys.sp_persistent_version_cleanup (Transact-SQL)

[!INCLUDE [SQL Server 2019, ASDB, ASDBMI](../../includes/applies-to-version/sqlserver2019-asdb-asdbmi.md)]

Manually starts persistent version store (PVS) cleanup process, a key element of accelerated database recovery (ADR). This cleaner also removes uncommitted data in PVS from aborted transactions.

It isn't typically necessary to start the PVS cleanup process manually using `sys.sp_persistent_version_cleanup`. However in some scenarios, you might want to initiate the PVS cleanup process manually during a known period of rest/recovery after busy OLTP activity.

For more information about ADR, see [Accelerated database recovery](../accelerated-database-recovery-concepts.md).

:::image type="icon" source="../../includes/media/topic-link-icon.svg" border="false"::: [Transact-SQL syntax conventions](../../t-sql/language-elements/transact-sql-syntax-conventions-transact-sql.md)

## Syntax

```syntaxsql
sp_persistent_version_cleanup
    [ [ @dbname = ] N'dbname' ]
    [ , [ @scanallpages = ] scanallpages ]
    [ , [ @clean_option = ] clean_option ]
[ ; ]
```

## Arguments

#### [ @dbname = ] N'*dbname*'

Optional. The name of the database to clean up. If not provided, uses the current database context. *@dbname* is **sysname**, with a default of `NULL`.

#### [ @scanallpages = ] *scanallpages*

Optional. *@scanallpages* is **bit**, with a default of `0`. When set to `1`, this option forces clean up of all database pages even if not versioned.

#### [ @clean_option = ] *clean_option*

Optional. Possible options determine whether or not to reclaim off-row PVS page. *@clean_option* is **int**, with a default of `0`. This reference isn't commonly needed and the default value `0` is recommended.

| Value | Description |
| :--- | :--- |
| `0` | Default, no option specified |
| `1` | off-row version store without checking individual PVS page contents |
| `2` | off-row version store with each PVS page visited |
| `3` | in-row version store only |
| `4` | internal use only |

## Return code values

`0` (success) or `1` (failure).

## Result set

None.

## Permissions

Requires the `ALTER` permission on the database.

## Remarks

The `sys.sp_persistent_version_cleanup` stored procedure is synchronous, meaning that it doesn't complete until all version information is cleaned up from the current PVS.

In [!INCLUDE [sssql19-md](../../includes/sssql19-md.md)], the PVS cleanup process only executes for one database at a time. In Azure SQL Database and Azure SQL Managed Instance, and beginning with [!INCLUDE [sssql22-md](../../includes/sssql22-md.md)], the PVS cleanup process can execute in parallel against multiple databases in the same instance.

If the PVS cleanup process is already running against the desired database, this stored procedure is blocked before starting another PVS cleanup process. Active, long-running transactions in any database on the same database engine instance that have ADR enabled can also block PVS cleanup.

You can monitor the version cleaner task by looking for its process with the following sample query:

```sql
SELECT *
FROM sys.dm_exec_requests
WHERE command LIKE '%PERSISTED_VERSION_CLEANER%';
```

If ADR is disabled, run `sys.sp_persistent_version_cleanup` to clean up previous versions still in the PVS.

## Examples

To activate the PVS cleanup process manually between workloads or during maintenance windows, use the following sample script:

```sql
EXEC sys.sp_persistent_version_cleanup [database_name];
```

For example:

```sql
EXEC sys.sp_persistent_version_cleanup [WideWorldImporters];
```

Or, to assume the current database context:

```sql
USE [WideWorldImporters];
GO
EXEC sys.sp_persistent_version_cleanup;
```

## Related content

- [Accelerated database recovery](../accelerated-database-recovery-concepts.md)
- [Monitor and troubleshoot accelerated database recovery](../accelerated-database-recovery-troubleshoot.md)
- [Manage accelerated database recovery](../accelerated-database-recovery-management.md)

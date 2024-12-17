---
title: "MSSQLSERVER_601"
description: "MSSQLSERVER_601"
author: MashaMSFT
ms.author: mathoma
ms.reviewer: randolphwest
ms.date: 12/16/2024
ms.service: sql
ms.subservice: supportability
ms.topic: "reference"
f1_keywords:
  - "601"
helpviewer_keywords:
  - "601 (Database Engine error)"
---
# MSSQLSERVER_601

[!INCLUDE [SQL Server](../../includes/applies-to-version/sqlserver.md)]

## Details

| Attribute | Value |
| :--- | :--- |
| Product Name | SQL Server |
| Event ID | 601 |
| Event Source | MSSQLSERVER |
| Component | SQLEngine |
| Symbolic Name | |
| Message Text | Could not continue scan with NOLOCK due to data movement. |

## Explanation

The [!INCLUDE [ssDEnoversion](../../includes/ssdenoversion-md.md)] can't continue executing the query because it's trying to read data that was updated or deleted by another transaction. The query is using either the `NOLOCK` locking hint or the `READ UNCOMMITTED` transaction isolation level.

Typically, access to data that is being changed by another transaction is denied because of locks put on the data. However, the `NOLOCK` locking hint and `READ UNCOMMITTED` transaction isolation level let a query read data that is locked by another transaction. This scenario is referred to as a *dirty read*, because you can read values that aren't yet committed and that are subject to change.

## User action

This error cancels the query. Either resubmit the query or remove the `NOLOCK` locking hint.

## Related content

- [MSSQLSERVER_605](mssqlserver-605-database-engine-error.md)
- [Table hints (Transact-SQL)](../../t-sql/queries/hints-transact-sql-table.md)
- [SELECT (Transact-SQL)](../../t-sql/queries/select-transact-sql.md)
- [SET TRANSACTION ISOLATION LEVEL (Transact-SQL)](../../t-sql/statements/set-transaction-isolation-level-transact-sql.md)

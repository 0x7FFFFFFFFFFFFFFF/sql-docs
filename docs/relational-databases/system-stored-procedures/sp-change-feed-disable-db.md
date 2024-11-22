---
title: "sys.sp_change_feed_disable_db (Transact-SQL)"
description: "The sys.sp_change_feed_disable_db system stored procedure disables the SQL change feed at the database level."
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: imotiwala
ms.date: 09/24/2024
ms.service: fabric
ms.subservice: system-objects
ms.topic: "reference"
ms.custom:
  - ignite-2024
f1_keywords:
  - "sys.sp_change_feed_disable_db_TSQL"
  - "sys.sp_change_feed_disable_db"
  - "sp_change_feed_disable_db_TSQL"
  - "sp_change_feed_disable_db"
helpviewer_keywords:
  - "sp_change_feed_disable_db"
dev_langs:
  - "TSQL"
monikerRange: ">=sql-server-ver16 || =azuresqldb-current || =azure-sqldw-latest || =fabric"
---
# sys.sp_change_feed_disable_db (Transact-SQL)

[!INCLUDE [sqlserver2022-asdb-asa-fabricmirroredsqldb-fabricsqldb](../../includes/applies-to-version/sqlserver2022-asdb-asa-fabricmirroredsqldb-fabricsqldb.md)]

Disable the change feed at the database level, and then the metadata for all the associated tables for [Azure Synapse Link for SQL](/azure/synapse-analytics/synapse-link/sql-synapse-link-overview), [Microsoft Fabric mirrored databases](/fabric/database/mirrored-database/overview), and [SQL database in Microsoft Fabric](/fabric/database/sql/overview).

> [!NOTE]  
> This system stored procedure is used internally and is not recommended for direct administrative use. Use Synapse Studio or the Fabric portal instead. Using this procedure could introduce inconsistency.

## Syntax

:::image type="icon" source="../../includes/media/topic-link-icon.svg" border="false"::: [Transact-SQL syntax conventions](../../t-sql/language-elements/transact-sql-syntax-conventions-transact-sql.md)

```syntaxsql
sys.sp_change_feed_disable_db
[ ; ]
```

## Permissions

A user with [CONTROL database permissions](../security/permissions-database-engine.md), **db_owner** database role membership, or **sysadmin** server role membership can execute this procedure.

## Remarks

When the change feed is disabled with active table groups, all connections and schedulers are stopped immediately/forcefully without waiting for the current operations are completed. No new change feed table groups can be created for the database, and all the existing metadata describing the table groups will be deleted without waiting for the current operations to complete. Re-enabling change feed results in clean initializations of all table groups and reseeding of all the data.

You should only execute this stored procedure when unsupported actions or unexpected errors have occurred, that require the Mirroring feature to be disabled manually, and can't be removed via the Synapse workspace or Fabric portal.

## Related content

- [sys.sp_help_change_feed (Transact-SQL)](sp-help-change-feed.md)
- [sys.sp_help_change_feed_table (Transact-SQL)](sp-help-change-feed-table.md)
- [sys.sp_change_feed_configure_parameters (Transact-SQL)](sp-change-feed-configure-parameters.md)
- [sys.dm_change_feed_log_scan_sessions (Transact-SQL)](../system-dynamic-management-views/sys-dm-change-feed-log-scan-sessions.md)
- [sys.dm_change_feed_errors (Transact-SQL)](../system-dynamic-management-views/sys-dm-change-feed-errors.md)

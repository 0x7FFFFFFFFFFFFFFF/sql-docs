---
title: "sys.sp_change_feed_enable_db (Transact-SQL)"
description: "The sys.sp_change_feed_enable_db system stored procedure enables the current database for Azure Synapse Link or Fabric Mirrored Database publishing."
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: imotiwala, randolphwest
ms.date: 09/24/2024
ms.service: fabric
ms.subservice: system-objects
ms.topic: "reference"
ms.custom:
  - ignite-2024
f1_keywords:
  - "sys.sp_change_feed_enable_db_TSQL"
  - "sys.sp_change_feed_enable_db"
  - "sp_change_feed_enable_db_TSQL"
  - "sp_change_feed_enable_db"
helpviewer_keywords:
  - "sp_change_feed_enable_db"
dev_langs:
  - "TSQL"
monikerRange: ">=sql-server-ver16 || =azuresqldb-current || =fabric || =azure-sqldw-latest"
---
# sys.sp_change_feed_enable_db (Transact-SQL)

[!INCLUDE [sqlserver2022-asdb-asa-fabricmirroredsqldb-fabricsqldb](../../includes/applies-to-version/sqlserver2022-asdb-asa-fabricmirroredsqldb-fabricsqldb.md)]

Enables current database for [Azure Synapse Link for SQL](/azure/synapse-analytics/synapse-link/sql-synapse-link-overview), [Microsoft Fabric mirrored databases](/fabric/database/mirrored-database/overview), and [SQL database in Microsoft Fabric](/fabric/database/sql/overview).

> [!NOTE]  
> This system stored procedure is used internally and isn't recommended for direct administrative use. Use Synapse Studio or the Fabric portal instead. Using this procedure could introduce inconsistency.

## Syntax

:::image type="icon" source="../../includes/media/topic-link-icon.svg" border="false"::: [Transact-SQL syntax conventions](../../t-sql/language-elements/transact-sql-syntax-conventions-transact-sql.md)

```syntaxsql
EXECUTE sys.sp_change_feed_enable_db
    [ [ @maxtrans ] ]
    [ , [ @pollinterval ]  ]
    [ , [ @destination_type ] ]
GO
```

## Arguments

#### @maxtrans

Data type is **int**. Indicates the maximum number of transactions to process in each scan cycle.

- For Azure Synapse Link, the default value if not specified is `10000`. If specified, the value must be a positive integer.
- For Fabric mirroring, this value is dynamically determined and automatically set.

#### @pollinterval

Data type is **int**. Describes the frequency, or polling interval, that the log is scanned for any new changes in seconds.

- For Azure Synapse Link, the default interval if not specified is 5 seconds. The value must be `5` or larger.
- For Fabric mirroring, this value is dynamically determined and automatically set.

#### @destination_type

**Applies to:** Fabric database mirroring only. For Synapse Link, do not specify.

Data type is **int**. Default is `0`, for Azure Synapse Link. `2` = Fabric database mirroring.

## Permissions

A user with [CONTROL database permissions](../security/permissions-database-engine.md), **db_owner** database role membership, or **sysadmin** server role membership can execute this procedure.

## Examples

The following sample enables the change feed.

```sql
EXECUTE sys.sp_change_feed_enable_db;
```

Verify the database is enabled.

```sql
SELECT
    [name]
  , is_data_lake_replication_enabled
FROM sys.databases;
```

## Related content

- [sys.sp_change_feed_enable_table (Transact-SQL)](sp-change-feed-enable-table.md)
- [sys.sp_change_feed_create_table_group (Transact-SQL)](sp-change-feed-create-table-group.md)
- [sys.sp_help_change_feed (Transact-SQL)](sp-help-change-feed.md)
- [sys.sp_help_change_feed_table (Transact-SQL)](sp-help-change-feed-table.md)
- [sys.sp_change_feed_configure_parameters (Transact-SQL)](sp-change-feed-configure-parameters.md)
- [sys.dm_change_feed_log_scan_sessions (Transact-SQL)](../system-dynamic-management-views/sys-dm-change-feed-log-scan-sessions.md)
- [sys.dm_change_feed_errors (Transact-SQL)](../system-dynamic-management-views/sys-dm-change-feed-errors.md)

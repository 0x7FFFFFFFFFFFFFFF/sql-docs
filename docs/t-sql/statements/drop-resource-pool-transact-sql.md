---
title: "DROP RESOURCE POOL (Transact-SQL)"
description: DROP RESOURCE POOL (Transact-SQL)
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: dfurman
ms.date: 12/31/2024
ms.service: sql
ms.subservice: t-sql
ms.topic: reference
f1_keywords:
  - "DROP RESOURCE POOL"
  - "DROP_RESOURCE_POOL_TSQL"
helpviewer_keywords:
  - "DROP RESOURCE POOL"
dev_langs:
  - "TSQL"
---

# DROP RESOURCE POOL (Transact-SQL)

[!INCLUDE [SQL Server](../../includes/applies-to-version/sql-asdbmi.md)]

Deletes a user-defined [resource governor](../../relational-databases/resource-governor/resource-governor.md) resource pool for a [!INCLUDE[ssDE](../../includes/ssde-md.md)] instance.

> [!NOTE]
> For Azure SQL Managed Instance, you must be in the context of the `master` database to modify resource governor configuration.

:::image type="icon" source="../../includes/media/topic-link-icon.svg" border="false"::: [Transact-SQL syntax conventions](../../t-sql/language-elements/transact-sql-syntax-conventions-transact-sql.md)

## Syntax

```syntaxsql
DROP RESOURCE POOL pool_name
[ ; ]
```

## Arguments

#### *pool_name*

Is the name of an existing user-defined resource pool.

## Remarks

You can't drop a resource pool if it contains any workload groups.

You can't drop the built-in `default` and `internal` pools.

For more information, see [Resource governor](../../relational-databases/resource-governor/resource-governor.md) and [Resource governor resource pool](../../relational-databases/resource-governor/resource-governor-resource-pool.md).

## Permissions

Requires the `CONTROL SERVER` permission.

## Examples

The following example deletes the resource pool named `big_pool` and makes the new configuration effective.

```sql
DROP RESOURCE POOL big_pool;

ALTER RESOURCE GOVERNOR RECONFIGURE;
```

## Related content

- [Resource governor](../../relational-databases/resource-governor/resource-governor.md)
- [Resource governor resource pool](../../relational-databases/resource-governor/resource-governor-resource-pool.md)
- [Delete a resource pool](../../relational-databases/resource-governor/delete-a-resource-pool.md)
- [CREATE RESOURCE POOL](../../t-sql/statements/create-resource-pool-transact-sql.md)
- [ALTER RESOURCE POOL](../../t-sql/statements/alter-resource-pool-transact-sql.md)
- [CREATE WORKLOAD GROUP](../../t-sql/statements/create-workload-group-transact-sql.md)
- [ALTER WORKLOAD GROUP](../../t-sql/statements/alter-workload-group-transact-sql.md)
- [DROP WORKLOAD GROUP](../../t-sql/statements/drop-workload-group-transact-sql.md)
- [ALTER RESOURCE GOVERNOR](../../t-sql/statements/alter-resource-governor-transact-sql.md)

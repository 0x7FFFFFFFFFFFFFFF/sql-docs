---
title: "VECTOR_NORM (Transact-SQL)"
description: "VECTOR_NORM takes a vector as an input and returns the norm of the vector (which is a measure of its length or magnitude) in a given norm type."
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: damauri, pookam
ms.date: 09/02/2024
ms.service: sql
ms.subservice: t-sql
ms.topic: reference
f1_keywords:
  - "VECTOR_NORM"
  - "VECTOR_NORM_TSQL"
helpviewer_keywords:
  - "VECTOR_NORM function"
  - "vector, norm calculation"
dev_langs:
  - "TSQL"
monikerRange: "= azuresqldb-current"
ms.collection: ce-skilling-ai-copilot
---
# VECTOR_NORM (Transact-SQL) (Preview)

[!INCLUDE [Azure SQL Database](../../includes/applies-to-version/asdb.md)]

> [!NOTE]
> This data type is in preview and is subject to change. Make sure to read preview usage terms in the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services) document.

The function `VECTOR_NORM` takes a vector as an input and returns the norm of the vector (which is a measure of its length or magnitude) in a given [norm type](https://mathworld.wolfram.com/VectorNorm.html)

For example, if you want to calculate the Euclidean norm (which is the most common norm type), you can use:

```sql
SELECT VECTOR_NORM ( vector_column, 'norm2' )
FROM ...
```
  
## Syntax  
  
:::image type="icon" source="../../includes/media/topic-link-icon.svg" border="false"::: [Transact-SQL syntax conventions](../../t-sql/language-elements/transact-sql-syntax-conventions-transact-sql.md)  

```syntaxsql  
VECTOR_NORM ( vector_column, norm_type )
```

## Arguments

### vector_column

An expression that evaluates to a vector. This column must be of the new [vector](../../t-sql/data-types/vector-data-type.md) data type

### norm_type

A string with the name of the norm type to use to calculate the norm of the given vector. The following norm types are supported:

- `norm1` - The 1-norm, which is the sum of the absolute values of the vector components.
- `norm2` - The 2-norm, also known as the Euclidean Norm which is the square root of the sum of the squares of the vector components.
- `norminf` - The infinity norm, which is the maximum of the absolute values of the vector components.

## Return value

The function returns a **float** value that represents the norm of the vector using the specified norm type.

An error is returned if *norm_type* isn't a valid norm type and if the *vector_column* is not of the [vector](../../t-sql/data-types/vector-data-type.md) type.

## Examples

### Example 1

The following example creates a vector with three dimensions from a string with a JSON array.

```sql
DECLARE @v VECTOR(3) = '[1, 2, 3]';

SELECT 
    vector_norm(@v, 'norm2') AS norm2,
    vector_norm(@v, 'norm1') AS norm1,
    vector_norm(@v, 'norminf') AS norminf;
```

The expected return values would be:

| `norm2`             | `norm1` | `norminf` |
|-------------------|-------|---------|
| 3.7416573867739413| 6.0   | 3.0     |

### Example 2

The following example calculates the norm of each vector in a table.

```sql
CREATE TABLE dbo.vectors
(
  ID INT PRIMARY KEY,
  v VECTOR(3) NOT NULL
);

INSERT INTO dbo.vectors (ID, v) VALUES 
(1, '[0.1, -2, 42]'),
(2, '[2, 0.1, -42]');

SELECT 
  ID, 
  VECTOR_NORM(v, 'norm2') AS norm 
FROM 
  dbo.vectors;
```

## Related content

- [Vector Data Type](../data-types/vector-data-type.md)
- [Intelligent applications with Azure SQL Database](/azure/azure-sql/database/ai-artificial-intelligence-intelligent-applications)
- [Vector Functions](vector-functions-transact-sql.md)

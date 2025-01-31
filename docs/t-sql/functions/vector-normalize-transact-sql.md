---
title: "VECTOR_NORMALIZE (Transact-SQL)"
description: "VECTOR_NORMALIZE takes a vector as an input and returns the normalized vector, which is a vector scaled to have a length of 1 in a given norm type."
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: damauri, pookam
ms.date: 09/11/2024
ms.service: sql
ms.subservice: t-sql
ms.topic: reference
f1_keywords:
  - "VECTOR_NORMALIZE"
  - "VECTOR_NORMALIZE_TSQL"
helpviewer_keywords:
  - "VECTOR_NORMALIZE function"
  - "vector, normalize calculation"
dev_langs:
  - "TSQL"
monikerRange: "= azuresqldb-current"
---
# VECTOR_NORMALIZE (Transact-SQL) (Preview)

[!INCLUDE [Azure SQL Database](../../includes/applies-to-version/asdb.md)]

> [!NOTE]
> This data type is in preview and is subject to change. Make sure to read preview usage terms in the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services) document.

`VECTOR_NORMALIZE` takes a vector as an input and returns the normalized vector, which is a vector scaled to have a length of 1 in a given [norm type](https://mathworld.wolfram.com/VectorNorm.html).

This standardization is crucial in various artificial intelligence applications where vectors represent different forms of data, such as visual content, textual information, or audio signals. By normalizing vectors, we ensure uniformity in their scale, which is particularly useful for operations that rely on measuring vector distances or for grouping and distinguishing data points.

While Azure OpenAI's models provide normalized vectors, there are other models and frameworks where vectors are not automatically normalized. For example, in the Gensim library, which is commonly used for natural language processing tasks, vectors are not always normalized by default.

Users often need to normalize the vectors manually or use specific functions provided by the library to ensure that the vectors are of unit length.

In general, when working with machine learning models or vector embeddings, it's important to check the documentation or the output of the model to determine whether the vectors are normalized. If normalization is required for your application, you may need to implement it as a separate step if the model does not provide normalized vectors by default.

For example, if you want a normalized vector using the Euclidean norm (which is the most common norm type), you can use:

```sql
SELECT VECTOR_NORMALIZE ( vector_column, 'norm2' )
FROM ...
```

## Syntax

:::image type="icon" source="../../includes/media/topic-link-icon.svg" border="false"::: [Transact-SQL syntax conventions](../../t-sql/language-elements/transact-sql-syntax-conventions-transact-sql.md)  

```syntaxsql
VECTOR_NORMALIZE ( vector_column, norm_type )
```

## Arguments

### vector_column

An expression that evaluates to a vector. This column must be of the [vector](../../t-sql/data-types/vector-data-type.md) data type.

### norm_type

A string with the name of the norm type to use to calculate the norm of the given vector. The following norm types are supported:

- `norm1` - The 1-norm, which is the sum of the absolute values of the vector components.
- `norm2` - The 2-norm, also known as the Euclidean Norm which is the square root of the sum of the squares of the vector components.
- `norminf` - The infinity norm, which is the maximum of the absolute values of the vector components.

## Return value

The result is a vector with the same direction as the input vector but with a length of 1 according to the given norm.

If the input is `NULL`, the returned result will also be `NULL`.

An error is returned if *norm_type* isn't a valid norm type and if the *vector_column* is not of the [vector](../../t-sql/data-types/vector-data-type.md) data type.

## Examples

### Example 1

Normalize a vector:

```sql
CREATE TABLE dbo.vectors
(
  id INT PRIMARY KEY,
  v VECTOR(3) NOT NULL
);

INSERT INTO dbo.vectors (ID, v) VALUES 
(1, '[0.1, -2, 42]'),
(2, '[2, 0.1, -42]');

SELECT id, VECTOR_NORMALIZE(v, 'norm2') AS nv FROM dbo.vectors; 
```

### Example 2

```sql
DECLARE @v VECTOR(3) = '[1, 2, 3]';

SELECT VECTOR_NORMALIZE(@v, 'norm1'), VECTOR_NORMALIZE(@v, 'norminf'); 
```

## Related content

- [Vector functions (Transact SQL)](../..//t-sql/functions/vector-functions-transact-sql.md)
- [Vector data type](../../t-sql/data-types/vector-data-type.md)
- [Intelligent applications with Azure SQL Database](/azure/azure-sql/database/ai-artificial-intelligence-intelligent-applications)

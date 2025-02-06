---
title: Work with vectors in the SQL Database Engine
description: How to create, manage, and search vectors in the SQL Database Engine.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: damauri, pookam, jovanpop, randolphwest
ms.date: 10/22/2024
ms.service: sql
ms.topic: conceptual
ms.custom:
  - intro-quickstart
ms.collection: ce-skilling-ai-copilot
helpviewer_keywords:
  - "Vectors"
  - "Vectors, built-in support"
monikerRange: "=azuresqldb-current"
---
# Overview of vectors in the SQL Database Engine

[!INCLUDE [Azure SQL Database](../../includes/applies-to-version/asdb.md)]

Vectors are ordered arrays of numbers (typically floats) that can represent information about some data. For example, an image can be represented as a vector of pixel values, or a string of text can be represented as a vector or ASCII values. The process to turn data into a vector is called vectorization.

## Embeddings

Embeddings are vectors that represent important features of data. Embeddings are often learned by using a deep learning model, and machine learning and AI models utilize them as features. Embeddings can also capture semantic similarity between similar concepts. For example, in generating an embedding for the words `person` and `human`, we would expect their embeddings (vector representation) to be similar in value since the words are also semantically similar.

Azure OpenAI features models to create embeddings from text data. The service breaks text out into tokens and generates embeddings using models pretrained by OpenAI. To learn more, see [Creating embeddings with Azure OpenAI](/azure/ai-services/openai/concepts/understand-embeddings).

Once embeddings are generated, they can be stored into a SQL Server database. This allows you to store the embeddings alongside the data they represent, and to perform vector search queries to find similar data points.

## Vector search

Vector search refers to the process of finding all vectors in a dataset that are similar to a specific query vector. Therefore, a query vector for the word `human` searches the entire dataset for similar vectors, and thus similar words: in this example it should find the word `person` as a close match. This closeness, or distance, is measured using a distance metric such as cosine distance. The closer vectors are, the more similar they are.

SQL Server provides built-in support for vectors via the **vector** data type. Vectors are stored in an optimized binary format but exposed as JSON arrays for convenience. Each element of the vector is stored using single-precision (4 bytes) floating-point value. Along with the data type there are dedicated functions to operate on vectors. For example, it's possible to find the distance between two vectors using the `VECTOR_DISTANCE` function. The function returns a scalar value with the distance between two vectors based on the distance metric you specify.

Since vectors are typically managed as arrays of floats, creating a vector can be done simply casting a JSON array to a **vector** data type. For example, the following code creates a vector from a JSON array:

```sql
SELECT CAST('[1.0, -0.2, 30]' AS VECTOR(3)) AS vector;
```

or, using implicit casting

```sql
DECLARE @v VECTOR(3) = '[1.0, -0.2, 30]';
SELECT @v;
```

Same goes for converting a vector into a JSON array:

```sql
DECLARE @v VECTOR(3) = '[1.0, -0.2, 30]';
SELECT CAST(@v AS NVARCHAR(MAX)) AS vector;
```

## Limitations

In the current preview casting to and from JSON data type is not supported yet. The workaround is to first convert from/to **NVARCHAR(MAX)** and then to/from JSON. For example, to convert a vector to a JSON type:

```sql
DECLARE @v VECTOR(3) = '[1.0, -0.2, 30]';
SELECT CAST(CAST(@v AS NVARCHAR(MAX)) AS JSON) AS j;
```

and to convert from a JSON type to vector:

```sql
DECLARE @j JSON = JSON_ARRAY(1.0, -0.2, 30)
SELECT CAST(CAST(@j AS NVARCHAR(MAX)) AS VECTOR(3)) AS v;
```

More details on how to use vectors in SQL Server can be found in the following articles:

- [Vector Data Types](../../t-sql/data-types/vector-data-type.md)
- [Vector Functions](../../t-sql/functions/vector-functions-transact-sql.md)
- [Azure SQL DB Vector Search Samples](https://github.com/Azure-Samples/azure-sql-db-vector-search)

## Related content

- [Intelligent applications with Azure SQL Database](/azure/azure-sql/database/ai-artificial-intelligence-intelligent-applications)

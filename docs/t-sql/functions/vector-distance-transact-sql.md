---
title: "VECTOR_DISTANCE (Transact-SQL)"
description: "VECTOR_DISTANCE calculates the distance between two vectors using a specified distance metric."
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: damauri, pookam
ms.date: 09/11/2024
ms.service: sql
ms.subservice: t-sql
ms.topic: reference
f1_keywords:
  - "VECTOR_DISTANCE"
  - "VECTOR_DISTANCE_TSQL"
helpviewer_keywords:
  - "VECTOR_DISTANCE function"
  - "vector, distance calculation"
dev_langs:
  - "TSQL"
monikerRange: "= azuresqldb-current || = azuresqldb-mi-current"
ms.collection: ce-skilling-ai-copilot
---
# VECTOR_DISTANCE (Transact-SQL) (Preview)

[!INCLUDE [Azure SQL Database Azure SQL Managed Instance](../../includes/applies-to-version/asdb-asdbmi.md)]

> [!NOTE]
> This data type is in preview and is subject to change. Make sure to read preview usage terms in the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services) document.

Calculates the distance between two vectors using a specified distance metric.
  
## Syntax
  
:::image type="icon" source="../../includes/media/topic-link-icon.svg" border="false"::: [Transact-SQL syntax conventions](../../t-sql/language-elements/transact-sql-syntax-conventions-transact-sql.md)  
  
```syntaxsql  
VECTOR_DISTANCE ( distance_metric, vector1, vector2 )
```  
  
## Arguments

### distance_metric

A string with the name of the distance metric to use to calculate the distance between the two given vectors. The following distance metrics are supported:

- `cosine` - Cosine distance
- `euclidean` - Euclidean distance
- `dot` - (Negative) Dot product

### vector1

An expression that evaluates to a *vector* in binary format.

### vector2

An expression that evaluates to a vector in binary format.

## Distance Metrics

|Metric|Description|Range|Examples|
|-----|-----|-----|-----|
|`cosine`|Cosine (angular) distance|[0, 2]| `0`: identical vectors <br/>`2`: opposing vectors|
|`euclidean`|Euclidean distance|[-∞, +∞]| `0`: identical vectors|
|`dot`|Dot product-based indication of distance,<br/>obtained by calculating the *negative* dot product |[-∞, +∞]| Smaller numbers indicate more similar vectors|

## Return value

The function returns a scalar **float** value that represents the distance between the two vectors using the specified distance metric.

An error is returned if *distance_metric* isn't a valid metric and if the provided binary values don't represent valid vectors.

## Examples  

Review the [Azure SQL Database Vector Search Samples GitHub repo](https://github.com/Azure-Samples/azure-sql-db-vector-search) to get end-to-end working samples.

Examples assume the existence of a table named `wikipedia_articles` with a column `title_vector` of type `vector` that stores title's embeddings of Wikipedia articles. `title_vector` is assumed to be an embedding generated with an embedding model like *text-embedding-ada-002* or *text-embedding-3-small* , which returns vectors with 1,536 dimensions.
  
### Example 1

The following example creates a vector with three dimensions from a string with a JSON array.
  
```sql  
DECLARE @v1 VECTOR(2) = '[1,1]';
DECLARE @v2 VECTOR(2) = '[-1,-1]';

SELECT 
    VECTOR_DISTANCE('euclidean', @v1, @v2) AS euclidean,
    VECTOR_DISTANCE('cosine', @v1, @v2) AS cosine,
    VECTOR_DISTANCE('dot', @v1, @v2) AS negative_dot_product;
```  

### Example 2

The following example returns the top 10 most similar articles to a given article, based on the cosine distance between their title vectors. Details of the database used in the sample can be found here: [Download and import the Wikipedia Article with Vector Embeddings](https://github.com/Azure-Samples/azure-sql-db-openai?tab=readme-ov-file#download-and-import-the-wikipedia-article-with-vector-embeddings)
  
```sql
DECLARE @v AS VECTOR(1536);
SELECT @v = title_vector FROM [dbo].[wikipedia_articles] WHERE title = 'Alan Turing';

SELECT TOP(10) 
  id, 
  title, 
  VECTOR_DISTANCE('cosine', @v, title_vector) AS distance 
FROM 
  [dbo].[wikipedia_articles] 
ORDER BY
  distance
```  

### Example 3

The following example returns all the similar articles to a given article, based on the cosine distance between their title vectors, selecting only those with a distance less than 0.3.
  
```sql
DECLARE @v AS VECTOR(1536);
SELECT @v = title_vector FROM [dbo].[wikipedia_articles] WHERE title = 'Alan Turing';

SELECT  
  id, 
  title,
  VECTOR_DISTANCE('cosine', @v, title_vector) AS distance
FROM 
  [dbo].[wikipedia_articles] 
WHERE
  VECTOR_DISTANCE('cosine', @v, title_vector) < 0.3
ORDER BY
  distance
```  

## Related content

- [Overview of vectors in the SQL Database Engine](../../relational-databases/vectors/vectors-sql-server.md)  
- [Azure SQL Database Vector Search Samples](https://github.com/Azure-Samples/azure-sql-db-vector-search)

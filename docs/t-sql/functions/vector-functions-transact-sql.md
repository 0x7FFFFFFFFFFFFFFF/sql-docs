---
title: "Vector functions (Transact-SQL)"
description: "Vector functions perform operations on vector type allowing applications to store and manipulate vectors in SQL Server."
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: damauri, pookam
ms.date: 10/10/2024
ms.service: sql
ms.subservice: system-objects
ms.topic: "reference"
helpviewer_keywords:
  - "vector search, system functions"
dev_langs:
  - "TSQL"
monikerRange: "= azuresqldb-current"
ms.collection: ce-skilling-ai-copilot
---

# Vector functions (preview)

[!INCLUDE [Azure SQL Database](../../includes/applies-to-version/asdb.md)]

The following scalar functions perform operations on [vectors](../../relational-databases/vectors/vectors-sql-server.md) in binary format, allowing applications to store and manipulate vectors in the SQL Database Engine.

> [!NOTE]
> Vector features are in preview and are subject to change. Make sure to read preview usage terms in the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services) document.

All Vector functions support the [**vector** data type](../../t-sql/data-types/vector-data-type.md).

|**Function**|**Description**|
|:--|:--|
| [VECTOR_DISTANCE](vector-distance-transact-sql.md) | Calculates the distance between two vectors using a specified distance metric. |
| [VECTOR_NORM](vector-norm-transact-sql.md) | Takes a vector as an input and returns the norm of the vector (which is a measure of its length or magnitude) in a given [norm type](https://mathworld.wolfram.com/VectorNorm.html). |
| [VECTOR_NORMALIZE](vector-normalize-transact-sql.md) | Takes a vector as an input and returns the normalized vector, which is a vector scaled to have a length of 1 in a given [norm type](https://mathworld.wolfram.com/VectorNorm.html). Adjusts a vector so that its length is normalized following the rules of specified norm type.|

## Related content

- [Vector data type](../data-types/vector-data-type.md)
- [Vectors in SQL Server](../../relational-databases/vectors/vectors-sql-server.md)
- [Intelligent applications with Azure SQL Database](/azure/azure-sql/database/ai-artificial-intelligence-intelligent-applications)

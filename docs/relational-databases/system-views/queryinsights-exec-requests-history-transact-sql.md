---
title: "queryinsights.exec_requests_history (Transact-SQL)"
description: "The queryinsights.exec_requests_history in Microsoft Fabric provides information about each complete SQL request."
author: WilliamDAssafMSFT
ms.author: mariyaali
ms.reviewer: mariyaali, randolphwest
ms.date: 1/23/2025
ms.service: sql
ms.topic: "reference"
f1_keywords:
  - "queryinsights.exec_requests_history"
  - "queryinsights.exec_requests_history_TSQL"
helpviewer_keywords:
  - "queryinsights.exec_requests_history system view"
  - "queryinsights.exec_requests_history"
  - "query insights frequently_run_queries"
dev_langs:
  - "TSQL"
monikerRange: "=fabric"
---
# queryinsights.exec_requests_history (Transact-SQL)

[!INCLUDE [fabric-se-and-dw](../../includes/applies-to-version/fabric-se-and-dw.md)]

The `queryinsights.exec_requests_history` in [!INCLUDE [fabric](../../includes/fabric.md)] provides information about each completed SQL request.

| Column name | Data type | Description |
| --- | --- | --- |
| `distributed_statement_id` | **uniqueidentifier** | Unique ID for each query. |
| `submit_time` | **datetime2** | Time at which the request was submitted for execution. |
| `start_time` | **datetime2** | Time when the query started running. |
| `command` | **varchar(8000)** | Complete text of the executed query. |
| `login_name` | **varchar(128)** | Name of the user or system that sent the query. |
| `program_name` | **varchar(128)** | Name of client program that initiated the session. The value is `NULL` for internal sessions. Is nullable. |
| `row_count` | **bigint** | Number of rows retrieved by the query. |
| `total_elapsed_time_ms` | **int** | Total time (in milliseconds) taken by the query to finish. |
| `status` | **varchar(30)** | Query status: `Succeeded`, `Failed`, or `Canceled` |
| `session_id` | **smallint** | ID linking the query to a specific user session. |
| `connection_id` | **uniqueidentifier** | Identification number for the query's connection. Nullable. |
| `batch_id` | **uniqueidentifier** | ID for grouped queries (if applicable). Nullable. |
| `root_batch_id` | **uniqueidentifier** | ID for the main group of queries (if nested). Nullable. |
| `query_hash` | **varchar(200)** | Binary hash value calculated on the query and used to identify queries with similar logic. You can use the query hash to correlate between Query Insight views. For more information, see [Query Insights - Aggregation](/fabric/data-warehouse/query-insights#similar-queries). |
| `label` | **varchar(8000)** | Optional label string associated with some `SELECT` query statements. |
| `allocated_cpu_time_ms` | **bigint** | Shows the total time of CPUs that was allocated for a query's execution. |
| `data_scanned_remote_storage_mb` | **decimal(18,3)** | Shows how much data was scanned/read from remote storage (One Lake). |
| `data_scanned_memory_mb` | **decimal(18,3)** | Shows how much data was scanned from local memory. Data scanned from disk and memory together indicates how much data was read from cache. |
| `data_scanned_disk_mb` | **decimal(18,3)** | Shows how much data was scanned/read from local disk. Data scanned from disk and memory together indicates how much data was read from cache. |

## Permissions

You should have access to a [[!INCLUDE [fabric-se](../../includes/fabric-se.md)]](/fabric/data-warehouse/data-warehousing#sql-endpoint-of-the-lakehouse) or [[!INCLUDE [fabric-dw](../../includes/fabric-dw.md)]](/fabric/data-warehouse/data-warehousing#synapse-data-warehouse) within a [Premium capacity](/power-bi/enterprise/service-premium-what-is) workspace with Contributor or above permissions.

## Related content

- [Query insights in Fabric data warehousing](/fabric/data-warehouse/query-insights)
- [Monitor connections, sessions, and requests using DMVs](/fabric/data-warehouse/monitor-using-dmv)
- [queryinsights.exec_sessions_history (Transact-SQL)](queryinsights-exec-sessions-history-transact-sql.md)
- [queryinsights.long_running_queries (Transact-SQL)](queryinsights-long-running-queries-transact-sql.md)
- [queryinsights.frequently_run_queries (Transact-SQL)](queryinsights-frequently-run-queries-transact-sql.md)

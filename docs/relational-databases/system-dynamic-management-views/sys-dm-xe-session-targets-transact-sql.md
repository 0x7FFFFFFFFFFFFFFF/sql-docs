---
title: "sys.dm_xe_session_targets (Transact-SQL)"
description: sys.dm_xe_session_targets returns information about *active* server-scoped session targets in extended events.
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/24/2024
ms.service: sql
ms.subservice: system-objects
ms.topic: "reference"
f1_keywords:
  - "sys.dm_xe_session_targets"
  - "dm_xe_session_targets_TSQL"
  - "dm_xe_session_targets"
  - "sys.dm_xe_session_targets_TSQL"
helpviewer_keywords:
  - "sys.dm_xe_session_targets dynamic management view"
  - "extended events [SQL Server], views"
dev_langs:
  - "TSQL"
---
# sys.dm_xe_session_targets (Transact-SQL)
[!INCLUDE [SQL Server SQL Managed Instance](../../includes/applies-to-version/sql-asdbmi.md)]

Returns information about *active* server-scoped session targets.

Azure SQL Database supports only database-scoped sessions. See [sys.dm_xe_database_session_targets](sys-dm-xe-database-session-targets-azure-sql-database.md).
  
|Column name|Data type|Description|  
|-----------------|---------------|-----------------|  
| `event_session_address` |**varbinary(8)**|The memory address of the event session. Has a many-to-one relationship with `sys.dm_xe_sessions.address`. Is not nullable.|  
| `target_name` |**nvarchar(60)**|The name of the target within a session. Is not nullable.|  
| `target_package_guid` |**uniqueidentifier**|The GUID of the package that contains the target. Is not nullable.|  
| `execution_count` |**bigint**|The number of times the target has been executed for the session. Is not nullable.|  
| `execution_duration_ms` |**bigint**|The total amount of time, in milliseconds, that the target has been executing. Is not nullable.|  
| `target_data` |**nvarchar(max)**|The data that the target maintains, such as event aggregation information. Is nullable.|
| `bytes_written` |**bigint**|**Applies to:** SQL Server 2017 and later. Number of bytes written to target. Is not nullable. |
  
## Permissions

Requires VIEW SERVER STATE permission on the server.  
  
### Permissions for SQL Server 2022 and later

Requires VIEW SERVER PERFORMANCE STATE permission on the server.

## Relationship cardinalities
  
|From|To|Relationship|  
|----------|--------|------------------|  
| `sys.dm_xe_session_targets.event_session_address` | `sys.dm_xe_sessions.address` |Many-to-one|

## Related content

- [Dynamic Management Views and Functions (Transact-SQL)](system-dynamic-management-views.md)
- [sys.dm_xe_sessions (Transact-SQL)](sys-dm-xe-sessions-transact-sql.md)
- [sys.dm_xe_session_events (Transact-SQL)](sys-dm-xe-session-events-transact-sql.md)
- [Extended Events overview](../extended-events/extended-events.md)
- [Quickstart: Extended Events](../extended-events/quick-start-extended-events-in-sql-server.md)

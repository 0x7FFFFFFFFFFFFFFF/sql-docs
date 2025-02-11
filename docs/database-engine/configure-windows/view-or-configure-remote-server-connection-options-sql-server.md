---
title: "View or Configure Remote Server Connection Options (SQL Server)"
description: Learn how to view or configure remote server connection options at the server level. You can use SQL Server Management Studio or Transact-SQL for this purpose.
author: rwestMSFT
ms.author: randolphwest
ms.date: 12/02/2024
ms.service: sql
ms.subservice: configuration
ms.topic: conceptual
helpviewer_keywords:
  - "remote servers [SQL Server], connection options"
  - "servers [SQL Server], remote"
  - "connections [SQL Server], remote servers"
---
# View or Configure Remote Server Connection Options (SQL Server)
 [!INCLUDE [SQL Server](../../includes/applies-to-version/sqlserver.md)]

This article describes how to view or configure remote server connection options at the server level in [!INCLUDE[ssnoversion](../../includes/ssnoversion-md.md)] by using [!INCLUDE[ssManStudioFull](../../includes/ssmanstudiofull-md.md)] or [!INCLUDE[tsql](../../includes/tsql-md.md)].  

> [!IMPORTANT]  
> [!INCLUDE [ssNoteDepFutureAvoid](../../includes/ssnotedepfutureavoid-md.md)]

<a name="Security"></a>

## Permissions

Executing `sp_serveroption` requires ALTER ANY LINKED SERVER permission on the server.  
  
<a id="SSMSProcedure"></a> 
<a id="using-sql-server-management-studio"></a>

## Use SQL Server Management Studio
  
<a id="to-view-or-configure-remote-server-connection-options"></a>

### View or configure remote server connection options
  
1. In Object Explorer, right-click a server, and then select **Properties**.  
  
1. In the **SQL Server Properties - \<**_server_name_**>** dialog box, select **Connections**.
 
1. On the **Connections** page, review the **Remote server connections** settings, and modify them if necessary.  
  
1. Repeat steps 1 through 3 on the other server of the remote server pair.  
  
<a id="TsqlProcedure"></a> <a id="using-transact-sql"></a>

## Use Transact-SQL
  
<a id="to-view-remote-server-connection-options"></a>

### View remote server connection options
  
1. Connect to the [!INCLUDE[ssDE](../../includes/ssde-md.md)].  
  
1. From the **Standard** bar, select **New Query**.  
  
1. Copy and paste the following example into the query window and select **Execute**. This example uses [sp_helpserver](../../relational-databases/system-stored-procedures/sp-helpserver-transact-sql.md) to return information about all remote servers.  
  
```sql  
USE master;  
GO  
EXEC sp_helpserver ;  
```  
  
<a id="to-configure-remote-server-connection-options"></a>

#### Configure remote server connection options
  
1. Connect to the [!INCLUDE[ssDE](../../includes/ssde-md.md)].  
  
1. From the **Standard** bar, select **New Query**.  

1. Copy and paste the following example into the query window and select **Execute**. This example shows how to use [sp_serveroption](../../relational-databases/system-stored-procedures/sp-serveroption-transact-sql.md) to configure a remote server. The example configures a remote server corresponding to another instance of [!INCLUDE[ssNoVersion](../../includes/ssnoversion-md.md)], `SEATTLE3`, to be collation compatible with the local instance of [!INCLUDE[ssNoVersion](../../includes/ssnoversion-md.md)].  
  
```sql  
USE master;  
EXEC sp_serveroption 'SEATTLE3', 'collation compatible', 'true';  
```  
  
<a id="FollowUp"></a>

## Follow Up: After you configure remote server connection options

 The remote server must be stopped and restarted before the setting can take effect.  
  
## Related content

- [Server configuration: remote access](configure-the-remote-access-server-configuration-option.md)
- [Server configuration options](server-configuration-options-sql-server.md)
- [Remote Servers](remote-servers.md)
- [Linked Servers (Database Engine)](../../relational-databases/linked-servers/linked-servers-database-engine.md)
- [sp_linkedservers (Transact-SQL)](../../relational-databases/system-stored-procedures/sp-linkedservers-transact-sql.md)
- [sp_helpserver (Transact-SQL)](../../relational-databases/system-stored-procedures/sp-helpserver-transact-sql.md)
- [sp_serveroption (Transact-SQL)](../../relational-databases/system-stored-procedures/sp-serveroption-transact-sql.md)
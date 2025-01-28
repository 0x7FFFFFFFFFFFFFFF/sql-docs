---
title: "MSSQLSERVER_41986"
description: "MSSQLSERVER_41986"
author: djordje-jeremic
ms.author: djjeremi
ms.date: 12/06/2024
ms.service: sql
ms.subservice: supportability
ms.topic: "reference"
helpviewer_keywords:
  - "41986 (Database Engine error)"
---
# MSSQLSERVER_41986

 [!INCLUDE [SQL MI](../../includes/applies-to-version/asmi.md)]
  
## Details  
  
| Attribute | Value |  
| :-------- | :---- |  
|Product Name|[!INCLUDE[ssNoVersion](../../includes/ssnoversion-md.md)]|  
|Event ID|41986|  
|Event Source|MSSQLSERVER|  
|Component|SQLEngine|  
|Message Text|Azure SQL Managed Instance link creation failed because either connection to SQL Server failed, or the server did not respond after a prolonged period of time. Verify the network connectivity and firewall rules between SQL Server and Managed Instance are properly configured and retry again.|  
  
## Explanation  

The link failed to create because either: 
- the connection to the secondary replica failed
- the server didn't respond after a prolonged period of time


Error 41986 could be due to network connectivity issues or incorrectly configured firewall rules during the link creation process, or after the link is already created.

## User Action  

Verify that network connectivity was successfully established between SQL Server and Azure SQL Managed Instance, and that firewall rules are correctly configured, as described in [Configure network connectivity](/azure/azure-sql/managed-instance/managed-instance-link-preparation#configure-network-connectivity). Retry the operation after connection has been verified successfully. 

## Related content

- [Managed Instance link overview](/azure/azure-sql/managed-instance/managed-instance-link-feature-overview)
- [Prepare environment for the link](/azure/azure-sql/managed-instance/managed-instance-link-preparation)
- [Configure link with SSMS](/azure/azure-sql/managed-instance/managed-instance-link-configure-how-to-ssms)
- [Configure link with scripts](/azure/azure-sql/managed-instance/managed-instance-link-configure-how-to-scripts)
- [Troubleshoot issues with the link](/azure/azure-sql/managed-instance/managed-instance-link-troubleshoot-how-to)

---
title: Network Security Perimeter
titleSuffix: Azure SQL Database & Azure Synapse Analytics
description: Overview of Network Security Perimeter for Azure SQL Database
author: VanMSFT
ms.author: vanto
ms.reviewer: wiassaf, vanto, mathoma
ms.date: 11/19/2024
ms.service: azure-sql-database
ms.subservice: security
ms.topic: conceptual
---

# Network Security Perimeter for Azure SQL Database and Azure Synapse Analytics

[!INCLUDE [appliesto-sqldb-asa](../includes/appliesto-sqldb-asa-formerly-sqldw.md)]

Network Security Perimeter (preview) secures both inbound and outbound network traffic between Azure SQL Database and other Platform as a Service (PaaS) resources (for example, Azure Storage and Azure Key Vault). Any attempts made to communicate with Azure resources that aren't inside the perimeter is blocked.

> [!IMPORTANT]  
> - This article applies to both Azure SQL Database and [dedicated SQL pool (formerly SQL DW)](/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is) in Azure Synapse Analytics. These settings apply to all SQL Database and dedicated SQL pool (formerly SQL DW) databases associated with the server. For simplicity, the term 'database' refers to both databases in Azure SQL Database and Azure Synapse Analytics. Likewise, any references to 'server' is referring to the [logical SQL server](logical-servers.md) that hosts Azure SQL Database and dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics. This article does *not* apply to Azure SQL Managed Instance or dedicated SQL pools in Azure Synapse Analytics workspaces.

## Associate SQL Database with a Network Security Perimeter in the Azure portal

1. Search for **Network Security Perimeter** in the Azure portal search bar and then select the **Create** button and create the resource.
1. Provide a **Name** and **Region** and choose the subscription.
1. Under the **Resources** section, select the **Associate** button and navigate to the SQL Database you want to add.

   :::image type="content" source="media/network-security-perimeter/associate-sql-network-security-perimeter.png" alt-text="Screenshot of creating a network security perimeter in the Azure portal.":::

1. Go through the rest of the creation process without entering anything in **Inbound access rules** or **Outbound access rules**.

## Using SQL Database with a Network Security Perimeter

By default, Network Security Perimeter uses [Learning Mode](/azure/private-link/network-security-perimeter-concepts#access-modes-in-network-security-perimeter), which can be used to log all traffic to and from SQL Database. The network traffic can be logged to a Log Analytics Workspace or Azure Storage account using [Diagnostic logging for Azure Network Security Perimeter](/azure/private-link/network-security-perimeter-diagnostic-logs). Finally, Network Security Perimeter can be switched to **Enforced** mode. In **Enforced** mode, any access denied shows the following error:

```output
Error 42118
Login failed because the network security perimeter denied inbound access.
```

## Related content

- [Quickstart: Create a network security perimeter - Azure portal](/azure/private-link/create-network-security-perimeter-portal)
- [Quickstart: Create a network security perimeter - Azure PowerShell](/azure/private-link/create-network-security-perimeter-powershell)
- [Quickstart: Create a network security perimeter - Azure CLI](/azure/private-link/create-network-security-perimeter-cli)
- [Azure SQL Connectivity Architecture](connectivity-architecture.md)

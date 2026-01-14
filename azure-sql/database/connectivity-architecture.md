---
title: Connectivity architecture
titleSuffix: Azure SQL Database and SQL database in Fabric
description: This article explains the connectivity architecture for database connections from within Azure or from outside of Azure for Azure SQL Database, SQL database in Fabric
author: VanMSFT
ms.author: vanto
ms.reviewer: wiassaf, mathoma
ms.date: 03/18/2025
ms.service: azure-sql-database
ms.subservice: connect
ms.topic: concept-article
ms.custom:
  - fasttrack-edit
  - sqldbrb=1
  - references_regions
monikerRange: "=azuresql || =azuresql-db || =fabricsql"
---
# Connectivity architecture

[!INCLUDE [appliesto-sqldb-fabricsqldb](../includes/appliesto-sqldb-fabricsqldb.md)]

This article explains architecture of various components that direct network traffic to a server in Azure SQL Database and SQL database in Microsoft Fabric. Learn more about different connection policies and how they impact clients connecting from within Azure and clients connecting from outside of Azure.

- For connection strings to Azure SQL Database, see [Connect and query to Azure SQL Database](connect-query-content-reference-guide.md).
- For settings that control connectivity to the [logical server](logical-servers.md) for Azure SQL Database, see [connectivity settings](connectivity-settings.md).
- This article does *not* apply to **Azure SQL Managed Instance**. Refer to [Connectivity architecture for Azure SQL Managed Instance](../managed-instance/connectivity-architecture-overview.md).
- This article does *not* apply to dedicated SQL pools in Azure Synapse Analytics. 
    - For settings that control connectivity to dedicated SQL pools in Azure Synapse Analytics, see [Azure Synapse Analytics connectivity settings](/azure/synapse-analytics/security/connectivity-settings).
    - For connection strings to Azure Synapse Analytics pools, see [Connect to Synapse SQL](/azure/synapse-analytics/sql/connect-overview).

## Connectivity architecture

The following diagram provides a high-level overview of the connectivity architecture.

:::image type="content" source="media/connectivity-architecture/connectivity-overview.svg" alt-text="Diagram that shows a high-level overview of the connectivity architecture.":::

The following steps describe how a connection is established:

- Clients connect to the gateway that has a public IP address and listens on port 1433.
- Depending on the effective connection policy, the gateway redirects or proxies the traffic to the correct database cluster.
- Inside the database cluster, traffic is forwarded to the appropriate database.

## Connection policy

Logical SQL servers support the following three options for the server's connection policy setting. 

- **Redirect (recommended):** Clients establish connections directly to the node hosting the database, leading to reduced latency and improved throughput. For connections to use this mode, clients need to:
   - Allow outbound communication from the client to all Azure SQL IP addresses in the region on ports in the range of 11000 to 11999. Use the Service Tags for SQL to make this easier to manage. If you are using Private Link, see [Use Redirect connection policy with private endpoints](private-endpoint-overview.md#use-redirect-connection-policy-with-private-endpoints) for the port ranges to allow.
   - Allow outbound communication from the client to Azure SQL Database gateway IP addresses on port 1433.
   - When using the Redirect connection policy, refer to the [Azure IP Ranges and Service Tags - Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519) for a list of your region's IP addresses to allow.
- **Proxy:** In this mode, all connections are proxied via the Azure SQL Database gateways, leading to increased latency and reduced throughput. For connections to use this mode, clients need to allow outbound communication from the client to Azure SQL Database gateway IP addresses on port 1433.
   - When using the Proxy connection policy, refer to the [Gateway IP addresses](#gateway-ip-addresses) list later in this article for your region's IP addresses to allow.
- **Default:** This is the connection policy in effect on all servers after creation unless you explicitly alter the connection policy to either `Proxy` or `Redirect`. The default policy is:
   - `Redirect` for all client connections originating inside of Azure (for example, from an Azure Virtual Machine). 
   - `Proxy` for all client connections originating outside (for example, connections from your local workstation).
   - Currently, the connection policy for [SQL database in Microsoft Fabric](/fabric/database/sql/limitations#connection-policy) is **default** and cannot be changed.

We highly recommend the `Redirect` connection policy over the `Proxy` connection policy for the lowest latency and highest throughput. However, you need to meet the extra requirements for allowing network traffic for outbound communication:

- If the client is an Azure Virtual Machine, you can accomplish this using Network Security Groups (NSG) with [service tags](/azure/virtual-network/network-security-groups-overview#service-tags). 
- If the client is connecting from a workstation on-premises, you might need to work with your network admin to allow network traffic through your corporate firewall.

To change the connection policy, see [Change the connection policy](connectivity-settings.md#change-the-connection-policy).

## Connectivity from within Azure

If you're connecting from within Azure your connections have a connection policy of `Redirect` by default. A policy of `Redirect` means that after the TCP session is established, the client session is then redirected to the right database cluster with a change to the destination virtual IP from that of the Azure SQL Database gateway to that of the cluster. Thereafter, all subsequent packets flow directly to the cluster, bypassing the gateway. The following diagram illustrates this traffic flow.

:::image type="content" source="media/connectivity-architecture/connectivity-azure.svg" alt-text="Diagram of the architecture overview of Azure SQL connectivity via redirection within Azure.":::

## Connectivity from outside of Azure

If you're connecting from outside Azure, your connections have a connection policy of `Proxy` by default. A policy of `Proxy` means that the TCP session is established via the Azure SQL Database gateway and all subsequent packets flow via the gateway. The following diagram illustrates this traffic flow.

:::image type="content" source="media/connectivity-architecture/connectivity-outside-azure.svg" alt-text="Diagram that shows how the TCP session is established via the Azure SQL Database gateway and all subsequent packets flow via the gateway.":::

> [!IMPORTANT]  
> Open TCP ports 1434 and 14000-14999 to enable [Connecting with DAC](/sql/database-engine/configure-windows/diagnostic-connection-for-database-administrators#connecting-with-dac).

## Gateway IP addresses

This section lists the IP address ranges assigned to the regional gateways of SQL Database.

When the proxy [connection policy](#connection-policy) is in effect, database clients must be able to reach all given IP addresses in all ranges for the region of the logical server. With the redirect connection type, clients must be able to reach a wider set of IP addresses; refer to the `Sql.\<region\>` service tags in [Azure IP Ranges and Service Tags - Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519) for a complete list.

Clients connecting to private endpoints don't need connectivity to any of these ranges because a private endpoint has direct connectivity to the gateways.

[!INCLUDE [gateway-ip-addresses](includes/gateway-ip-addresses.md)]

## Related content

- For information about Azure SQL Database connection behavior for clients that use ADO.NET 4.5 or a later version, see [Ports beyond 1433 for ADO.NET 4.5](adonet-v12-develop-direct-route-ports.md).
- For general application development overview information, see [SQL Database Application Development Overview](develop-overview.md).
- Refer to [Azure IP Ranges and Service Tags - Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519).

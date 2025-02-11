---
title: How to Manage a Hyperscale Database
description: How to manage a Hyperscale database, including migrating to Hyperscale, restoring to a different region, and reverse migration.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: dfurman, blakhani
ms.date: 02/10/2025
ms.service: azure-sql-database
ms.subservice: service-overview
ms.topic: conceptual
ms.custom:
  - devx-track-azurepowershell
  - devx-track-azurecli
monikerRange: "=azuresql || =azuresql-db"
---

# How to manage a Hyperscale database

[!INCLUDE [appliesto-sqldb](../includes/appliesto-sqldb.md)]

The [Hyperscale service tier](service-tier-hyperscale.md) provides a highly scalable storage and compute performance tier that leverages the Azure architecture to scale out storage and compute resources for an Azure SQL Database substantially beyond the limits available for the General Purpose and Business Critical service tiers. 

This article links to important guides to carry out essential administration tasks for Hyperscale databases, including converting an existing database to Hyperscale, restoring a Hyperscale database to a different region, reverse migrating from Hyperscale to another service tier, and monitoring the status of ongoing and recent operations against a Hyperscale database.

Learn how to create a new Hyperscale database in [Quickstart: Create a Hyperscale database in Azure SQL Database](hyperscale-database-create-quickstart.md).

## Monitor operations for a Hyperscale database

You can monitor the status of ongoing or recently completed operations for an Azure SQL Database using the Azure portal, the Azure CLI, PowerShell, or Transact-SQL.

Select the tab for your preferred method to monitor operations.

# [Portal](#tab/azure-portal)

The Azure portal shows a notification for a database in Azure SQL Database when an operation such as a migration, reverse migration, or restore is in progress.

:::image type="content" source="media/manage-hyperscale-database/ongoing-operation-notification-azure-sql-database-azure-portal.png" alt-text="Screenshot of the overview panel of a database in Azure SQL Database. A notification of an ongoing operation appears in the notification area at the bottom of the panel." lightbox="media/manage-hyperscale-database/ongoing-operation-notification-azure-sql-database-azure-portal.png":::

1. Navigate to the database in the Azure portal.
1. In the left navigation bar, select **Overview**.
1. Review the **Notifications** section at the bottom of the right pane. If operations are ongoing, a notification box appears.
1. Select the notification box to view details.
1. The **Ongoing operations** pane opens. Review the details of the ongoing operations.

# [Azure CLI](#tab/azure-cli)

This code sample calls [az sql db op list](/cli/azure/sql/db/op#az-sql-db-op-list) to return recent or ongoing operations for a database in Azure SQL Database.

Replace `resourceGroupName`, `serverName`, `databaseName`, and `serviceObjective` with the appropriate values before running the following code sample:

```azurecli-interactive
resourceGroupName="myResourceGroup"
serverName="server01"
databaseName="mySampleDatabase"

az sql db op list -g $resourceGroupName -s $serverName --database $databaseName
```

# [PowerShell](#tab/azure-powershell)

The [Get-AzSqlDatabaseActivity](/powershell/module/az.sql/get-azsqldatabaseactivity) cmdlet returns recent or ongoing operations for a database in Azure SQL Database.

Set the `$resourceGroupName`, `$serverName`, and `$databaseName` parameters to the appropriate values for your database before running the sample code:

```powershell-interactive
$resourceGroupName = "myResourceGroup"
$serverName = "server01"
$databaseName = "mySampleDatabase"

Get-AzSqlDatabaseActivity -ResourceGroupName $resourceGroupName -ServerName $serverName -DatabaseName $databaseName
```

# [Transact-SQL](#tab/t-sql)

To monitor operations for a Hyperscale database, first connect to the `master` database on your [logical server](logical-servers.md) using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms), [Azure Data Studio](/azure-data-studio/download-azure-data-studio), or the client of your choice to run Transact-SQL commands.

Query the [sys.dm_operation_status](/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database) Dynamic Management View to review information about recent operations performed on databases on your [logical server](logical-servers.md].

This code sample returns all entires in `sys.dm_operation_status` for the specified database, sorted by which operations began most recently. Replace the database name with the appropriate value before running the code sample.

```sql
SELECT *
FROM sys.dm_operation_status
WHERE major_resource_id = 'mySampleDatabase'
ORDER BY start_time DESC;
GO
```

---

## View databases in the Hyperscale service tier

After migrating a database to Hyperscale or reconfiguring a database within the Hyperscale service tier, you might wish to view and/or document the configuration of your Hyperscale database.

# [Portal](#tab/azure-portal)

The Azure portal shows a list of all databases on a [logical server](logical-servers.md). The **Pricing tier** column includes the service tier for each database.

:::image type="content" source="media/manage-hyperscale-database/database-list-azure-portal.png" alt-text="Screenshot of the overview panel of a logical server in Azure SQL Database, databases at the bottom of the panel." lightbox="media/manage-hyperscale-database/database-list-azure-portal.png":::

1. Navigate to your [logical server](logical-servers.md) in the Azure portal.
1. In the left navigation bar, select **Overview**.
1. Scroll to the list of resources at the bottom of the pane. The window displays the SQL elastic pools and databases on the logical server.
1. Review the **Pricing tier** column to identify databases in the Hyperscale service tier.

# [Azure CLI](#tab/azure-cli)

This Azure CLI code sample calls [az sql db list](/cli/azure/sql/db/op#az-sql-db-list) to list Hyperscale databases on a [logical server](logical-servers.md) with their name, location, service level objective, maximum size, and number of high availability replicas.

Replace `resourceGroupName` and `serverName` with the appropriate values before running the following code sample:

```azurecli-interactive
resourceGroupName="myResourceGroup"
serverName="server01"

az sql db list -g $resourceGroupName -s $serverName --query "[].{Name:name, Location:location, SLO:currentServiceObjectiveName, Tier:currentSku.tier, maxSizeBytes:maxSizeBytes,HAreplicas:highAvailabilityReplicaCount}[?Tier=='Hyperscale']" --output table
```

# [PowerShell](#tab/azure-powershell)

The Azure PowerShell [Get-AzSqlDatabase](/powershell/module/az.sql/get-azsqldatabase) cmdlet returns a list of Hyperscale databases on a [logical server](logical-servers.md) with their name, location, service level objective, maximum size, and number of high availability replicas.

Set the `$resourceGroupName` and `$serverName` parameters to the appropriate values before running the sample code:

```powershell-interactive
$resourceGroupName = "myResourceGroup"
$serverName = "server01"

Get-AzSqlDatabase -ResourceGroupName $resourceGroupName -ServerName $serverName | `
    Where-Object { $_.Edition -eq 'Hyperscale' } | `
        Select-Object DatabaseName, Location, currentServiceObjectiveName, Edition, `
        MaxSizeBytes, HighAvailabilityReplicaCount | `
            Format-Table
```

Review the **Edition** column to identify databases in the Hyperscale service tier.

# [Transact-SQL](#tab/t-sql)

To review the service tiers of all Hyperscale databases on a [logical server](logical-servers.md) with Transact-SQL, first connect to the `master` database using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/azure-data-studio/download-azure-data-studio).

Query the [sys.database_service_objectives](/sql/relational-databases/system-catalog-views/sys-database-service-objectives-azure-sql-database) system catalog view to review databases in the Hyperscale service tier:

```sql
SELECT d.name, dso.edition, dso.service_objective
FROM sys.database_service_objectives AS dso
JOIN sys.databases as d on dso.database_id = d.database_id
WHERE dso.edition = 'Hyperscale';
GO
```

<a id="migrate-an-existing-database-to-hyperscale"></a>

## Convert database to Hyperscale

You can convert an existing database in Azure SQL Database to Hyperscale using the Azure portal, the Azure CLI, PowerShell, or Transact-SQL. 

The conversion process is divided into two phases - the conversion of data, which occurs while the existing database is online, and then a cutover to the new Hyperscale database. You have the ability to choose when the cutover occurs - as soon as the database is ready, or manually at a time of your choosing. 

For more information and steps, see [Convert an existing database to Hyperscale](convert-to-hyperscale.md).

<a id="reverse-migrate-from-hyperscale"></a>

## Reverse migrate from Hyperscale

Reverse migration to the General Purpose service tier allows customers who have recently converted an existing database in Azure SQL Database to Hyperscale to move back in an emergency, should Hyperscale not meet their needs. While reverse migration is initiated by a service tier change, it's essentially a size-of-data move between different architectures.

For more information and steps, see [Reverse migrate a database from Hyperscale](reverse-migrate-from-hyperscale.md).

---

## Related content

- [Quickstart: Create a Hyperscale database in Azure SQL Database](hyperscale-database-create-quickstart.md)
- [Hyperscale service tier](service-tier-hyperscale.md)
- [Azure SQL Database Hyperscale FAQ](service-tier-hyperscale-frequently-asked-questions-faq.yml)
- [Hyperscale secondary replicas](service-tier-hyperscale-replicas.md)
- [Azure SQL Database Hyperscale named replicas FAQ](service-tier-hyperscale-frequently-asked-questions-faq.yml#read-scale-out-questions)
- [Convert an existing database to Hyperscale](convert-to-hyperscale.md)
- [Reverse migrate a database from Hyperscale](reverse-migrate-from-hyperscale.md)
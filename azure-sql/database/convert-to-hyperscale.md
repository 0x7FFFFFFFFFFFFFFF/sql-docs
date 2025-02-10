---
title: Convert a Database to Hyperscale
description: How to convert an Azure SQL Database to the Hyperscale tier.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: dfurman, blakhani
ms.date: 02/10/2025
ms.service: azure-sql-database
ms.topic: how-to
ms.custom:
  - devx-track-azurepowershell
  - devx-track-azurecli
monikerRange: "=azuresql || =azuresql-db"
---

# Convert an existing database to Hyperscale

You can convert an existing database in Azure SQL Database to Hyperscale using the Azure portal, the Azure CLI, PowerShell, or Transact-SQL.

## Manual cutover

The conversion process is divided into two stages - the conversion of data, which occurs while the existing database is online, and then a cutover to the new Hyperscale database. 

- The time required to move an existing database to Hyperscale consists of the time to copy data and the time to replay the changes made in the source database while copying data. The data copy time is proportional to data size. We recommend converting to Hyperscale during a lower write activity period so that the time to replay accumulated changes is shorter.
- You'll only experience a short period of downtime, generally less than a minute, during the final cutover to Hyperscale. You have the ability to choose when the cutover occurs - as soon as the database is ready, or manually at a time of your choosing. 

> [!NOTE]
> The ability to initiate a manual cutover for a conversion to Hyperscale is a preview feature.

In the current preview, during a conversion to Hyperscale, you have three days to initiate the manual cutover after the point when the database ready for cutover. You can initiate a manual cutover via the Azure portal, Azure CLI, PowerShell, or T-SQL.

## Prerequisites

To convert a database that is a part of a [geo-replication](active-geo-replication-overview.md) relationship, either as the primary or as a secondary, to Hyperscale, you need to first terminate geo-replication between the primary and secondary replica. Databases in a [failover group](failover-group-sql-db.md) must be removed from the group first.

Once a database has been moved to Hyperscale, you can create a new Hyperscale geo-replica for that database or add the database to a failover group.

Direct conversion from the Basic service tier to Hyperscale is not supported. To perform this conversion, first change the database to any service tier other than Basic (for example, General Purpose), and then proceed with the conversion to Hyperscale.  

## Convert a database to Hyperscale

To convert an existing Azure SQL Database to Hyperscale, first identify your target service objective. 

Review [resource limits for single databases](resource-limits-vcore-single-databases.md) if you aren't sure which service objective is right for your database. In many cases, you can choose a service objective with the same number of vCores and the same hardware generation as the original database. If needed, you can [change the service objective](scale-resources.md) later with minimal downtime.

Select the tab for your preferred method to convert your database:

# [Portal](#tab/azure-portal)

The Azure portal enables you to convert to Hyperscale by modifying the service tier for your database.

:::image type="content" source="media/convert-to-hyperscale/service-tier-dropdown-azure-sql-database-azure-portal.png" alt-text="Screenshot of the compute + storage panel of a database in Azure SQL Database. The service tier dropdown is expanded, displaying the option for the Hyperscale service tier." lightbox="media/convert-to-hyperscale/service-tier-dropdown-azure-sql-database-azure-portal.png":::

1. Navigate to the database you wish to convert in the Azure portal.
1. In the left navigation bar, select **Compute + storage**.
1. Select the **Service tier** dropdown list to expand the options for service tiers.
    1. If you were using the [Azure SQL Database free offer](free-offer.md), select the button to remove the **Free database offer**. Then you'll see the **Service tier** dropdown list.
1. Select **Hyperscale** from the dropdown list.
1. Review the **Compute tier** and choose **Provisioned** or **Serverless**. 
1. Review the **Cutover mode**, a choice specific to conversion to Hyperscale.
    - The cutover occurs after the database is prepared for conversion to Hyperscale. **Cutover mode** determines when connectivity to the existing Azure SQL Database will be momentarily disrupted for the conversion to Hyperscale:
        - **Automatic cutover** performs the cutover as soon as the Hyperscale database is ready. 
        - **Manual cutover** prompts you to initiate the cutover at a time of your choice in the Azure portal. This option is most useful to time the cutover for minimal business disruption.
1. Review the **Hardware Configuration** listed. If desired, select **Change configuration** to select the appropriate hardware configuration for your workload.
1. Select the **vCores** slider if you wish to change the number of vCores available for your database under the Hyperscale service tier.
1. Select the **High-Availability Secondary Replicas** slider if you wish to change the number of replicas under the Hyperscale service tier. 
1. Select **Apply**.
1. Monitor the conversion in the Azure portal. 
    1. Navigate to the database in the Azure portal.
    1. In the left navigation bar, select **Overview**.
    1. Review the **Notifications** section at the bottom of the right pane. If operations are ongoing, a notification box appears.
    1. Select the notification box to view details.
    1. The **Ongoing operations** pane opens. Review the details of the ongoing operations.

If you selected **Manual cutover**, the Azure portal will present you a **Cutover** button when ready.

:::image type="content" source="media/convert-to-hyperscale/cutover.png" alt-text="Screenshot from the Azure portal showing the Cutover button in a Hyperscale conversion.":::

# [Azure CLI](#tab/azure-cli)

This code sample calls [az sql db update](/cli/azure/sql/db#az-sql-db-update) to convert an existing Azure SQL Database to Hyperscale. You must specify both the edition and service objective. Replace `resourceGroupName`, `serverName`, `databaseName`, and `serviceObjective` with the appropriate values before running the following code sample:

```azurecli-interactive
resourceGroupName="myResourceGroup"
serverName="server01"
databaseName="mySampleDatabase"
serviceObjective="HS_Gen5_2"

az sql db update -g $resourceGroupName -s $serverName -n $databaseName \
    --edition Hyperscale --service-objective $serviceObjective
```

Use `--manual-cutover` to choose to manually initiate the cutover to Hyperscale at a time of your choice. This option is most useful to time the cutover for minimal business disruption. For example:

```azurecli-interactive
resourceGroupName="myResourceGroup"
serverName="server01"
databaseName="mySampleDatabase"
serviceObjective="HS_Gen5_2"

az sql db update -g $resourceGroupName -s $serverName -n $databaseName --edition Hyperscale --service-objective $serviceObjective --manual-cutover
```

Monitor the ongoing operation with [az sql db op list](/cli/azure/sql/db/op#az-sql-db-op-list), to return recent or ongoing operations for a database in Azure SQL Database.

```azurecli-interactive
resourceGroupName="myResourceGroup"
serverName="server01"
databaseName="mySampleDatabase"

az sql db op list -g $resourceGroupName -s $serverName -n $databaseName
```

Use `--perform-cutover` to initiate the cutover (within 3 days) once the Hyperscale database is ready:

```azurecli-interactive
az sql db update -g $resourceGroupName -s $serverName -n $databaseName --perform-cutover
```

# [PowerShell](#tab/azure-powershell)

The following example uses the [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase) cmdlet to convert an existing Azure SQL Database to Hyperscale. You must specify both the edition and service objective. Replace `$resourceGroupName`, `$serverName`, `$databaseName`, and `$serviceObjective` with the appropriate values before running this code sample:

```powershell-interactive
$resourceGroupName = "myResourceGroup"
$serverName = "server01"
$databaseName = "mySampleDatabase"
$serviceObjective = "HS_Gen5_2"

Set-AzSqlDatabase -ResourceGroupName $resourceGroupName `
    -ServerName $serverName `
    -DatabaseName $databaseName `
    -Edition "Hyperscale" `
    -RequestedServiceObjectiveName $serviceObjective
```

Use `-ManualCutover` to manually initiate the cutover at a time of your choice. This option is most useful to time the cutover for minimal business disruption. For example:

```powershell-interactive
$resourceGroupName = "myResourceGroup"
$serverName = "server01"
$databaseName = "mySampleDatabase"
$serviceObjective = "HS_Gen5_2"

Set-AzSqlDatabase -ResourceGroupName $resourceGroupName `
    -ServerName $serverName `
    -DatabaseName $databaseName `
    -Edition "Hyperscale" `
    -RequestedServiceObjectiveName $serviceObjective `
    -ManualCutover
```

Monitor the operation in progress with the [Get-AzSqlDatabaseActivity](/powershell/module/az.sql/get-azsqldatabaseactivity) cmdlet, which returns recent or ongoing operations for a database in Azure SQL Database. Set the `$resourceGroupName`, `$serverName`, and `$databaseName` parameters to the appropriate values for your database before running the sample code:

```powershell-interactive
$resourceGroupName = "myResourceGroup"
$serverName = "server01"
$databaseName = "mySampleDatabase"

Get-AzSqlDatabaseActivity -ResourceGroupName $resourceGroupName `
    -ServerName $serverName `
    -DatabaseName $databaseName
```

Use `-PerformCutover` to initiate the cutover once the Hyperscale database is ready:

```powershell-interactive
$resourceGroupName = "myResourceGroup"
$serverName = "server01"
$databaseName = "mySampleDatabase"
$serviceObjective = "HS_Gen5_2"

Set-AzSqlDatabase -ResourceGroupName $resourceGroupName `
    -ServerName $serverName `
    -DatabaseName $databaseName `
    -Edition "Hyperscale" `
    -RequestedServiceObjectiveName $serviceObjective `
    -PerformCutover
```

# [Transact-SQL](#tab/t-sql)

To convert an existing Azure SQL Database to Hyperscale with Transact-SQL, first connect to the `master` database on your [logical SQL server](logical-servers.md) using the [Azure portal Query editor for Azure SQL Database](query-editor.md), [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) or [the mssql extension for Visual Studio Code](/sql/tools/visual-studio-code-extensions/mssql/mssql-extension-visual-studio-code).

You must specify both the edition and service objective in the [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql?view=azuresqldb-current&preserve-view=true) statement.

This example statement converts a database named `mySampleDatabase` to Hyperscale with the `HS_Gen5_2` service objective. Replace the database name with the appropriate value before executing the statement.

```sql
ALTER DATABASE [mySampleDatabase]
   MODIFY (EDITION = 'Hyperscale', SERVICE_OBJECTIVE = 'HS_Gen5_2');
GO
```

By default, the database will perform a cutover to the Hyperscale database to finish the conversion as soon as the Hyperscale database is available. Optionally, use the `MANUAL_CUTOVER` argument to instead start a conversion that will end with a manually initiated cutover, at a time of your choice. This option is most useful to time the cutover for minimal business disruption. For example:

```sql
ALTER DATABASE [mySampleDatabase]
   MODIFY (EDITION = 'Hyperscale', SERVICE_OBJECTIVE = 'HS_Gen5_2')
   WITH MANUAL_CUTOVER;
```

To monitor operations for a Hyperscale database, connect to the `master` database of your [logical server](logical-servers.md) and query [sys.dm_operation_status](/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database?view=azuresqldb-current&preserve-view=true). The `sys.dm_operation_status` makes reports the progress of database operations including the conversion to Hyperscale. If you chose `MANUAL_CUTOVER`, the `sys.dm_operation_status` view includes additional information.

```sql
SELECT *
FROM sys.dm_operation_status
WHERE major_resource_id = 'mySampleDatabase'
ORDER BY start_time DESC;
GO
```

When ready for manual cutover, the `phase_desc` will be `WaitingForCutover`. Use the `PERFORM_CUTOVER` argument to initiate the cutover:

```sql
ALTER DATABASE [mySampleDatabase] PERFORM_CUTOVER;
```

---

## Related content

- [How to manage a Hyperscale database](manage-hyperscale-database.md)
- [How to reverse migrate a database from Hyperscale](reverse-migrate-from-hyperscale.md)

---
title: Troubleshoot issues with the link
titleSuffix: Azure SQL Managed Instance
description: Learn how troubleshoot common issues with a link between SQL Server and Azure SQL Managed Instance.
author: djordje-jeremic
ms.author: djjeremi
ms.reviewer: mathoma, danil
ms.date: 12/06/2024
ms.service: azure-sql-managed-instance
ms.subservice: data-movement
ms.custom: 
ms.topic: how-to
---
# Troubleshoot link - Azure SQL Managed Instance

[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article teaches you how to monitor and troubleshoot issues with a [link](managed-instance-link-feature-overview.md) between SQL Server and Azure SQL Managed Instance. 

You can check the state of the link with Transact-SQL (T-SQL), Azure PowerShell or the Azure CLI. If you encounter issues, you can use the error codes to troubleshoot the problem.

Many issues with creating the link can be resolved by [checking the network](#test-network-connectivity) between the two instances, and validating the [environment has been properly prepared](managed-instance-link-preparation.md) for the link. 

## Check link state

If you run into issues with a link, you can use Transact-SQL (T-SQL), Azure PowerShell or the Azure CLI to get information about the current state of the link.

Use T-SQL for a quick status details of the link state, and then use Azure PowerShell or the Azure CLI for a comprehensive information about the current state of the link. 

### [Transact-SQL (T-SQL)](#tab/tsql)

Use T-SQL to determine the state of the link during the seeding phase, or after data synchronization begins. 

Use the following T-SQL query to determine the status of the link during the seeding phase on the SQL Server or SQL Managed Instance that hosts the database seeded through the link: 

```sql
SELECT
    ag.local_database_name AS 'Local database name',
    ar.current_state AS 'Current state',
    ar.is_source AS 'Is source',
    ag.internal_state_desc AS 'Internal state desc',
    ag.database_size_bytes / 1024 / 1024 AS 'Database size MB',
    ag.transferred_size_bytes / 1024 / 1024 AS 'Transferred MB',
    ag.transfer_rate_bytes_per_second / 1024 / 1024 AS 'Transfer rate MB/s',
    ag.total_disk_io_wait_time_ms / 1000 AS 'Total Disk IO wait (sec)',
    ag.total_network_wait_time_ms / 1000 AS 'Total Network wait (sec)',
    ag.is_compression_enabled AS 'Compression',
    ag.start_time_utc AS 'Start time UTC',
    ag.estimate_time_complete_utc as 'Estimated time complete UTC',
    ar.completion_time AS 'Completion time',
    ar.number_of_attempts AS 'Attempt No'
FROM sys.dm_hadr_physical_seeding_stats AS ag
    INNER JOIN sys.dm_hadr_automatic_seeding AS ar
    ON local_physical_seeding_id = operation_id

-- Estimated seeding completion time
SELECT DISTINCT CONVERT(VARCHAR(8), DATEADD(SECOND, DATEDIFF(SECOND, start_time_utc, estimate_time_complete_utc) ,0), 108) as 'Estimated complete time'
FROM sys.dm_hadr_physical_seeding_stats
```

If the query returns no results, then the seeding process hasn't started or has already completed.

Use the following T-SQL query on the *primary* instance to check the health of the link once data synchronization begins:

```sql
DECLARE @link_name varchar(max) = '<DAGname>'
SELECT
   rs.synchronization_health_desc [Link sync health]
FROM
   sys.availability_groups ag 
   join sys.dm_hadr_availability_replica_states rs 
   on ag.group_id = rs.group_id 
WHERE 
   rs.is_local = 0 AND rs.role = 2 AND ag.is_distributed = 1 AND ag.name = @link_name 
GO
```

The query returns the following possible values: 

- no result: The query was executed on the secondary instance.
- `HEALTHY`: The link is healthy, and data is being synchronized between the replicas.
- `NOT_HEALTHY`: The link is unhealthy, and data is not synchronizing between the replicas.

### [PowerShell](#tab/powershell)

Use [Get-AzSqlInstanceLink](/powershell/module/az.sql/get-azsqlinstancelink) to get link state information with PowerShell. 

Run the following sample code in Azure Cloud Shell or install the [Az.SQL](/powershell/module/az.sql) module locally. 

```powershell-interactive
$ManagedInstanceName = "<ManagedInstanceName>" # The name of your linked SQL Managed Instance
$DAGName = "<DAGName>" # distributed availability group name

# Find out the resource group name 
$ResourceGroupName = (Get-AzSqlInstance -InstanceName $ManagedInstanceName).ResourceGroupName 

# Show link state details 
(Get-AzSqlInstanceLink -ResourceGroupName $ResourceGroupName -InstanceName $ManagedInstanceName -Name $DAGName).Databases
```

### [Azure CLI](#tab/azure-cli)

Use [az sql mi link show](/cli/azure/sql/mi/link#az-sql-mi-link-show) to get link state information with the Azure CLI.

```azurecli-interactive
# type "az" to use Azure CLI
managedInstanceName = "<ManagedInstanceName>" # The name of your linked SQL Managed Instance
dagName = "<DAGName>" # distributed availability group name
rgName = "<RGName>" # the resource group for the linked SQL Managed Instance  

# Print link state details 
az sql mi link show –-resource-group $rgName –-instance-name $managedInstanceName –-name $dagName  
```

---

The *replicaState* value describes the current link. If the state also includes *Error* then an error occurred during the operation listed in the state. For example, *LinkCreationError* indicates that an error occurred while creating the link.

Some possible *replicaState* values are:  
- *CreatingLink*: Initial seeding
- *LinkSynchronizing*: Data replication is in progress
- *LinkFailoverInProgress*: Failover is in progress

For a complete list of link state properties, review the [Distributed Availability Groups - GET](/rest/api/sql/distributed-availability-groups/get?view=rest-sql-2024-05-01-preview&tabs=HTTP&preserve-view=true#definitions) REST API command. 


## Errors with the link

There are two distinct categories of errors you can encounter when using the link - errors when you try to initialize the link, and errors when you try to create the link. 

### Errors initializing a link 

The following error can occur when initializing a link (Link state: `LinkInitError`): 

- [Error 41962](/sql/relational-databases/errors-events/mssqlserver-41962-database-engine-error): Operation aborted because the link wasn't initiated within 5 minutes. Check [network connectivity](#test-network-connectivity) and try again.
- [Error 41973](/sql/relational-databases/errors-events/mssqlserver-41973-database-engine-error): Link can't be established because [endpoint certificate from SQL Server](managed-instance-link-configure-how-to-scripts.md#create-a-certificate-on-sql-server-and-import-its-public-key-to-sql-managed-instance) wasn't imported into Azure SQL Managed Instance correctly. 
- [Error 41974](/sql/relational-databases/errors-events/mssqlserver-41974-database-engine-error): Link can't be established because [endpoint certificate from SQL Managed Instance](managed-instance-link-configure-how-to-scripts.md#get-the-certificate-public-key-from-sql-managed-instance-and-import-it-to-sql-server) wasn't imported into SQL Server correctly.
- [Error 41976](/sql/relational-databases/errors-events/mssqlserver-41976-database-engine-error): The availability group isn't responding. Check names and configuration parameters and try again.
- [Error 41986](/sql/relational-databases/errors-events/mssqlserver-41986-database-engine-error): Link can't be established because the connection failed or the secondary replica isn't responsive. Check names, configuration parameters, and [network connectivity](#test-network-connectivity) and then try again.
- [Error 47521](/sql/relational-databases/errors-events/mssqlserver-47521-database-engine-error): Link can't be established because the secondary server didn't receive the request. Make sure the availability group and databases are healthy on the primary server and try again. 

### Errors creating a link

The following error can occur when creating a link (Link state: `LinkCreationError`): 

- [Error 41977](/sql/relational-databases/errors-events/mssqlserver-41977-database-engine-error): The target database isn't responsive. Check link parameters and try again.

## Inconsistent state after forced failover

Following a forced [failover](managed-instance-link-failover-how-to.md), you might encounter a split-brain scenario where both replicas are in the primary role, leaving the link in an inconsistent state. This can happen if you fail over to the secondary replica during a disaster, and then the primary replica comes back online.

First, confirm you're in a split-brain scenario. You can do so by using SQL Server Management Studio (SSMS) or Transact-SQL (T-SQL).

Connect to both SQL Server and SQL managed instance in SSMS, and then in **Object Explorer**, expand **Availability replicas** under the **Availability group** node in **Always On High Availability**. If two different replicas are listed as **(Primary)**, you're in a split-brain scenario. 

Alternatively, you can run the following T-SQL script on *both* SQL Server and SQL Managed Instance to check the role of the replicas:

```sql
-- Execute on SQL Server and SQL Managed Instance 
USE master
DECLARE @link_name varchar(max) = '<DAGName>'
SELECT
   ag.name [Link name], 
   rs.role_desc [Link role] 
FROM
   sys.availability_groups ag 
   JOIN sys.dm_hadr_availability_replica_states rs 
   ON ag.group_id = rs.group_id 
WHERE 
   rs.is_local = 1 AND ag.is_distributed = 1 AND ag.name = @link_name 
GO
```

If both instances list **PRIMARY** in **Link role** column, you're in a split-brain scenario.

To resolve the split brain state, first take a backup on whichever replica was the original primary. If the original primary was SQL Server, then take a [tail log backup](/sql/relational-databases/backup-restore/tail-log-backups-sql-server). If the original primary was SQL Managed Instance, then take a [copy-only full backup](/sql/relational-databases/backup-restore/copy-only-backups-sql-server). After the backup completes, set the distributed availability group to the secondary role for the replica that used to be the original primary but will now be the new secondary.
 
For example, in the event of a true disaster, assuming you've forced a failover of your SQL Server workload to Azure SQL Managed Instance, and you intend to continue running your workload on SQL Managed Instance, take a tail log backup on SQL Server, and then set the distributed availability group to the secondary role on SQL Server such as the following example:

```sql
--Execute on SQL Server 
USE master
ALTER AVAILABILITY GROUP [<DAGName>] 
SET (ROLE = SECONDARY) 
GO 
```

Next, execute a planned manual failover from SQL Managed Instance to SQL Server by using the link, such as the following example: 

```sql
--Execute on SQL Managed Instance 
USE master
ALTER AVAILABILITY GROUP [<DAGName>] FAILOVER 
GO 
```

## Expired certificate

It's possible for the certificate used for the link to expire. If the certificate expires, the link fails. To resolve this issue, [rotate the certificate](managed-instance-link-best-practices.md#rotate-certificate). 

## Test network connectivity

[!INCLUDE [azure-sql-managed-instance-link-check-network](../includes/sql-managed-instance/azure-sql-managed-instance-link-check-network.md)]


## Related content

For more information on the link feature, review the following resources:

- [Managed Instance link overview](managed-instance-link-feature-overview.md)
- [Prepare your environment for Managed Instance link](./managed-instance-link-preparation.md)
- [Configure link between SQL Server and SQL Managed instance with scripts](managed-instance-link-configure-how-to-scripts.md)
- [Disaster recovery with Managed Instance link](managed-instance-link-disaster-recovery.md)
- [Best practices for maintaining the link](managed-instance-link-best-practices.md)

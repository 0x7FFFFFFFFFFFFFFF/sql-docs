---
title: Configure Windows service accounts and permissions for SQL Server enabled by Azure Arc
description: Get acquainted with permissions required to start and run Azure Extension for SQL Server agent service account. See how to configure them and assign appropriate permissions.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: nikitatakru, randolphwest
ms.date: 03/28/2024
ms.topic: reference
---

# Configure Windows service accounts and permissions for Azure extension for SQL Server

[!INCLUDE [SQL Server](../../includes/applies-to-version/sqlserver.md)]

This article lists the permissions Azure extension for SQL Server sets for the `NT Service\SQLServerExtension` account. This account is used when you [Operate SQL Server enabled by Azure Arc with least privilege](configure-least-privilege.md).

> [!NOTE]
> [!INCLUDE [least-privilege-default](includes/least-privilege-default.md)]

Manually setting the permissions for the agent account is not supported.

The extension sets permissions when you enable features on the Azure portal. If you don't enable a feature, the extension does not set the permissions for that feature. If you disable a feature, the extension removes the permissions.

[SQL permissions](#sql-permissions) lists the permissions tied to features that the extension grants when features are enabled.

> [!NOTE]
> `NT Authority\System` must have access to modify permissions on listed directories and registry keys. This is needed so that `NT Authority\System` can grant required access to `NT Service\SqlServerExtension` account for least privileges mode.

## Directory permissions

| Directory path | Required permissions | Details | Feature |
| :--- | :--- | :--- | :--- |
| `<SystemDrive>\Packages\Plugins\Microsoft.AzureData.WindowsAgent.SQLServer` | Full control | Extension related dlls and exe files. | Default |
| `C:\Packages\Plugins\Microsoft.AzureData.WindowsAgent.SqlServer\<extension_version>\RuntimeSettings` | Full control | Extension settings file. | Default |
| `C:\Packages\Plugins\Microsoft.AzureData.WindowsAgent.SqlServer\<extension_version>\status` | Full control | Extension status file. | Default |
| `C:\ProgramData\GuestConfig\extension_logs\Microsoft.AzureData.WindowsAgent.SqlServer` | Full control | Extension log files. | Default |
| `C:\Packages\Plugins\Microsoft.AzureData.WindowsAgent.SqlServer\<extension_version>\status\HeartBeat.Json` | Full control | Extension heartbeat file. | Default |
| `%ProgramFiles%\Sql Server Extension` | Full control | Extension service files. | Default |
| `<SystemDrive>\Windows\system32\extensionUpload` | Full control | Required to write usage file needed for billing. | Default |
| `<SystemDrive>\Windows\system32\ExtensionHandler.log` | Full control | Pre-log folder created by extension. | Default |
| `<ProgramData>\AzureConnectedMachineAgent\Config` | Read | Arc config files directory. | Default |
| `C:\Windows\System32\config\systemprofile\AppData\Local\Microsoft SQL Server Extension Agent` | Full control | Required to write assessment reports and status. | Default |
| SQL log directory (as set in registry) <sup>1</sup>:<br />`C:\Program Files\Microsoft SQL Server\MSSQL<base_version>.<instance_name>\MSSQL\log` | Read | Required to extract SQL vCores info from SQL logs. | Default |
| SQL backup directory (as set in registry) <sup>1</sup>:<br />`C:\Program Files\Microsoft SQL Server\MSSQL<base_version>.<instance_name>\MSSQL\Backup` | ReadAndExecute/Write /Delete | Required for Backups | Backup |

<sup>1</sup> For more information, see [File Locations and Registry Mapping](../install/file-locations-for-default-and-named-instances-of-sql-server.md#file-locations-and-registry-mapping).

## Registry permissions

Base key: `HKEY_LOCAL_MACHINE`

| Registry key | Permission required | Details | Feature |
| :--- | :--- | :--- | :--- |
| `SOFTWARE\Microsoft\Microsoft SQL Server` | Read | Read SQL Server properties like `installedInstances`. | Default |
| `SOFTWARE\Microsoft\Microsoft SQL Server\<InstanceRegistryName>\MSSQLSERVER` | Full control | Microsoft Entra ID and Purview. | Microsoft Entra ID<br /><br />Purview |
| `SOFTWARE\Microsoft\SystemCertificates` | Full control | Required for Microsoft Entra ID. | Microsoft Entra ID |
| `SYSTEM\CurrentControlSet\Services` | Read | SQL Server account name. | Default |
| `SOFTWARE\Microsoft\AzureDefender\SQL` | Read | Azure Defender status and last update time. | Default |
| `SOFTWARE\Microsoft\SqlServerExtension` | Full control | Extension related values. | Default |
| `SOFTWARE\Policies\Microsoft\Windows` | Read and Write | Enabling automatic windows update via extension. | Automatic updates |

## Group permissions

`NT Service\SQLServerExtension` is added to Hybrid agent extension applications. This enables the Azure Instance Metadata Service (IMDS) handshake to retrieve the Machine resource managed identity token required to communicate to Azure data plane services such as the Data Processing Service (DPS) and the telemetry endpoint for billing usage, extension logs, and monitoring dashboard data collection.

## SQL permissions

`NT Service\SQLServerExtension` is added:

- As a SQL login to all the instances present currently on machine
- As a user in each database

The extension also grants permissions to instance and database objects as features are enabled. The table below provides details.

> [!NOTE]  
> Minimum permissions depend on enabled features. Permissions are updated when they are no longer necessary. Necessary permissions are granted when features are enabled.

## SQL Privileges by Feature

### Minimum System Requirements

These permissions are required for the basic level of functionality provided by the Azure Extension for SQL Server and must be applied.

| Object Type | Database or Object Name | Privilege                      |
| ----------- | ---------------------- | ------------------------------ |
| Database    | Master                 | `VIEW DATABASE STATE`          |
| Database    | Msdb                    | `ALTER ANY SCHEMA`             |
| Database    | Msdb                    | `CREATE TABLE`                 |
| Database    | Msdb                    | `CREATE TYPE`                  |
| Database    | Msdb                    | `DB DATA READER`               |
| Database    | Msdb                    | `DB DATA WRITER`               |
| Database    | Msdb                    | `EXECUTE`                      |
| Database    | Msdb                    | `SELECT dbo.backupfile`        |
| Database    | Msdb                    | `SELECT dbo.backupmediaset`    |
| Database    | Msdb                    | `SELECT dbo.backupmediafamily` |
| Database    | Msdb                    | `SELECT dbo.backupset`         |
| Database    | Msdb                    | `SELECT dbo.syscategories`     |
| Database    | Msdb                    | `SELECT dbo.sysjobactivity`    |
| Database    | Msdb                    | `SELECT dbo.sysjobhistory`     |
| Database    | Msdb                    | `SELECT dbo.sysjobs`           |
| Database    | Msdb                    | `SELECT dbo.sysjobsteps`       |
| Database    | Msdb                    | `SELECT dbo.syssessions`       |
| Database    | Msdb                    | `SELECT dbo.sysoperators`      |
| Database    | Msdb                    | `SELECT dbo.suspectpages`      |
| Server      |                          | `CONNECT ANY DATABASE`         |
| Server      |                          | `CONNECT SQL`                  |
| Server      |                          | `VIEW ANY DATABASE`            |
| Server      |                          | `VIEW ANY DEFINITION`          |
| Server      |                          | `VIEW SERVER STATE`            |

### Best Practices Assessment

The best practices assessment is disabled by default. If it is enabled, these permissions will be automatically granted if they are not already granted.

| Object Type     | Database or Object Name | Privilege             |
| --------------- | ---------------------- | --------------------- |
| Database        | Master                 | `SELECT`              |
| Database        | Master                 | `VIEW DATABASE STATE` |
| Database        | Msdb                    | `SELECT`              |
| Server          |                          | `VIEW ANY DATABASE`   |
| Server          |                          | `VIEW ANY DEFINITION` |
| Server          |                          | `VIEW SERVER STATE`   |
| StoredProcedure | EnumErrorLogsSP         | `EXECUTE`             |
| StoredProcedure | ReadErrorLogsSP         | `EXECUTE`             |

### Backup

Automated backups are disabled by default. Backup permissions will be granted to any database that backups are enabled for. Enabling the backup feature also enables the point-in-time restore feature, so the permission to create a database is also granted.

| Object Type | Database or Object Name | Privilege             |
| ----------- | ---------------------- | --------------------- |
| Database    | All Databases           | `DB BACKUP OPERATOR`  |
| Server      |                          | `CREATE ANY DATABASE` |
| Server      | Master                   | `DB CREATOR`          |

### Availability Groups

Availability Group discovery and management features such as failing over are enabled by default, but they can be disabled through the `AvailabilityGroupDiscovery` feature flag.

| Object Type | Database or Object Name | Privilege                      |
| ----------- | ---------------------- | ------------------------------ |
| Server      |                          | `ALTER ANY AVAILABILITY GROUP` |
| Server      |                          | `VIEW ANY DEFINITION`          |

### Purview

The Purview features are disabled by default.

| Object Type | Database or Object Name | Privilege              |
| ----------- | ---------------------- | ---------------------- |
| Database    | All Databases           | `EXECUTE`              |
| Database    | All Databases           | `SELECT`               |
| Server      |                          | `CONNECT ANY DATABASE` |
| Server      |                          | `VIEW ANY DATABASE`    |

### Migration Assessment

Migration Assessments are enabled by default. If the feature is disabled, the permissions below will be removed unless other enabled features require them.

| Object Type | Database or Object Name | Privilege                              |
| ----------- | ---------------------- | -------------------------------------- |
| Database    | All Databases           | `SELECT sys.sqlexpressiondependencies` |
| Database    | Msdb                    | `EXECUTE dbo.agentdatetime`            |
| Database    | Msdb                    | `SELECT dbo.syscategories`             |
| Database    | Msdb                    | `SELECT dbo.sysjobhistory`             |
| Database    | Msdb                    | `SELECT dbo.sysjobs`                   |
| Database    | Msdb                    | `SELECT dbo.sysjobsteps`               |
| Database    | Msdb                    | `SELECT dbo.sysmailaccount`            |
| Database    | Msdb                    | `SELECT dbo.sysmailprofile`            |
| Database    | Msdb                    | `SELECT dbo.sysmailprofileaccount`     |
| Database    | Msdb                    | `SELECT dbo.syssubsystems`             |


## Additional permissions

- Permissions to service account to access extension service and configure autorecovery.
- Log-on-as-service rights to service account.

## Related content

- [Configure Windows service accounts and permissions](../../database-engine/configure-windows/configure-windows-service-accounts-and-permissions.md)

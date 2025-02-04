---
title: Import or export a database using Private link
description: Import or export an Azure SQL Database using Private Link without requiring Azure services to access the server.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: mathoma, hudequei
ms.date: 02/04/2025
ms.service: azure-sql-database
ms.subservice: migration
ms.topic: how-to
ms.collection:
  - sql-migration-content
ms.custom:
  - sqldbrb=1
---
# Import or export an Azure SQL Database using private link

[!INCLUDE [appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article explains how to import or export an Azure SQL Database using [Private Link](private-endpoint-overview.md) by using the Azure portal or Azure PowerShell with *Allow Access to Azure Services* set to *OFF* on the Azure SQL [logical server](logical-servers.md).

Running Import or Export requires you to set [Allow Access to Azure Services](network-access-controls-overview.md) to `ON`, otherwise the Import or Export operation fails with an error.

> [!NOTE]  
> Import/export using private link for Azure SQL Database is currently in preview.

## What is import/export private link?

The database import/export private link is a service managed private endpoint created by Microsoft. When enabled, a private link is exclusively used for all communications by the database import/export process, the Azure SQL database, and related Azure Storage services. A service managed private endpoint is a private IP address within a specific virtual network and subnet.

The private endpoint must be manually approved for both the Azure SQL logical server and the Azure Blob storage account, in separate steps, with details included in this tutorial.

:::image type="content" source="media/database-import-export-private-link/import-export-private-link.png" alt-text="Diagram of Import Export Private link architecture." lightbox="media/database-import-export-private-link/import-export-private-link.png":::

## Configure Import-Export Private Link using the Azure portal

Import/Export Private Link can be configured via Azure portal, PowerShell, or using REST API.

### 1. Configure Import/Export private link using the Azure portal

<a id="create-import-private-link"></a>

#### Enable Import private link

You need to enable and approve the import private link. Creating the private link is performed automatically in Azure.

1. Go to the **Overview** page of the Azure SQL logical server into which you would like to import the database. Select **Import database** from toolbar.
1. In the **Import database** page, select the **Use private link** option checkbox.
1. Enter the storage account, authentication credentials, database details, and select **OK**.

<a id="create-export-private-link"></a>

#### Enable Export private link

You need to enable and approve the export private link. Creating the private link is performed automatically in Azure.

1. Go to the **Overview** page of the Azure SQL database that you would like to export. Select **Export** from the toolbar.
1. In the **Export database** page, select the **Use private link** option checkbox.
1. Enter the storage account, authentication credentials, database details, and select **OK**.

### 2. Approve private link for Azure SQL logical server

The new private endpoint must be approved by the user in the Private Link Center or in the Azure SQL Database.

#### Option 1: Approve private endpoints in Private Link Center in Azure portal

1. Navigate to the Private Link Center in the Azure portal. In the Azure search box, search for "Private Link Center".
1. In the Private Link Center, select **Pending connections**.
1. Select the private endpoints you created using the Import/Export service. Select **Approve**.

#### Option 2: Approve private endpoint connection on Azure SQL Database in Azure portal

1. Go to the Azure SQL logical server that hosts the database.
1. In the resource menu under **Security**, select **Networking**. 
1. Select the **Private access** tab.
1. In the list under **Private endpoint connections**, select the private endpoints you created using the Import/Export service. 
1. Select **Approve**.

   :::image type="content" source="media/database-import-export-private-link/approve-private-link.png" alt-text="Screenshot from the Azure portal that shows how to approve Azure SQL Database Private Link." lightbox="media/database-import-export-private-link/approve-private-link.png":::

### 3. Approve private endpoint connection on Azure Storage

Approve the new private endpoint connection for the database import BACPAC file in Azure Storage.

1. Go to the storage account that hosts the blob container where the BACPAC (`.bacpac`) file exists.
1. Under **Security + Networking**, select **Networking**. 
1. Select the **Private endpoint connections** tab.
1. In the list, select the private endpoint for the import/export service.
1. Select **Approve** to approve the connection.

:::image type="content" source="media/database-import-export-private-link/approve-private-link-storage.png" alt-text="Screenshot from the Azure portal that shows how to approve Azure Storage Private Link in Azure Storage." lightbox="media/database-import-export-private-link/approve-private-link-storage.png":::

### 4. Check import/export status

1. After the private endpoints are approved, both in the Azure SQL server and the Azure Storage account, the database import or export job will be kicked off. Until then, the jobs are on hold.
1. You can check the status of database import or export jobs in **Import/Export History** page under **Data Management** section in Azure SQL server page.
:::image type="content" source="media/database-import-export-private-link/import-export-status.png" alt-text="Screenshot from the Azure portal that shows how to check Import Export Jobs Status." lightbox="media/database-import-export-private-link/import-export-status.png":::

## Configure import/export private link using PowerShell

### Import a database using private link in PowerShell

Use the [New-AzSqlDatabaseImport](/PowerShell/module/az.sql/new-azsqldatabaseimport) cmdlet to submit an import database request to Azure. Depending on database size, the import might take some time to complete. The DTU-based provisioning model supports select database max size values for each tier. When importing a database, [use the supported edition and service objective values for Azure SQL Database](/sql/t-sql/statements/create-database-transact-sql?view=azuresqldb-current&preserve-view=true#create-a-database).

Provide your own `<values>` in the following PowerShell code sample, which imports a .bacpac file named `sample.bacpac` and creates an Azure SQL Database with 2 General Purpose vCores.

```PowerShell
$importRequestParams = @{
   ResourceGroupName                   = "<resourceGroupName>"
   ServerName                          = "<serverName>"
   DatabaseName                        = "<databaseName>"
   DatabaseMaxSizeBytes                = "<databaseSizeInBytes>"
   StorageKeyType                      = "StorageAccessKey"
   StorageKey                          = $(Get-AzStorageAccountKey -ResourceGroupName $resourceGroupName -StorageAccountName "<storageAccountName>").Value[0]
   StorageUri                          = "https://myStorageAccount.blob.core.windows.net/importsample/sample.bacpac"
   Edition                             = "GeneralPurpose"
   ServiceObjectiveName                = "GP_Gen5_2"
   UseNetworkIsolation                 = $true
   StorageAccountResourceIdForPrivateLink = "/subscriptions/<subscriptionId>/resourceGroups/<resource_group_name>/providers/Microsoft.Storage/storageAccounts/<storage_account_name>"
   SqlServerResourceIdForPrivateLink   = "/subscriptions/<subscriptionId>/resourceGroups/<resource_group_name>/providers/Microsoft.Sql/servers/<server_name>"
   AdministratorLogin                  = "<userID>"
   AdministratorLoginPassword          = $(ConvertTo-SecureString -String "<password>" -AsPlainText -Force)
}

$importRequest = New-AzSqlDatabaseImport @importRequestParams
```

### Export a database using private link in PowerShell

Use the [New-AzSqlDatabaseExport](/PowerShell/module/az.sql/new-azsqldatabaseexport) cmdlet to submit an export database request to the Azure SQL Database service. Depending on the size of your database, the export operation might take some time to complete.

Provide your own `<values>` in the following PowerShell code sample:

```PowerShell
$exportRequestParams = @{
   ResourceGroupName                   = "<resourceGroupName>"
   ServerName                          = "<serverName>"
   DatabaseName                        = "<databaseName>"
   StorageKeyType                      = "StorageAccessKey"
   StorageKey                          = $(Get-AzStorageAccountKey -ResourceGroupName $resourceGroupName -StorageAccountName "<storageAccountName>").Value[0]
   StorageUri                          = "https://myStorageAccount.blob.core.windows.net/importsample/sample.bacpac"
   UseNetworkIsolation                 = $true
   StorageAccountResourceIdForPrivateLink = "/subscriptions/<subscriptionId>/resourceGroups/<resource_group_name>/providers/Microsoft.Storage/storageAccounts/<storage_account_name>"
   SqlServerResourceIdForPrivateLink   = "/subscriptions/<subscriptionId>/resourceGroups/<resource_group_name>/providers/Microsoft.Sql/servers/<server_name>"
   AdministratorLogin                  = "<userID>"
   AdministratorLoginPassword          = $(ConvertTo-SecureString -String "<password>" -AsPlainText -Force)
}

$exportRequest = New-AzSqlDatabaseExport @exportRequestParams
```

## Create import/export private link using REST API

Existing APIs to perform Import and Export jobs support Private Link. Refer to [Import Database API](/rest/api/sql/servers/import-database).

## Limitations

Currently, the private link for import/export has the following limitations:

- To use Private Link with Import/Export, the user database and the Azure Storage blob container must be hosted on the same type of Azure Cloud. For example, either both in Azure Commercial or both on Azure Gov. Hosting across cloud types isn't supported.

- Import or Export of a database from [Azure SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md) using PowerShell isn't currently supported.

- Import/Export Private Link should not be used when the user Database or the Azure Storage account are protected by Resource locks.

- Manual approval of the new private endpoint connection is required to complete the export operation. After starting the export, go to "pending connections" in the Private Link Center and approve the connections, which can take several minutes to appear.

- Import using Private Link does not support specifying a backup storage redundancy while creating a new database and creates with the default geo-redundant backup storage redundancy. As a workaround, first create an empty database with desired backup storage redundancy using Azure portal or PowerShell and then import the BACPAC file into this empty database.

- Import using REST API with private link can only be completed for an existing database since the API uses database extensions. As a workaround, create an empty database with the desired name, then call the Import REST API with private link.

## Related content

- [Import or Export Azure SQL Database without allowing Azure services to access the server](database-import-export-azure-services-off.md)
- [Import a database from a BACPAC file](database-import.md)

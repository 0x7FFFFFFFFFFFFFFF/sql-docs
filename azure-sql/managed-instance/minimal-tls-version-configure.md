---
title: Configure minimal TLS version - managed instance
description: "Learn how to configure minimal TLS version for managed instance"
author: zoran-rilak-msft
ms.author: zoranrilak
ms.reviewer: mathoma
ms.date: 10/21/2022
ms.service: azure-sql-managed-instance
ms.subservice: security
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.devlang: azurecli
---
# Configure minimal TLS version in Azure SQL Managed Instance
> [!IMPORTANT]
> **Upcoming retirement changes**
> 
> Azure has announced that support for older TLS versions (TLS 1.0, and 1.1) ends August 31, 2025. For more information, see [TLS 1.0 and 1.1 deprecation](https://azure.microsoft.com/updates/azure-support-tls-will-end-by-31-october-2024-2/).
> Starting November 2024, you will no longer be able to set the minimal TLS version for Azure SQL Managed Instance client connections below TLS 1.2. 

The Minimal [Transport Layer Security (TLS)](https://support.microsoft.com/help/3135244/tls-1-2-support-for-microsoft-sql-server) Version setting allows customers to control the version of TLS used by their Azure SQL Managed Instance.

At present we support TLS 1.0, 1.1 and 1.2. Setting a Minimal TLS Version ensures that subsequent, newer TLS versions are supported. For example,  e.g.,  choosing  a TLS version greater than 1.1. means only connections with TLS 1.1 and 1.2 are accepted and TLS 1.0 is rejected. After testing to confirm your applications supports it, we recommend setting minimal TLS version to 1.2 since it includes fixes for vulnerabilities found in previous versions and is the highest version of TLS supported in Azure SQL Managed Instance.

For customers with applications that rely on older versions of TLS, we recommend setting the Minimal TLS Version per the requirements of your applications. For customers that rely on applications to connect using an unencrypted connection, we recommend not setting any Minimal TLS Version. 

For more information, see [TLS considerations for SQL Database connectivity](../database/connect-query-content-reference-guide.md#tls-considerations-for-database-connectivity).

After setting the Minimal TLS Version, login attempts from clients that are using a TLS version lower than the Minimal TLS Version of the server will fail with following error:

```output
Error 47072
Login failed with invalid TLS version
```

> [!NOTE]
> When you configure a minimum TLS version, that minimum version is enforced at the application layer. Tools that attempt to determine TLS support at the protocol layer may return TLS versions in addition to the minimum required version when run directly against the managed instance endpoint.

## Set minimal TLS version via PowerShell

[!INCLUDE [updated-for-az](../includes/updated-for-az.md)]

> [!IMPORTANT]
> The PowerShell Azure Resource Manager (AzureRM) module was deprecated on February 29, 2024. All future development should use the Az.Sql module. Users are advised to migrate from AzureRM to the Az PowerShell module to ensure continued support and updates. The AzureRM module is no longer maintained or supported. The arguments for the commands in the Az PowerShell module and in the AzureRM modules are substantially identical. For more about their compatibility, see [Introducing the new Az PowerShell module](/powershell/azure/new-azureps-module-az).

The following script requires the [Azure PowerShell module](/powershell/azure/install-az-ps).

The following PowerShell script shows how to `Get` and `Set` the **Minimal TLS Version** property at the instance level:

```powershell
#Get the Minimal TLS Version property
(Get-AzSqlInstance -Name sql-instance-name -ResourceGroupName resource-group).MinimalTlsVersion

# Update Minimal TLS Version Property
Set-AzSqlInstance -Name sql-instance-name -ResourceGroupName resource-group -MinimalTlsVersion "1.2"
```

## Set Minimal TLS Version via Azure CLI

> [!IMPORTANT]
> All scripts in this section requires [Azure CLI](/cli/azure/install-azure-cli).

### Azure CLI in a bash shell

The following CLI script shows how to change the **Minimal TLS Version** setting in a bash shell:

```azurecli-interactive
# Get current setting for Minimal TLS Version
az sql mi show -n sql-instance-name -g resource-group --query "minimalTlsVersion"

# Update setting for Minimal TLS Version
az sql mi update -n sql-instance-name -g resource-group --set minimalTlsVersion="1.2"
```

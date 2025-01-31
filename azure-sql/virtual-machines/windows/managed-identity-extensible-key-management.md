---
title: Managed Identity Support for Extensible Key Management (EKM) with Azure Key Vault (AKV)
description: Learn how to use managed identities with SQL Server on Azure Virtual Machines and Transparent Data Encryption (TDE) Extensible Key Management with Azure Key Vault.
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto, mathoma
ms.date: 01/16/2025
ms.service: azure-vm-sql-server
ms.subservice: security
ms.topic: how-to
---
# Managed Identity support for Extensible Key Management with Azure Key Vault

[!INCLUDE [appliesto-sqlvm-windows-only](../../includes/appliesto-sqlvm-windows-only.md)]

This article shows you how to use managed identities for Extensible Key Management (EKM) with Azure Key Vault (AKV) on [SQL Server on Azure Virtual Machines (VM)](sql-server-on-azure-vm-iaas-what-is-overview.md).

## Overview

Starting with SQL Server 2022 Cumulative Update 17 (CU17), managed identities are supported for EKM with AKV and Managed Hardware Security Modules (HSM) on SQL Server on Azure VMs. Managed identities are the recommended authentication method to allow different Azure services to authenticate the SQL Server on Azure VM resource without using passwords or secrets. For more information on managed identities, see [Managed identity types](/entra/identity/managed-identities-azure-resources/overview#managed-identity-types).

> [!NOTE]
> Managed identities are only supported for SQL Server on Azure VMs and not for SQL Server on-premises.
>
> For information on setting up EKM with AKV for SQL Server on-premises, see [Set up SQL Server TDE Extensible Key Management by using Azure Key Vault](/sql/relational-databases/security/encryption/setup-steps-for-extensible-key-management-using-the-azure-key-vault).

## Prerequisites

- A SQL Server on Azure VM with SQL Server 2022 CU17 or later, [configured with Microsoft Entra authentication](configure-azure-ad-authentication-for-sql-vm.md).
- An Azure Key Vault and key created in the key vault. For more information, see [Create a key vault](/sql/relational-databases/security/encryption/setup-steps-for-extensible-key-management-using-the-azure-key-vault?tabs=portal#step-2-create-a-key-vault).
- Managed identities are supported for EKM with AKV. The primary managed identity for the SQL Server on Azure VM needs:
  - To be assigned with a user-assigned managed identity or system-assigned managed identity. For more information, see [Configure managed identities on Azure virtual machines (VMs)](/entra/identity/managed-identities-azure-resources/how-to-configure-managed-identities) and [Enable Microsoft Entra authentication](configure-azure-ad-authentication-for-sql-vm.md#enable-microsoft-entra-authentication).
  - To have the `Key Vault Crypto Service Encryption User` role for the primary managed identity assigned to the key vault if you're using [Azure role-based access control](/sql/relational-databases/security/encryption/setup-steps-for-extensible-key-management-using-the-azure-key-vault?tabs=portal#azure-role-based-access-control) or the *Unwrap Key* and *Wrap Key* permissions if you're using [vault access policy](/sql/relational-databases/security/encryption/setup-steps-for-extensible-key-management-using-the-azure-key-vault?tabs=portal#vault-access-policy).
- Download the latest version of the SQL Server Connector from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=45344).

## Add registry key for the EKM provider

Before you can create a credential using a managed identity, you need to add a registry key to enable the EKM provider to use managed identities. This step needs to be performed by the computer administrator. For detailed steps, see [Step 4: Add registry key to support EKM provider](/sql/relational-databases/security/encryption/setup-steps-for-extensible-key-management-using-the-azure-key-vault?tabs=portal#step-4-add-registry-key-to-support-ekm-provider).

## Create a server credential using managed identities

The following example shows how to create a credential for a managed identity to use with the AKV:

```sql
CREATE CREDENTIAL [<akv-name>.vault.azure.net] 
    WITH IDENTITY = 'Managed Identity'
    FOR CRYPTOGRAPHIC PROVIDER AzureKeyVault_EKM_Prov
```

You can check the AKV name by querying `sys.credentials`:

```sql
SELECT name, credential_identity
FROM sys.credentials
```

The `WITH IDENTITY = 'Managed Identity'` clause requires a primary managed identity assigned to the SQL Server on Azure VM.

For more information on setting up EKM with AKV, see [Set up SQL Server TDE Extensible Key Management by using Azure Key Vault](/sql/relational-databases/security/encryption/setup-steps-for-extensible-key-management-using-the-azure-key-vault).

## Creating a credential to use with Managed Hardware Security Modules (HSMs)

To create a credential to use with Azure Key Vault Managed Hardware Security Modules (HSMs), use the following syntax:

```sql
CREATE CREDENTIAL [<akv-name>.managedhsm.azure.net] 
    WITH IDENTITY = 'Managed Identity'
    FOR CRYPTOGRAPHIC PROVIDER AzureKeyVault_EKM_Prov
```

For more information on setting up EKM with AKV, see [Set up SQL Server TDE Extensible Key Management by using Azure Key Vault](/sql/relational-databases/security/encryption/setup-steps-for-extensible-key-management-using-the-azure-key-vault).

## T-SQL commands to upgrade existing EKM configuration to use managed identities

If your current configuration is using EKM with AKV using a secret, you'll need to drop the existing credential and create a new credential using a managed identity. The following T-SQL commands show how to upgrade your existing EKM configuration to use managed identities:

1. Create the credential using a managed identity:

   ```sql
   CREATE CREDENTIAL [<akv-name>.vault.azure.net] 
       WITH IDENTITY = 'Managed Identity'
       FOR CRYPTOGRAPHIC PROVIDER AzureKeyVault_EKM_Prov
   ```

1. If there's a credential using a secret associated with the SQL Server administration domain login, drop the existing credential:

   ```sql
   ALTER LOGIN [<domain>\<login>]
   DROP CREDENTIAL [<existing-credential-name>]
   ```

1. Associate the new credential with the SQL Server administration domain login:

   ```sql
   ALTER LOGIN [<domain>\<login>]
   ADD CREDENTIAL [<akv-name>.vault.azure.net]
   ```

You can check the encrypted database view to verify the database encryption using the following query:

```sql
SELECT * 
FROM sys.dm_database_encryption_keys 
WHERE database_id=db_id('<your-database-name>')
```

For more information on setting up EKM with AKV, see [Set up SQL Server TDE Extensible Key Management by using Azure Key Vault](/sql/relational-databases/security/encryption/setup-steps-for-extensible-key-management-using-the-azure-key-vault).

## Error messages

[Trace flag 4675](/sql/t-sql/database-console-commands/dbcc-traceon-trace-flags-transact-sql#tf4675) can be used to check credentials created with a managed identity. If the `CREATE CREDENTIAL` statement was executed without trace flag 4675 enabled, no error message is issued if the primary managed identity isn't set for the server. To troubleshoot this scenario, the credential must be deleted and recreated again once the trace flag is enabled.

### No primary managed identity assigned

If a primary managed identity isn't assigned to the SQL Server on Azure VM, the backup and restore operations will fail with an error message indicating that the managed identity isn't selected.

```sql
Msg 37563, Level 16, State 2, Line 14
The primary managed identity is not selected for this server. Enable the primary managed identity for Microsoft Entra authentication for this server. For more information see (https://aka.ms/sql-server-managed-identity-doc).`
```

### SQL Server Connector version does not support the managed identity for EKM with AKV

If a previous SQL Server Connector version is used, the following error occurs when executing the T-SQL `CREATE ASYMMETRIC KEY` statement using a server credential with managed identity:

```sql
Msg 37576, Level 16, State 2, Line 60
The current SQL Server Connector version for Microsoft Azure Key Vault does not support the managed identity (see https://aka.ms/sql-server-managed-identity-doc). Upgrade the SQL Server Connector to its latest version
```

## Limitations

- Server-level managed identity is only supported for SQL Server on Azure VM, and not on SQL Server on-premises. Server-level managed identity isn't supported for Linux.
- Managed identity support for EKM with AKV and [Backup and restore to URL using managed identities](backup-restore-to-url-using-managed-identities.md) are the only Azure services that support managed identity for SQL Server on Azure VMs.
  - Managed identity support for EKM with AKV requires the latest SQL Server Connector version. Make sure you download and install the latest version from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=45344).
- Microsoft Entra authentication can only be enabled with one primary managed identity for the SQL Server on Azure VM. The primary managed identity is used for all SQL Server instances on the VM.

## Related content

- [Backup and restore to URL using managed identities](backup-restore-to-url-using-managed-identities.md)
- [Enable Microsoft Entra authentication for SQL Server on Azure VMs](configure-azure-ad-authentication-for-sql-vm.md)
- [CREATE CREDENTIAL (Transact-SQL)](/sql/t-sql/statements/create-credential-transact-sql)
- [Trace flag 4675](/sql/t-sql/database-console-commands/dbcc-traceon-trace-flags-transact-sql#tf4675)

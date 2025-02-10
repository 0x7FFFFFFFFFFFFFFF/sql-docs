---
title: What's new?
description: Learn about the new features for and improvements to SQL Server on Azure Virtual Machines.
author: MashaMSFT
ms.author: mathoma
ms.reviewer: randolphwest, mathoma, dpless
ms.date: 02/03/2025
ms.service: azure-vm-sql-server
ms.topic: whats-new
ms.custom:
- ignite-2024
tags: azure-service-management
---
# What's new with SQL Server on Azure Virtual Machines?

[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

> [!div class="op_single_selector"]
> * [Azure SQL Database](../../database/doc-changes-updates-release-notes-whats-new.md?view=azuresql&preserve-view=true)
> * [Azure SQL Managed Instance](../../managed-instance/doc-changes-updates-release-notes-whats-new.md?view=azuresql&preserve-view=true)
> * [SQL Server on Azure VMs](doc-changes-updates-release-notes-whats-new.md?view=azuresql&preserve-view=true)

When you deploy an Azure virtual machine (VM) with SQL Server installed on it, either manually, or through a built-in image, you can use Azure features to improve your experience. This article summarizes the documentation changes associated with new features and improvements in the recent releases of [SQL Server on Azure Virtual Machines (VMs)](https://azure.microsoft.com/services/virtual-machines/sql-server/). To learn more about SQL Server on Azure VMs, see the [overview](sql-server-on-azure-vm-iaas-what-is-overview.md). 

For updates made in previous years, see the [What's new archive](doc-changes-updates-release-notes-whats-new-archive.md). 

[!INCLUDE [entra-id](../../includes/entra-id.md)]


## Preview

The following table lists the features of SQL Server on Azure VMs that are currently in preview.

> [!NOTE]  
> Features currently in preview are available under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), review for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. SQL Server on Azure VMs provide previews to give you a chance to evaluate and [share feedback with the product group](https://feedback.azure.com/d365community/forum/04fe6ee0-3b25-ec11-b6e6-000d3a4f0da0) on features before they become generally available (GA).

| Feature | Details |
| --- | --- |
| [I/O Analysis](storage-performance-analysis.md) | Use the Azure portal to identify performance issues with your SQL Server workloads from exceeding virtual machine and data disk limits. | 
| [Modernization Advisor](../modernization-advisor.md) | Use the Modernization Advisor in the Azure portal to help you determine if migrating to Azure SQL Managed Instance saves you money or optimizes performance. |
| [Premium SSD v2 in the Azure portal](storage-configuration-premium-ssd-v2.md) | Deploy your SQL Server on Azure VM with Premium SSD v2 disks in the Azure portal for improved throughput and performance. |  

## General availability (GA)

The following table lists features of SQL Server on Azure VMs that have been made generally available (GA) within the last 12 months:

| Changes | Month | Details |
| --- | --- |--- |
| [FCI with Azure Elastic SAN](failover-cluster-instance-azure-elastic-san-manually-configure.md) | February 2025 | Deploy your SQL Server failover cluster instance (FCI) by using an Azure Elastic SAN. |
| [Managed identity support for SQL Server 2022 on Azure VM](managed-identity-extensible-key-management.md) | January 2025 | Starting with SQL Server 2022 Cumulative Update 17 (CU17), managed identities are supported for SQL Server on Azure VMs (Windows only). Managed identities can be used with [SQL Server credentials](/sql/t-sql/statements/create-credential-transact-sql) to [back up to and restore SQL Server on Azure VM databases from Azure Blob storage](backup-restore-to-url-using-managed-identities.md). Support for managed identities also enables functionalities like [Extensible Key Management (EKM) with Azure Key Vault (AKV) and Managed Hardware Security Modules (HSM)](managed-identity-extensible-key-management.md) to be used with SQL Server on Azure VMs. |
| [Mbv3 VM series](performance-guidelines-best-practices-vm-size.md#mbsv3-and-mbdsv3-series) | November 2024 | A powerful new VM series that currently delivers a high level of IOPs and GB throughput, with strong memory capabilities up to the 176 vCore count for a consistent 8:1 memory-to-vCore ratio in this series. Both VMs in the series offer a consistent 64 maximum data disks per VM size, allowing you to maximize storage performance and still allow fully scalability across the table. The Mbdsv3 VMs in the series have the highest IOPS and GB throughput VMs available in Azure and can scale up to 4 TiBs at the 176 vCore level.|
| [Azure Update Manager](../azure-update-manager-sql-vm.md) | April 2024 | Automatically patch multiple SQL Server VMs at scale with the Azure Update Manager integrated in to the [SQL virtual machines](manage-sql-vm-portal.md) resource in the Azure portal, including Cumulative Updates. |
| [Azure SQL triggers for Azure Functions](/azure/azure-functions/functions-bindings-azure-sql-trigger) | March 2024 | Azure Functions supports function triggers for SQL Server on Azure VMs. |
| [Azure Elastic SAN](performance-guidelines-best-practices-storage.md#azure-elastic-san) | February 2024 | Place your SQL Server workloads on an Azure Elastic SAN for improved performance, throughput, and cost. | 


## Documentation changes 

Learn about significant changes to the SQL Server on Azure VMs documentation. For previous years, see the [What's new archive](doc-changes-updates-release-notes-whats-new-archive.md).

### February 2025

| Changes | Details |
| --- | --- |
| **FCI with Azure Elastic SAN GA** | Deploy your SQL Server failover cluster instance (FCI) by using an Azure Elastic SAN. Using the Azure Elastic SAN with your failover cluster instance is now generally available. Review [FCI with Azure Elastic SAN](failover-cluster-instance-azure-elastic-san-manually-configure.md) to learn more. |

### January 2025

| Changes | Details |
| --- | --- |
| **Managed identity support for SQL Server 2022 on Azure VM** | Starting with SQL Server 2022 Cumulative Update 17 (CU17), managed identities are supported for SQL Server on Azure VMs (Windows only). Users can now [back up to and restore SQL Server on Azure VM databases from Azure Blob storage](backup-restore-to-url-using-managed-identities.md), and utilize [EKM with AKV and Managed HSM on SQL Server on Azure VMs](managed-identity-extensible-key-management.md). |
| **Modernization Advisor preview** | Use the **Modernization Advisor** in the Azure portal for your SQL Server on Azure VM to determine if you can save on cost or optimize your performance by migrating your workload to Azure SQL Managed Instance. This feature is currently in preview. Review [Modernization Advisor](../modernization-advisor.md) to learn more. |
| **SQL Insights retired** | SQL Insights has been retired and is no longer available. Consider using [SCOM managed instance](/azure/azure-monitor/scom-manage-instance/overview) with the [SQL Server management pack](/system-center/scom/sql-server-management-pack-monitoring-configuration) or another monitoring solution to monitor SQL Server on Azure VMs. |


### November 2024

| Changes | Details |
| --- | --- |
| **Mbsv3 and Mbdsv3 VM series GA** | A powerful new VM series that currently delivers one of the highest IOPS and GB throughput, with substantial vCore and memory options. This VM series is now generally available. Review [Mbsv3 and Mbdsv3 series](performance-guidelines-best-practices-vm-size.md#mbsv3-and-mbdsv3-series) to learn more. |

### October 2024

| Changes | Details |
| --- | --- |
| **Microsoft Entra authentication in any cloud**| It's now possible to configure Microsoft Entra authentication for your SQL Server on Azure VMs in any cloud. Review [Microsoft Entra authentication](configure-azure-ad-authentication-for-sql-vm.md) to learn more. |

## Archive

For updates made in previous years, see the [What's new archive](doc-changes-updates-release-notes-whats-new-archive.md). 

## Contribute to content

To contribute to the Azure SQL documentation, see the [Docs contributor guide](/contribute/).

## Additional resources

**Windows VMs**:

* [Overview of SQL Server on Windows VMs](sql-server-on-azure-vm-iaas-what-is-overview.md)
* [Provision SQL Server on Windows VMs](create-sql-vm-portal.md)
* [Migration guide: SQL Server to SQL Server on Azure Virtual Machines](../../migration-guides/virtual-machines/sql-server-to-sql-on-azure-vm-individual-databases-guide.md)
* [High availability and disaster recovery for SQL Server on Azure Virtual Machines](business-continuity-high-availability-disaster-recovery-hadr-overview.md)
* [Performance best practices for SQL Server on Azure Virtual Machines](./performance-guidelines-best-practices-checklist.md)
* [Application patterns and development strategies for SQL Server on Azure Virtual Machines](application-patterns-development-strategies.md)

**Linux VMs**:

* [Overview of SQL Server on a Linux VM](../linux/sql-server-on-linux-vm-what-is-iaas-overview.md)
* [Provision SQL Server on a Linux virtual machine](../linux/sql-vm-create-portal-quickstart.md)
* [FAQ (Linux)](../linux/frequently-asked-questions-faq.yml)
* [SQL Server on Linux documentation](/sql/linux/sql-server-linux-overview)

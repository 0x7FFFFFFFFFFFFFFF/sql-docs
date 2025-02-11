---
title: What's new?
titleSuffix: Azure SQL Database
description: Learn about the new features and documentation improvements for Azure SQL Database.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: mathoma, randolphwest
ms.date: 02/11/2025
ms.service: azure-sql-database
ms.subservice: service-overview
ms.topic: whats-new
ms.custom:
  - build-2024
  - ignite-2024
monikerRange: "=azuresql || =azuresql-db"
---
# What's new in Azure SQL Database?

[!INCLUDE [appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!div class="op_single_selector"]
> * [Azure SQL Database](doc-changes-updates-release-notes-whats-new.md?view=azuresql&preserve-view=true)
> * [Azure SQL Managed Instance](../managed-instance/doc-changes-updates-release-notes-whats-new.md?view=azuresql&preserve-view=true)
> * [SQL Server on Azure VMs](../virtual-machines/windows/doc-changes-updates-release-notes-whats-new.md?view=azuresql&preserve-view=true)

This article summarizes the documentation changes associated with new features and improvements in the recent releases of [Azure SQL Database](https://azure.microsoft.com/products/azure-sql/database/). For more information about Azure SQL Database, see [What is Azure SQL Database?](sql-database-paas-overview.md)

> [!TIP]
> [Deploy Azure SQL Database for free](free-offer.md), for the life of your Azure subscription. This free offer provides up to ten free General Purpose databases, each with 100,000 vCore seconds of compute, every month.

For more announcements, discussion, and community content, see the [Azure SQL Database blog](https://techcommunity.microsoft.com/t5/azure-sql-blog/bg-p/AzureSQLBlog).

## Preview

The following table lists the features of Azure SQL Database that are currently in preview.

> [!NOTE]  
> Features currently in preview are available under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), review for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. Azure SQL Database provides previews to give you a chance to evaluate and [share feedback with the product group](https://feedback.azure.com/d365community/forum/ef2b2b38-2f25-ec11-b6e6-000d3a4f0f84) on features before they become generally available (GA).

| Feature | Details |
| --- | --- |
| **Availability metric**| Availability is now a metric in the Azure Monitor metrics. Driven by a variety of user connection failures, you can [monitor and configure alerts on Azure SQL Database Availability](monitoring-metrics-alerts.md#availability-metric). |
| **Copilot skills in Azure SQL Database** | Microsoft Copilot skills in Azure SQL Database include two Azure portal experiences: [Natural language to SQL](../copilot/query-editor-natural-language-to-sql-copilot.md) within the [Azure portal query editor](query-editor.md), and [Azure Copilot integration](../copilot/copilot-azure-sql-overview.md#microsoft-copilot-in-azure-enhanced-scenarios). |
| **Database watcher for Azure SQL** |[Database watcher](../database-watcher-overview.md) is a managed monitoring solution for database services in the Azure SQL family. Database watcher collects in-depth workload monitoring data to give you a detailed view of database performance, configuration, and health. Learn more about [database watcher](https://aka.ms/dbwatcher-preview-announcement). |
| **Degrees of Parallelism (DOP) feedback** | [DOP Feedback](/sql/relational-databases/performance/intelligent-query-processing-degree-parallelism-feedback) is currently available as a limited preview. For more information and how to apply for the preview, see [Announcing Degree of Parallelism Feedback Limited Preview](https://techcommunity.microsoft.com/t5/azure-sql-blog/announcing-degree-of-parallelism-feedback-limited-preview/ba-p/3806924). |
| **Elastic queries** | The [elastic queries](elastic-query-overview.md) feature allows for cross-database queries in Azure SQL Database. |
| **Elastic transactions** | [Elastic transactions](elastic-transactions-overview.md) allow you to execute transactions distributed among cloud databases in Azure SQL Database. |
| **Fixed server roles** | To simplify permission management, Azure SQL Database provides a set of [fixed server-level roles](security-server-roles.md) to help you manage the permissions on a logical server. | 
| **Hyperscale increased log generation rate** | The transaction log generation rate in Azure SQL Database Hyperscale single databases is set to increase from 100 MiB/s to 150 MiB/s. The increased log generation rate is available as an opt-in preview feature. For more information and to opt in to 150 MiB/s, see [Blog: November 2024 Hyperscale enhancements](https://aka.ms/AAslnql).|
| **Hyperscale continuous priming** | [Continuous priming](service-tier-hyperscale.md#buffer-pool-resilient-buffer-pool-extension-and-continuous-priming) is an innovative new feature designed to optimize Hyperscale performance during failovers by priming high availability secondary compute replicas. Continuous priming is currently in a gated preview. For more information and to opt in to continuous priming, see [Blog: November 2024 Hyperscale enhancements](https://aka.ms/AAslnql).|
| **Import and export using Private Link** | You can [import or export an Azure SQL Database using private link](database-import-export-private-link.md). Leave *Allow Access to Azure Services* off when you import or export a database using a service-managed endpoint. |
| **JSON native data type** | The new [**json** data type and JSON aggregate functions](/sql/t-sql/data-types/json-data-type?view=azuresqldb-current&preserve-view=true) provide new capabilities for handling semistructured data in Azure SQL Database. For more information, see [JSON Type and aggregates preview](https://aka.ms/json-type-aggregates-public-preview). |
| **JSON aggregate functions** | Two new [**json** aggregate functions `JSON_OBJECTAGG` and `JSON_ARRAYAGG`](/sql/relational-databases/json/json-data-sql-server?view=azuresqldb-current&preserve-view=true#json-data-from-aggregates) enable construction of JSON objects or arrays based on an aggregate from SQL data. For more information, see [JSON Type and aggregates preview](https://aka.ms/json-type-aggregates-public-preview). |
| **Manually initiate cutover for conversion to Hyperscale** | When converting an Azure SQL Database to the Hyperscale service tier, you have a new [option to manually initiate the cutover](https://aka.ms/hs-conversion-v2-preview). For more information, see [Convert an existing database to Hyperscale](convert-to-hyperscale.md). |
| **Microsoft Entra server principals** | The ability to [create server principals (logins) for Microsoft Entra identities](authentication-azure-ad-logins.md) in Azure SQL Database is in preview. |
| **Network Security Perimeter** | [Azure Network Security Perimeter](network-security-perimeter.md) allows organizations to define a logical network isolation boundary for PaaS resources (for example, Azure Storage and SQL Database) that are deployed outside your organization's virtual networks. It restricts public network access to PaaS resources outside of the perimeter, and access can be exempted by using explicit access rules for public inbound and outbound. |
| **Query editor in the Azure portal** | The [query editor in the Azure portal](query-editor.md) allows you to run queries against your Azure SQL Database directly from a web browser. |
|**sys.dm_database_backups** | The [sys.dm_database_backups](/sql/relational-databases/system-dynamic-management-views/sys-dm-database-backups-azure-sql-database) DMV returns information about backups of a database in a logical server for Azure SQL Database. | 
| **UNISTR (Transact-SQL)** | Azure SQL Database now supports the `UNISTR` T-SQL syntax for Unicode string literals. For more information, see [UNISTR (Transact-SQL)](/sql/t-sql/functions/unistr-transact-sql).|
| **Vector data type** | Working with vector data is now easier in Azure SQL Database with the introduction of a new [vector data type](/sql/t-sql/data-types/vector-data-type) and [functions](/sql/t-sql/functions/vector-functions-transact-sql). For more information, see [Intelligent applications with Azure SQL Database](ai-artificial-intelligence-intelligent-applications.md#vectors).|
| **\|\| (String concatenation) and \|\|= (Compound assignment) syntax support** | Azure SQL Database now supports [\|\| (String concatenation)](/sql/t-sql/language-elements/string-concatenation-pipes-transact-sql) and [\|\|= (Compound assignment)](/sql/t-sql/language-elements/compound-assignment-pipes-transact-sql) Transact-SQL syntax.|

## General availability (GA)

The following table lists features of Azure SQL Database that have been made generally available (GA) within the last 12 months:

| Feature | GA Month | Details |
| --- | --- | --- |
| **Free Azure SQL Database** | January 2025 | Use [Azure SQL Database for free](free-offer.md), for the life of your subscription. This free offer provides up to ten free General Purpose databases, each with 100,000 vCore seconds of compute, every month. For more information, see [Blog: General availability of Azure SQL Database free offer](https://aka.ms/azuresqlfreedb).|
| **Hyperscale support for database and file shrink**  | January 2025 | [Database and file shrink commands](file-space-manage.md) are now generally available for Azure SQL Database Hyperscale. For more information, see the [Shrink in Hyperscale Generally Available blog post](https://aka.ms/hs-shrink-ga).|
| **Fabric mirrored databases** | November 2024 | With [Fabric Mirroring](/fabric/database/mirrored-database/overview), you can [mirror databases in Azure SQL Database to Microsoft Fabric](/fabric/database/mirrored-database/overview). You can continuously replicate your existing data estate directly into Fabric's OneLake, including data from Azure SQL Database.|
| **Microsoft Entra nonunique name support** | November 2024 | The [CREATE USER](/sql/t-sql/statements/create-user-transact-sql) Transact-SQL (T-SQL) syntax has been extended to include `WITH OBJECT_ID` to [support creating Microsoft Entra logins and users in Azure SQL Database](authentication-microsoft-entra-create-users-with-nonunique-names.md) that have nonunique names. |
| **Lower auto-pause delay for serverless** |October 2024| Reduce costs by lowering the [auto-pause delay for serverless compute in Azure SQL Database](https://aka.ms/AAs7lpz). Learn more about the [auto-pause delay for serverless](serverless-tier-overview.md).|
| **Hyperscale elastic pools** | September 2024 | Manage and scale multiple Hyperscale databases in Azure SQL Database by using [Hyperscale elastic pools](hyperscale-elastic-pool-overview.md). Hyperscale elastic pools also support Premium-series hardware and zone redundancy. For more information, see [Hyperscale Elastic Pools are now generally available](https://aka.ms/hsep-ga). |
| **Hyperscale elastic pool maintenance window support** | September 2024 |You can configure a non-default [maintenance window](maintenance-window.md) for a [Hyperscale elastic pool](hyperscale-elastic-pool-overview.md). For more information, read [Blog: Maintenance window support for Azure SQL Database Hyperscale elastic pools](https://aka.ms/hsep-fmw). |
| **CURRENT_DATE** | August 2024 |  The [CURRENT_DATE Transact-SQL (T-SQL) function](/sql/t-sql/functions/current-date-transact-sql) returns the current database system date as a date value, without the database time and time zone offset. |
| **Maintenance window support for named replicas** |August 2024|[Maintenance window](maintenance-window.md) support for named replicas is now generally available. For more information, see [General Availability: Maintenance window support for Azure SQL Database Hyperscale named replica](https://aka.ms/MWsupportforNR).|
| **Maintenance window support for Hyperscale** | August 2024| [Maintenance window](maintenance-window.md) support for Hyperscale databases is now generally available. |
| **Automatic backups on secondary replicas** | August 2024 | Mitigate the performance impact on your workload by taking [automated backups from the non-readable secondary replica](automated-backups-overview.md#automatic-backups-on-secondary-replicas) in the Business Critical service tier. |
| **Database compatibility level 160 is now default** | June 2024 | [Database compatibility level 160](/sql/t-sql/statements/alter-database-transact-sql-compatibility-level?view=azuresqldb-current&preserve-view=true) is now the default for new databases created in Azure SQL Database. For more information on this announcement, see [General availability: Database compatibility level 160 in Azure SQL Database](https://techcommunity.microsoft.com/t5/azure-sql-blog/general-availability-database-compatibility-level-160-in-azure/ba-p/4172039). |
| **Hyperscale named replica zone redundant support** | June 2024 | [Zone redundancy support for Hyperscale named replicas](https://techcommunity.microsoft.com/blog/azuresqlblog/general-availability-maintenance-window-support-for-azure-sql-database-hyperscal/4207651) is now generally available. For more information, see [Hyperscale secondary replicas](service-tier-hyperscale-replicas.md). |
| **License-free standby replica** | May 2024 | Save on licensing costs by configuring your [secondary database replica for disaster recovery standby](standby-replica-how-to-configure.md). |
| **Elastic jobs** | April 2024 | [Elastic jobs, now generally available](https://techcommunity.microsoft.com/t5/azure-sql-blog/general-availability-elastic-jobs-in-azure-sql-database/ba-p/4087140), are the SQL Server Agent replacement for Azure SQL Database. [Elastic jobs](elastic-jobs-overview.md) now support Microsoft Entra ID authentication, private endpoints, management via REST APIs, Azure Alerts, and more new features since preview began. |
| **Maintenance window advance notifications** | March 2024 | [Advance notifications](advance-notifications.md) are now generally available for databases configured to use a nondefault [maintenance window](maintenance-window.md). |
| **Azure SQL triggers for Azure Functions** | March 2024 | Azure Functions supports [function triggers for Azure SQL Database](/azure/azure-functions/functions-bindings-azure-sql-trigger). |
| **Serverless Hyperscale** | February 2024 | Automatically scale your Hyperscale databases up and down based on usage when using the [serverless compute tier](serverless-tier-overview.md). |

## Documentation changes

Learn about significant changes to the Azure SQL Database documentation. For previous years, see the [What's new archive](doc-changes-updates-release-notes-whats-new-archive.md).

### February 2025

| Changes | Details |
| --- | --- |
| **Manually initiate cutover for conversion to Hyperscale** | When converting an Azure SQL Database to the Hyperscale service tier, [you have a new option to manually initiate the cutover](https://aka.ms/hs-conversion-v2-preview). For more information, see [Convert an existing database to Hyperscale](convert-to-hyperscale.md). This feature is currently in preview.|
| **Import bacpac file size increase** | The limit for an imported bacpac file size has been increased from 4 GB to 150 GB. For more information on importing a bacpac file generated from SqlPackage, see [Quickstart: Import a bacpac file to a database in Azure SQL Database](database-import.md).|

### January 2025

| Changes | Details |
| --- | --- |
| **Free Azure SQL Database** | Use [Azure SQL Database for free](free-offer.md), for the life of your subscription. This free offer provides up to 10 free General Purpose databases, each with 100,000 vCore seconds of compute, every month. For more information, see [Blog: General availability of Azure SQL Database free offer](https://aka.ms/azuresqlfreedb).|
| **Hyperscale support for database and file shrink** | [Database and file shrink commands](file-space-manage.md)  are now generally available for Azure SQL Database Hyperscale. For more information, see the [Shrink in Hyperscale Generally Available blog post](https://aka.ms/hs-shrink-ga).|
| **SQL Insights retired** | [SQL Insights has been retired](https://azure.microsoft.com/updates/?id=sql-insights-retirement) and is no longer available. Use [database watcher](../database-watcher-overview.md) or another monitoring solution to monitor Azure SQL Database. |

## Archive

For previous updates, see the [What's new archive](doc-changes-updates-release-notes-whats-new-archive.md).

## Contribute to content

To contribute to the Azure SQL documentation, see the [Docs contributor guide](/contribute/).

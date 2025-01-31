---
title: SQL Insights has been retired
titleSuffix: Azure SQL Database & Azure SQL Managed Instance
description: Learn about the retirement of SQL Insights, a feature used to monitor Azure SQL Database, Azure SQL Managed Instance, and SQL Server. SQL Insights has been retired and is no longer supported.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: mathoma
ms.date: 01/24/2024
ms.service: azure-sql
ms.subservice: monitoring
ms.topic: conceptual
ms.custom:
  - subject-monitoring
monikerRange: "=azuresql||=azuresql-db||=azuresql-mi||=azuresql-vm"
---

# SQL Insights has been retired

[!INCLUDE [sqldb-sqlmi-sqlvm](../includes/appliesto-sqldb-sqlmi-sqlvm.md)]

SQL Insights, [retired](https://azure.microsoft.com/updates/?id=sql-insights-retirement) on 31 December 2024, is no longer supported.

For Azure SQL Database, and Azure SQL Managed Instance, [database watcher](../database-watcher-overview.md) is the recommended monitoring solution for scenarios that require low data collection latency, estate-level monitoring, comprehensive monitoring data including query-level details, and support for advanced analytics on collected monitoring data. At this time, database watcher supports Azure SQL Database and Azure SQL Managed Instance. For other monitoring options, review [Monitor and tune Azure SQL](monitor-tune-overview.md). 

For SQL Server on Azure VMs, consider using [SCOM managed instance](/azure/azure-monitor/scom-manage-instance/overview) with the [SQL Server management pack](/system-center/scom/sql-server-management-pack-monitoring-configuration).


## Related content

- [Monitor and tune performance in Azure SQL Database and Azure SQL Managed Instance](monitor-tune-overview.md)
- [Database watcher](../database-watcher-overview.md)
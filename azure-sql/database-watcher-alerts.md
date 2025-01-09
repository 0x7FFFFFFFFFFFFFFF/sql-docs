---
title: Database watcher alerts
titleSuffix: Azure SQL Database & SQL Managed Instance
description: A detailed description of Azure Monitor Alerts in database watcher
author: dimitri-furman
ms.author: dfurman
ms.date: 01/08/2025
ms.service: azure-sql
ms.subservice: monitoring
ms.topic: conceptual
ms.custom:
  - subject-monitoring
monikerRange: "=azuresql||=azuresql-db||=azuresql-mi"
---

# Database watcher alerts (preview)

[!INCLUDE [sqldb-sqlmi](./includes/appliesto-sqldb-sqlmi.md)]

After you [create and configure](database-watcher-manage.md) a watcher, you can set up [Azure Monitor Alerts](/azure/azure-monitor/alerts/alerts-overview) to receive notifications about high resource usage, notable workload patterns, and other conditions across your Azure SQL estate that might require attention. To do this, you create a [log search alert rule](/azure/azure-monitor/alerts/alerts-create-log-alert-rule) that queries the data store of a watcher on a schedule.

To help you create alert rules, database watcher includes templates for common alert conditions. Once an alert rule is created from a database watcher template, you can manage it just like any other alert rule in Azure Monitor Alerts. You can use all capabilities of Azure alerting, including notifications sent via email, SMS, and phone, integration with ITSM products, webhooks, event hubs, and more. You can customize alert rules created from database watcher templates, or create your own alert rules.

To learn more about Azure Monitor Alerts, see:

- [What are Azure Monitor alerts?](/azure/azure-monitor/alerts/alerts-overview)
- [Create or edit a log search alert rule](/azure/azure-monitor/alerts/alerts-create-log-alert-rule)
- [Action groups](/azure/azure-monitor/alerts/action-groups)
- [Manage alert rules](/azure/azure-monitor/alerts/alerts-manage-alert-rules)
- [Best practices for Azure Monitor alerts](/azure/azure-monitor/best-practices-alerts)

To learn about limitations that apply to alerts in database watcher, see [Limitations](database-watcher-overview.md#limitations).

## Glossary

When working with Azure Monitor Alerts in database watcher, it is important to understand commonly used terms:

- **Alert rule**

    An Azure resource in Azure Monitor Alerts that defines alerting logic such as the frequency of evaluation, severity, KQL query, etc. Alert rule also tracks alert history.

- **Alert**

    Occurs when an evaluation of an alert rule KQL query triggers the logic to fire an alert. For example, the query determines that a CPU threshold has been exceeded.

- **Alert rule template**

    A blueprint of an alert rule that is built into database watcher. An alert rule template defines the following alert rule properties:
    - Name
    - Description
    - Severity
    - Evaluation frequency
    - A KQL query to execute in the data store to evaluate the alert rule

## Alert rule templates

You can find all available alert rule templates on the **Alerts** page of a watcher.

Over time, existing templates might be modified, and new templates might be added in response to customer [feedback](database-watcher-overview.md#send-feedback). Each template on the **Alerts** page of a watcher has a version in the **year-month-day.number** format to let you see when it was last modified.

If you created an alert rule from a template in the past and see that a newer template is available, you can recreate the rule from the newer template to take advantage of fixes and improvements in the alert rule definition.

The following tables describe currently available alert rule templates for each SQL target type.

> [!NOTE]
> During preview, alert rule templates might be added, modified, and removed.

# [SQL database](#tab/sqldb)

| Category | Name | Severity | Frequency | Description |
|:--|:--|:--|:--|:--|
| Availability | Failed connectivity probes | 2 - Warning | 5 minutes | Alerts if the number of failed connectivity probes exceeds a threshold. |
| Availability | Geo-replication not healthy | 1 - Error | 5 minutes | Alerts if data replication to geo-replicas might be lagging or is interrupted. |
| Resource usage | High CPU utilization | 3 - Informational | 5 minutes | Alerts if either database or instance CPU utilization exceeds a threshold. |
| Resource usage | High worker utilization | 2 - Warning | 5 minutes | Alerts if worker utilization in a database exceeds a threshold. |
| Resource usage | Low data storage | 2 - Warning | 30 minutes | Alerts if the used data storage is close to the maximum database size, and the data growth rate is high. |
| Resource usage | Low transaction log storage | 1 - Error | 5 minutes | Alerts if the used transaction log storage is high, and the log growth rate is also high. |
| Resource usage | Out-of-memory events | 3 - Informational | 5 minutes | Alerts if there are any out-of-memory events in a database. |
| Workload patterns | Blocked process spike | 2 - Warning | 5 minutes | Alerts if the number of blocked processes in a database has spiked over a threshold. |
| Workload patterns | Blocked requests | 1 - Error | 5 minutes | Alerts if there is a minimum number of blocked requests in a database that have been waiting longer than a certain duration. |
| Workload patterns | Deadlock spike | 3 - Informational | 5 minutes | Alerts if the number of deadlocks in a database has spiked over a threshold. |
| Workload patterns | Lock wait spike | 2 - Warning | 5 minutes | Alerts if the cumulative wait time for locks in a database has spiked over a threshold. |
| Workload patterns | Memory wait spike | 3 - Informational | 5 minutes | Alerts if the cumulative wait time for memory in a database has spiked over a threshold. |
| Workload patterns | Network IO wait spike | 3 - Informational | 5 minutes | Alerts if the cumulative wait time for network IO in a database has spiked over a threshold. |
| Workload patterns | Request rate drop | 3 - Informational | 5 minutes | Alerts if the request rate in a database has dropped significantly. |
| Workload patterns | Request timeout spike | 1 - Error | 5 minutes | Alerts if the number of request (query) timeouts and cancelations in a database has spiked over a threshold. |
| Workload patterns | User error spike | 3 - Informational | 5 minutes | Alerts if the number of user errors in a database has spiked over a threshold. |

# [SQL elastic pool](#tab/sqlep)

| Category | Name | Severity | Frequency | Description |
|:--|:--|:--|:--|:--|
| Resource usage | High CPU utilization | 3 - Informational | 5 minutes | Alerts if either elastic pool or instance CPU utilization exceeds a threshold. |
| Resource usage | High worker utilization | 2 - Warning | 5 minutes | Alerts if worker utilization in an elastic pool exceeds a threshold. |
| Resource usage | Low data storage | 2 - Warning | 30 minutes | Alerts if the used data storage is close to the maximum elastic pool size, and the data growth rate is high. |
| Resource usage | Low tempdb log storage | 1 - Error | 5 minutes | Alerts if the used transaction log storage in tempdb is high, and the log growth rate is also high. |
| Resource usage | Out-of-memory events | 3 - Informational | 5 minutes | Alerts if there are any out-of-memory events in an elastic pool. |
| Workload patterns | Blocked process spike | 2 - Warning | 5 minutes | Alerts if the number of blocked processes across all databases in an elastic pool has spiked over a threshold. |
| Workload patterns | Deadlock spike | 3 - Informational | 5 minutes | Alerts if the number of deadlocks across all databases in an elastic pool has spiked over a threshold. |
| Workload patterns | Lock wait spike | 2 - Warning | 5 minutes | Alerts if the cumulative wait time for locks across all databases in an elastic pool has spiked over a threshold. |
| Workload patterns | Memory wait spike | 3 - Informational | 5 minutes | Alerts if the cumulative wait time for memory across all databases in an elastic pool has spiked over a threshold. |
| Workload patterns | Network IO wait spike | 3 - Informational | 5 minutes | Alerts if the cumulative wait time for network IO across all databases in an elastic pool has spiked over a threshold. |
| Workload patterns | Request timeout spike | 1 - Error | 5 minutes | Alerts if the number of request (query) timeouts and cancelations across all databases in an elastic pool has spiked over a threshold. |
| Workload patterns | User error spike | 3 - Informational | 5 minutes | Alerts if the number of user errors across all databases in an elastic pool has spiked over a threshold. |

# [SQL managed instance](#tab/sqlmi)

| Category | Name | Severity | Frequency | Description |
|:--|:--|:--|:--|:--|
| Administrative | Failed SQL Agent jobs | 2 - Warning | 5 minutes | Alerts if there are any failed SQL Agent jobs. |
| Availability | Failed connectivity probes | 2 - Warning | 5 minutes | Alerts if the number of failed connectivity probes exceeds a threshold. |
| Availability | Geo-replication not healthy | 1 - Error | 5 minutes | Alerts if data replication to geo-replicas might be lagging or is interrupted. |
| Resource usage | High CPU utilization | 3 - Informational | 5 minutes | Alerts if instance CPU utilization exceeds a threshold. |
| Resource usage | High worker utilization | 2 - Warning | 5 minutes | Alerts if instance worker utilization exceeds a threshold. |
| Resource usage | Low database data storage | 3 - Informational | 30 minutes | Alerts if the used data storage in a database is close to the maximum database size, and the data growth rate is high. |
| Resource usage | Low database transaction log storage | 1 - Error | 5 minutes | Alerts if the used transaction log storage in a database is high, and the log growth rate is also high. |
| Resource usage | Low instance storage | 2 - Warning | 30 minutes | Alerts if the used storage on an instance is close to the maximum instance storage size, and the storage growth rate is high. |
| Resource usage | Out-of-memory events | 3 - Informational | 5 minutes | Alerts if there are any out-of-memory events on an instance. |
| Workload patterns | Blocked process spike | 2 - Warning | 5 minutes | Alerts if the number of blocked processes on an instance has spiked over a threshold. |
| Workload patterns | Blocked requests | 1 - Error | 5 minutes | Alerts if there is a minimum number of blocked requests on an instance that have been waiting longer than a certain duration. |
| Workload patterns | Deadlock spike | 3 - Informational | 5 minutes | Alerts if the number of deadlocks on an instance has spiked over a threshold. |
| Workload patterns | Lock wait spike | 2 - Warning | 5 minutes | Alerts if the cumulative wait time for locks on an instance has spiked over a threshold. |
| Workload patterns | Memory wait spike | 3 - Informational | 5 minutes | Alerts if the cumulative wait time for memory on an instance has spiked over a threshold. |
| Workload patterns | Network IO wait spike | 3 - Informational | 5 minutes | Alerts if the cumulative wait time for network IO on an instance has spiked over a threshold. |
| Workload patterns | Request rate drop | 3 - Informational | 5 minutes | Alerts if the request rate on an instance has dropped significantly. |
| Workload patterns | Request timeout spike | 1 - Error | 5 minutes | Alerts if the number of request (query) timeouts and cancelations on an instance has spiked over a threshold. |
| Workload patterns | User error spike | 3 - Informational | 5 minutes | Alerts if the number of user errors on an instance has spiked over a threshold. |

---

> [!TIP]
> You might not need to use all included templates. Review template descriptions and consider your requirements before creating alert rules.
>
> Unnecessary alert rules increase the load on your Azure Data Explorer cluster and the monthly cost of alerts.

### Add default alert rule identity

To access the data store, each log search alert rule needs to have a managed identity. Before you can create alert rules from database watcher templates, you must configure the default alert rule identity for the watcher using the following steps.

> [!IMPORTANT]
> To follow the principle of least privilege, use a separate identity for alert rules. Do not reuse the [watcher identity](database-watcher-manage.md#modify-watcher-identity).

1. [Create a user assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity), or find an existing user assigned identity with the required access.
1. In the Azure portal, navigate to your watcher and select the **Alerts** page.
1. Select **Manage alert rule identity**, and select **Add**.
1. Find the user assigned identity from step one, select **Add**, and select **Close**.

Database watcher automatically assigns the identity you select to each new alert rule. It also grants the identity access to the data store if the current user has the **Owner** RBAC role assignment on the Azure Data Explorer cluster hosting the data store.

Otherwise, a user with the **Owner** assignment on the Azure Data Explorer cluster must grant the following access to the default alert rule identity selected for a watcher:

- The **Reader** role on the Azure Data Explorer cluster. For more information, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).
- The **Viewer** role on the Azure Data Explorer database. For more information, see [Role-based access control](/kusto/access-control/role-based-access-control?view=azure-data-explorer&preserve-view=true).

If you change the default alert rule identity of a watcher, the new identity is used for any new alert rule you create using a template. To change the identity of an existing alert rule, see [Configure alert rule details](/azure/azure-monitor/alerts/alerts-create-log-alert-rule#configure-alert-rule-details).

### Create an alert rule from a template

To create an alert rule from a database watcher template:

1. On the **Alerts** page of a watcher, find the template you want to use. Templates are grouped by category, such as **Resource usage**, **Workload patterns**, etc.
    > [!IMPORTANT]
    >
    > There are different templates for different SQL target types. For example, there is a different **High CPU utilization** template for SQL database, SQL elastic pool, and SQL managed instance.
    > 
    > When creating an alert rule, make sure to select the SQL target type that matches the type of SQL targets you added to your watcher. If you monitor multiple types of SQL targets, you need to create separate alert rules for each SQL target type.
1. Select **Create alert rule**.
1. Select the Azure subscription, resource group, name, region, severity, and evaluation frequency for the alert rule. We recommend that the region of the alert rule matches the region of the Azure Data Explorer cluster used as the data store for the watcher.
    > [!CAUTION]
    >
    > If an alert rule with the same name already exists in the same subscription, resource group, and region, it is *replaced* by the alert rule created from the template. Any alert rule customizations you might have made are replaced with the template values.

    If an alert rule with the same name already exists in the same subscription and resource group, but is in a different region, deployment validation fails and the alert rule is not created.
    
    To ensure that a new alert rule is created, use a unique alert rule name.
1. Select **Next**, and optionally select one or more action groups. If you don't select an action group, you see a fired alert on the Azure Monitor **Alerts** page in the Azure portal, but don't receive a notification. For more information and to learn how to create an action group, see [Action groups](/azure/azure-monitor/alerts/action-groups).
1. Select **Next** or **Review + create**. Once validation completes, review the details and select **Create**.

## Manage alert rules

After an alert rule is created, you can manage it just like any other alert rule in Azure Monitor Alerts. For example, you can change alert rule description, severity, evaluation frequency, and add or remove action groups. You can also edit the KQL query to adjust alert thresholds, exclude certain SQL targets from alerting, or make the alert rule work only for specific SQL targets.

In the Azure portal, navigate to **Monitor**, **Alerts**, **Alert rules**, and select an alert rule. You can edit the rule, duplicate it, disable it temporarily, or delete it permanently.

For more information, see [Manage alert rules](/azure/azure-monitor/alerts/alerts-manage-alert-rules) and [Configure alert rule details](/azure/azure-monitor/alerts/alerts-create-log-alert-rule#configure-alert-rule-details).

## Work with database watcher alerts

When an alert rule fires, it creates an instance of an alert. If the alert rule has any action groups, their actions are executed. For example, you receive a notification that an alert fired.

The alert stays in the **Fired** state until a periodic execution of the alert rule detects that the condition is no longer present and changes the alert state to **Resolved**. At that point, you receive another notification that the alert is resolved. For more information, see [Stateful alerts](/azure/azure-monitor/alerts/alerts-overview#stateful-alerts).

When an alert fires or is resolved, and if you added an action group configured to send email notifications, you receive an email for each SQL target where the alert condition occurs. For example, if an alert rule detects that CPU utilization is high on two SQL managed instances, you receive two separate emails.

You can see all alert instances and their state on the Azure Monitor **Alerts** page in the Azure portal. You can add filters to focus on the alerts for specific Azure SQL resources or resource types. For more information, see [Manage alert instances](/azure/azure-monitor/alerts/alerts-manage-alert-instances).

## Related content

- [What are Azure Monitor alerts?](/azure/azure-monitor/alerts/alerts-overview)
- [Monitor Azure SQL workloads with database watcher (preview)](database-watcher-overview.md)
- [Quickstart: Create a database watcher to monitor Azure SQL (preview)](database-watcher-quickstart.md)
- [Create and configure a database watcher (preview)](database-watcher-manage.md)
- [Database watcher data collection and datasets (preview)](database-watcher-data.md)
- [Analyze database watcher monitoring data (preview)](database-watcher-analyze.md)
- [Database watcher FAQ](database-watcher-faq.yml)
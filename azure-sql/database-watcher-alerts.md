---
title: Database watcher alerts
titleSuffix: Azure SQL Database & SQL Managed Instance
description: A detailed description of alerts in database watcher
author: dimitri-furman
ms.author: dfurman
ms.date: 12/19/2024
ms.service: azure-sql
ms.subservice: monitoring
ms.topic: conceptual
ms.custom:
  - subject-monitoring
monikerRange: "=azuresql||=azuresql-db||=azuresql-mi"
---

# Database watcher alerts (preview)

[!INCLUDE [sqldb-sqlmi](./includes/appliesto-sqldb-sqlmi.md)]

After you [create and configure](database-watcher-manage.md) a watcher, you can use [Azure Monitor Alerts](/azure/azure-monitor/alerts/alerts-overview) to receive notifications about high resource usage, notable workload patterns, and other conditions across your Azure SQL estate that might require action. To do this, you use a [log search alert rule](/azure/azure-monitor/alerts/alerts-create-log-alert-rule) that queries the data in the data store of a watcher.

Database watcher lets you create log search alert rules from a set of predefined alert rule templates. Once an alert rule is created from a template, it behaves just like any other alert rule in Azure Monitor Alerts. You can use all capabilities of Azure alerting such as notifications sent via email, SMS, and phone, integration with ITSM products, webhooks, event hubs, and more. You can customize alert rules created from database watcher templates or create your own alert rules.

To learn more about Azure Monitor Alerts, see:

- [What are Azure Monitor alerts?](/azure/azure-monitor/alerts/alerts-overview)
- [Create or edit a log search alert rule](/azure/azure-monitor/alerts/alerts-create-log-alert-rule)
- [Action groups](/azure/azure-monitor/alerts/action-groups)
- [Manage alert rules](/azure/azure-monitor/alerts/alerts-manage-alert-rules)
- [Best practices for Azure Monitor alerts](/azure/azure-monitor/best-practices-alerts)

## Add default alert rule identity

Each alert rule you create must have a managed identity that is granted access to the data store. To follow the principle of least privilege, this identity must be different from the [watcher identity](database-watcher-manage.md#modify-watcher-identity). Before you can create alert rules from templates, you must create and configure the default alert rule identity for the watcher using the following steps. Database watcher assigns this identity to any new alert rule it creates.

1. Create a new user assigned identity. For more information, see [Create a user assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity).
1. In the Azure portal, navigate to your watcher and select the **Alerts** page.
1. Select **Manage alert rule identity**, and select **Add**.
1. Find the user assigned identity you created, and select **Add**, and select **Close**.

Database watcher automatically grants the default rule identity required access to the data store if the current user has the **Owner** RBAC role assignment on the Azure Data Explorer cluster hosting the data store.

Otherwise, a user with the **Owner** assignment must grant the following access to the default alert rule identity selected for a watcher:

1. The **Reader** role on the Azure Data Explorer cluster. For more information, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).
1. The **Viewer** role on the Azure Data Explorer database. For more information, see [Role-based access control](/kusto/access-control/role-based-access-control?view=azure-data-explorer&preserve-view=true).

If you change the default alert rule identity for a watcher, the new identity is used for any new alert rule you create from a template. To change the identity for an existing alert rule, see [Configure alert rule details](/azure/azure-monitor/alerts/alerts-create-log-alert-rule#configure-alert-rule-details).

## Create an alert rule from a template

You can find alert rule templates for common types of alerts on the **Alerts** page of a watcher.

A template defines the following alert rule properties:

- Name
- Description
- Severity
- Evaluation frequency
- KQL query to execute in the data store to evaluate the alert rule

Over time, existing templates might be modified, and new templates might be added based on customer [feedback](database-watcher-overview.md#send-feedback).

Each template has a version in the **year-month-day.number** format to let you see when it was last modified. If you created alert rules from a template in the past and see that a newer template is available, you can recreate alert rules from the newer template to take advantage of fixes and improvements in the alert rule definition.

> [!IMPORTANT]
>
> There are different templates for different SQL target types. For example, there are different **High CPU utilization** templates for SQL database, SQL elastic pool, and SQL managed instance.
> 
> When creating an alert rule, make sure to select the SQL target type that matches the data in the data store. If you monitor multiple types of SQL targets, you need to create a separate alert rule for each type of SQL target.

To create an alert rule from a template:

1. On the **Alerts** page of a watcher, find the template you want to use for your SQL target type. Templates are arranged by category, such as **Resource usage**, **Workload patterns**, etc.
1. Select **Create alert rule**.
1. Select the Azure subscription, resource group, name, region, severity, and evaluation frequency for the alert rule. We recommend that the region of the alert rule matches the region of the Azure Data Explorer cluster used as the data store for the watcher.

    > [!NOTE]
    >
    > If an alert rule with the same name already exists in the same subscription, resource group, and region, it is *replaced* by the alert rule created from the template.
    >
    > If an alert rule with the same name already exists in the same subscription and resource group, but is in a different region, deployment validation fails.
    >
    > To ensure that a new alert rule is created, use a unique alert rule name.

1. Select **Next**, and optionally select one or more action groups. If you don't select an action group and the alert fires, you see the fired alert on the Azure Monitor **Alerts** page in the Azure portal, but don't receive a notification. For more information and to learn how to create an action group, see [Action groups](/azure/azure-monitor/alerts/action-groups).
1. Select **Next** or **Review + create**. Once validation completes, review the details and select **Create**.

## Manage alert rules

After an alert rule is created, you can manage it just like any other alert rule in Azure Monitor Alerts. For example, you can change alert rule name, description, severity, and evaluation frequency. You can also edit the KQL query to adjust alert thresholds, exclude certain SQL targets from alerting, or make the alert rule work only for specific SQL targets.

In the Azure portal, navigate to **Monitor**, **Alerts**, **Alert rules**, and select an alert rule. You can edit the rule, duplicate it, disable it temporarily, or delete it permanently.

For more information, see [Manage alert rules](/azure/azure-monitor/alerts/alerts-manage-alert-rules) and [Configure alert rule details](/azure/azure-monitor/alerts/alerts-create-log-alert-rule#configure-alert-rule-details).

## Work with alerts

When an alert rule fires, it creates an instance of an alert. The actions in the action groups you added to the alert rule are executed. For example, you receive a notification that an alert fired. The alert stays in the **Fired** state until a future execution of the alert rule detects that the condition is no longer present and changes the alert state to **Resolved**. At that point, you receive another notification that the alert is resolved. For more information, see [Stateful alerts](/azure/azure-monitor/alerts/alerts-overview#stateful-alerts).

When an alert fires or is resolved, and if you added an action group configured to send email notifications, you receive an email for each SQL target where the alert condition occurs. For example, if an alert rule detects that CPU utilization is above the threshold on two SQL managed instances, you receive two separate emails.

You can see all alert instances and their state on the Azure Monitor **Alerts** page in the Azure portal. You can add filters to focus on the alerts for specific Azure SQL resources or resource types. For more information, see [Manage alert instances](/azure/azure-monitor/alerts/alerts-manage-alert-instances).

## Limitations

- Database watcher alerts aren't available when the data store uses Real-Time Analytics in Microsoft Fabric, or a free Azure Data Explorer cluster.
- Azure log search alerts on Azure Data Explorer don't support 1-minute alert evaluation frequency.
- Azure log search alerts on Azure Data Explorer aren't supported when public access to the Azure Data Explorer cluster is disabled.

## Related content

- [What are Azure Monitor alerts?](/azure/azure-monitor/alerts/alerts-overview)
- [Monitor Azure SQL workloads with database watcher (preview)](database-watcher-overview.md)
- [Quickstart: Create a database watcher to monitor Azure SQL (preview)](database-watcher-quickstart.md)
- [Create and configure a database watcher (preview)](database-watcher-manage.md)
- [Database watcher data collection and datasets (preview)](database-watcher-data.md)
- [Analyze database watcher monitoring data (preview)](database-watcher-analyze.md)
- [Database watcher FAQ](database-watcher-faq.yml)
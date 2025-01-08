---
title: Analytics Platform System (PDW) services status
description: Analytics Platform System (PDW) services status for Analytics Platform System.
author: charlesfeddersen
ms.author: charlesf
ms.reviewer: martinle
ms.date: 1/03/2025
ms.service: sql
ms.subservice: data-warehouse
ms.topic: how-to
---

# Parallel Data Warehouse services status for Analytics Platform System (PDW)
The Parallel Data Warehouse **Services Status** page in the Microsoft Analytics Platform System Configuration Manager shows the current status of all SQL Server PDW services, and provides the ability to stop and start the PDW services. This is the only supported method for starting and stopping the PDW services. Individual components or services cannot be started independently.  

#### <a id="to-start-or-stop-the-appliance-services"></a> Start or stop the appliance services

To launch the Configuration Manager, see [Launch the Configuration Manager in Analytics Platform System](launch-the-configuration-manager.md?view=aps-pdw-2016-au7&preserve-view=true).
  
1. To start the appliance services, select **Start Appliance**.  
  
1. To stop the appliance services, select **Stop Appliance**.  
  
It is not necessary to select **Apply** when starting and stopping the appliance services by using **Start Appliance** and **Stop Appliance**.  
  
:::image type="content" source="./media/pdw-services-status/SQL_Server_PDW_DWConfig_ApplPDWServices.png" alt-text="Screenshot of the Microsoft Analytics Platform System Configuration Manager, showing the Services Status page.":::
  
> [!NOTE]  
> Stopping the PDW Region also stops the PDW agent (sqldwagent) on the nodes. The PDW agent requires the PDW control node to report health monitoring.  
  
## Related content

- [Power the appliance on or off for Analytics Platform System](power-the-aps-appliance-on-or-off.md)

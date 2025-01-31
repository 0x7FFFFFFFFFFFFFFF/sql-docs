---
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: randolphwest
ms.date: 01/31/2025
ms.topic: include
ms.custom: ignite-2023
---

### ESU billing after failover

During the failovers, the extension is aware of the transition and automatically switches the ESU billing to the active replica without new bill-back charges and follow below logic

- If the period of failover <= 90 days, ESU billback occurs only from the prior watermark of usage upload.
- If the period of failover > 90 days, ESU billback occurs from the start of the ESU period.
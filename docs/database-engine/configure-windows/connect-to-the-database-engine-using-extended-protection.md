---
title: "Connect to the Database Engine Using Extended Protection"
description: Learn how Extended Protection uses service binding and channel binding to help prevent authentication relay attacks. See how to enable this feature.
author: VanMSFT
ms.author: vanto
ms.reviewer: maghan
ms.date: 12/23/2024
ms.service: sql
ms.subservice: configuration
ms.topic: conceptual
ai-usage: ai-assisted 
helpviewer_keywords:
  - "spoofing attacks"
  - "service binding"
  - "luring attacks"
  - "Schannel"
  - "channel binding"
  - "Extended Protection"
---

# Connect to the database engine with Extended Protection

[!INCLUDE [SQL Server](../../includes/applies-to-version/sqlserver.md)]

 SQL Server supports **Extended Protection** beginning with SQL Server 2008 R2 (10.50.x).

**Extended Protection** helps prevent authentication relay attacks by ensuring the client knows the service it connects to.

**Extended Protection** is a feature of the network components implemented by the operating system. **Extended Protection** is supported in Windows 7 and Windows Server 2008 R2. **Extended Protection** is included in service packs for older [!INCLUDE [msCoName](../../includes/msconame-md.md)] operating systems.

SQL Server is more secure when connections are made using **Extended Protection**.

## Description of Extended Protection

**Extended Protection** uses service binding and channel binding to help prevent an authentication relay attack. In an authentication relay attack, a client that can perform NTLM authentication (for example, Windows Explorer, [!INCLUDE [msCoName](../../includes/msconame-md.md)] Outlook, a .NET SqlClient application, etc.), connects to an attacker (for example, a malicious CIFS file server). The attacker uses the client's credentials to masquerade as the client and authenticate to a service (for example, an instance of the  Database Engine.

There are two variations of this attack:

- In a luring attack, the client is lured to connect to the attacker voluntarily.

- In a spoofing attack, the client intends to connect to a valid service but is unaware that one or both DNS and IP routing are poisoned to redirect the connection to the attacker instead.

 SQL Server supports service binding and channel binding to help reduce these attacks on  SQL Server instances.

### Service binding

Service binding addresses luring attacks by requiring a client to send a signed service principal name (SPN) of the  SQL Server service that the client intends to connect to. As part of the authentication response, the service validates that the SPN received in the packet matches its own SPN. If a client is lured to connect to an attacker, the client includes the attacker's signed SPN. The attacker can't relay the packet to authenticate to the real  SQL Server service as the client because it would include the SPN of the attacker. Service binding incurs a one-time, negligible cost but doesn't address spoofing attacks. Service Binding occurs when a client application doesn't use encryption to connect to the  SQL Server.

### Channel binding

Channel binding establishes a secure channel (Schannel) between a client and an instance of the  SQL Server service. The service verifies the client's authenticity by comparing the client's channel binding token (CBT) specific to that channel with its own CBT. Channel binding addresses both luring and spoofing attacks. However, it incurs a larger runtime cost because it requires Transport Layer Security (TLS) encryption of all the session traffic. Channel Binding occurs when a client application uses encryption to connect to the  SQL Server, regardless of whether encryption is enforced by the client or by the server.

> [!WARNING]  
> SQL Server and  Microsoft  data providers for SQL Server support TLS 1.0 and SSL 3.0. If you enforce a different protocol (such as TLS 1.1 or TLS 1.2) by making changes in the operating system SChannel layer, your connections to SQL Server might fail. Make sure that you have the latest build of SQL Server to Support TLS 1.1 or TLS 1.2. For more information, see <https://support.microsoft.com/topic/kb3135244-tls-1-2-support-for-microsoft-sql-server-e4472ef8-90a9-13c1-e4d8-44aad198cdbe>.

### Operating system support

The following links provide more information about how Windows supports **Extended Protection**:

- [Integrated Windows Authentication with Extended Protection](/previous-versions/visualstudio/visual-studio-2008/dd639324(v=vs.90))

- [Microsoft Security Advisory (973811), Extended Protection for Authentication](/security-updates/SecurityAdvisories/2009/973811)

## Settings

There are three  SQL Server connection settings that affect service binding and channel binding. The settings can be configured using the  SQL Server Configuration Manager or WMI and viewed using the **Server Protocol Settings** facet of Policy Based Management.

### Force Encryption

Possible values are **On** and **Off**. To use channel binding, **Force Encryption** must be set to **On**, and all clients must encrypt. If it's **Off**, only service binding is guaranteed. **Force Encryption** is on the **Protocols for MSSQLSERVER Properties (Flags Tab)** in  SQL Server Configuration Manager.

### Extended Protection

Possible values are **Off**, **Allowed**, and **Required**. The **Extended Protection** variable lets users configure the **Extended Protection** level for each  SQL Server instance. **Extended Protection** is on the **Protocols for MSSQLSERVER Properties (Advanced Tab)** in  SQL Server Configuration Manager.

When set to **Off**, **Extended Protection** is disabled. The instance of  SQL Server accepts connections from any client regardless of whether the client is protected or not. **Off** is compatible with older and unpatched operating systems but is less secure. Use this setting when the client operating systems don't support extended protection.

When set to **Allowed**, **Extended Protection** is required for connections from operating systems that support **Extended Protection**. **Extended Protection** is ignored for connections from operating systems that don't support **Extended Protection**. Connections from unprotected client applications running on protected client operating systems are rejected. This setting is more secure than **Off**, but it isn't the most secure. Use this setting in mixed environments; some operating systems support **Extended Protection**, and others don't.

When set to **Required**, only connections from protected applications on protected operating systems are accepted. This setting is the most secure, but connections from operating systems or applications that don't support **Extended Protection** won't be able to connect to  SQL Server.

### Accepted NTLM SPNs

The **Accepted NTLM SPNs** variable is needed when more than one SPN knows a server. When a client attempts to connect to the server using a valid SPN that the server doesn't know, service binding fails. To avoid this problem, users can specify several SPNs representing the server using the **Accepted NTLM SPNs**. **Accepted NTLM SPNs** is a series of SPNs separated by semicolons. For example, to allow the SPNs **MSSQLSvc/ HostName1.Contoso.com** and **MSSQLSvc/ HostName2.Contoso.com**, type **MSSQLSvc/HostName1.Contoso.com;MSSQLSvc/HostName2.Contoso.com** in the **Accepted NTLM SPNs** box. The variable has a maximum length of 2,048 characters. **Accepted NTLM SPNs** is on the **Protocols for MSSQLSERVER Properties (Advanced Tab)** in  SQL Server Configuration Manager.

## Enabling Extended Protection for the database engine

To use **Extended Protection**, both the server and the client must have an operating system that supports **Extended Protection** and must be enabled on the operating system. For more information about how to enable **Extended Protection** for the operating system, see [Extended Protection for Authentication](/dotnet/framework/WCF/feature-details/extended-protection-for-authentication-overview).

While **Extended Protection** and **NTLMv2** are enabled by default in all supported versions of Windows, **Extended Protection** isn't enabled by default for SQL Server connections. Users must manually enable it in [SQL Server Configuration Manager](../../relational-databases/sql-server-configuration-manager.md).

To enable **Extended Protection** for SQL Server connections, administrators must configure the settings in [SQL Server Configuration Manager](../../relational-databases/sql-server-configuration-manager.md). This includes options for service binding and channel binding to mitigate various types of authentication relay attacks. For detailed instructions, refer to the SQL Server documentation on configuring **Extended Protection**.

After enabling **Extended Protection** on the server computer, use the following steps to enable **Extended Protection**:

1. On the **Start** menu, choose **All Programs**, point to **Microsoft SQL Server** and then select **SQL Server Configuration Manager**.

1. Expand **SQL Server Network Configuration**, and then right-click **Protocols for** _\<_InstanceName*>*, and then select **Properties**.

1. on the **Advanced** tab, set **Extended Protection** to the appropriate setting for both channel binding and service binding.

1. Optionally, when more than one SPN knows a server, on the Advanced tab, configures the **Accepted NTLM SPNs** field as described in the "Settings" section.

1. For channel binding, on the **Flags** tab, set **Force Encryption** to **On**.

1. Restart the [!INCLUDE [ssDE](../../includes/ssde-md.md)] service.

## Configuring other SQL Server components

For more information about how to configure [!INCLUDE [ssRSnoversion](../../includes/ssrsnoversion-md.md)], see [Extended Protection for Authentication with Reporting Services](../../reporting-services/security/extended-protection-for-authentication-with-reporting-services.md).

When using IIS to access [!INCLUDE [ssASnoversion](../../includes/ssasnoversion-md.md)] data using an HTTP or HTTPS connection, [!INCLUDE [ssASnoversion](../../includes/ssasnoversion-md.md)] can take advantage of Extended Protection provided by IIS. For more information about how to configure IIS to use Extended Protection, see [Configure Extended Protection in IIS 7.5](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee909472(v=ws.10)).

## Related content

- [Server Network Configuration](../../database-engine/configure-windows/server-network-configuration.md)
- [Client Network Configuration](../../database-engine/configure-windows/client-network-configuration.md)
- [Extended Protection for Authentication Overview](/previous-versions/dotnet/netframework-3.5/dd767318(v=vs.90))
- [Integrated Windows Authentication with Extended Protection](/previous-versions/visualstudio/visual-studio-2008/dd639324(v=vs.90))

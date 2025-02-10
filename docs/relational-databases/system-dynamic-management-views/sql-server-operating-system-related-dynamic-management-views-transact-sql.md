---
title: "SQL Server Operating System Related Dynamic Management Views (Transact-SQL)"
description: Dynamic management views (DMVs) associated with SQL Server Operating System (SQLOS).
author: rwestMSFT
ms.author: randolphwest
ms.date: 01/28/2025
ms.service: sql
ms.subservice: system-objects
ms.topic: "reference"
helpviewer_keywords:
  - "operating systems [SQL Server], dynamic management objects"
  - "SQL Operating System dynamic management objects [SQL Server]"
  - "SQL OS dynamic management objects [SQL Server]"
  - "dynamic management objects [SQL Server], SQL OS"
dev_langs:
  - "TSQL"
---
# SQL Server Operating System related dynamic management views (Transact-SQL)

[!INCLUDE [SQL Server](../../includes/applies-to-version/sqlserver.md)]

This section documents dynamic management views (DMVs) that are associated with [!INCLUDE [ssNoVersion](../../includes/ssnoversion-md.md)] Operating System (SQLOS). SQLOS is responsible for managing operating system resources that are specific to [!INCLUDE [ssNoVersion](../../includes/ssnoversion-md.md)].

- [sys.dm_os_buffer_descriptors](sys-dm-os-buffer-descriptors-transact-sql.md)
- [sys.dm_os_buffer_pool_extension_configuration](sys-dm-os-buffer-pool-extension-configuration-transact-sql.md)
- [sys.dm_os_child_instances](sys-dm-os-child-instances-transact-sql.md)
- [sys.dm_os_cluster_nodes](sys-dm-os-cluster-nodes-transact-sql.md)
- [sys.dm_os_cluster_properties](sys-dm-os-cluster-properties-transact-sql.md)
- [sys.dm_os_dispatcher_pools](sys-dm-os-dispatcher-pools-transact-sql.md)
- [sys.dm_os_enumerate_fixed_drives](sys-dm-os-enumerate-fixed-drives.md)
- [sys.dm_os_host_info](sys-dm-os-host-info-transact-sql.md)
- [sys.dm_os_hosts](sys-dm-os-hosts-transact-sql.md)
- [sys.dm_os_latch_stats](sys-dm-os-latch-stats-transact-sql.md)
- [sys.dm_os_loaded_modules](sys-dm-os-loaded-modules-transact-sql.md)
- [sys.dm_os_memory_brokers](sys-dm-os-memory-brokers-transact-sql.md)
- [sys.dm_os_memory_cache_clock_hands](sys-dm-os-memory-cache-clock-hands-transact-sql.md)
- [sys.dm_os_memory_cache_counters](sys-dm-os-memory-cache-counters-transact-sql.md)
- [sys.dm_os_memory_cache_entries](sys-dm-os-memory-cache-entries-transact-sql.md)
- [sys.dm_os_memory_cache_hash_tables](sys-dm-os-memory-cache-hash-tables-transact-sql.md)
- [sys.dm_os_memory_clerks](sys-dm-os-memory-clerks-transact-sql.md)
- [sys.dm_os_memory_nodes](sys-dm-os-memory-nodes-transact-sql.md)
- [sys.dm_os_nodes](sys-dm-os-nodes-transact-sql.md)
- [sys.dm_os_performance_counters](sys-dm-os-performance-counters-transact-sql.md)
- [sys.dm_os_process_memory](sys-dm-os-process-memory-transact-sql.md)
- [sys.dm_os_schedulers](sys-dm-os-schedulers-transact-sql.md)
- [sys.dm_os_server_diagnostics_log_configurations](sys-dm-os-server-diagnostics-log-configurations.md)
- [sys.dm_os_spinlock_stats](sys-dm-os-spinlock-stats-transact-sql.md)
- [sys.dm_os_stacks](sys-dm-os-stacks-transact-sql.md)
- [sys.dm_os_sys_info](sys-dm-os-sys-info-transact-sql.md)
- [sys.dm_os_sys_memory](sys-dm-os-sys-memory-transact-sql.md)
- [sys.dm_os_tasks](sys-dm-os-tasks-transact-sql.md)
- [sys.dm_os_threads](sys-dm-os-threads-transact-sql.md)
- [sys.dm_os_virtual_address_dump](sys-dm-os-virtual-address-dump-transact-sql.md)
- [sys.dm_os_volume_stats](sys-dm-os-volume-stats-transact-sql.md)
- [sys.dm_os_wait_stats](sys-dm-os-wait-stats-transact-sql.md)
- [sys.dm_os_waiting_tasks](sys-dm-os-waiting-tasks-transact-sql.md)
- [sys.dm_os_windows_info](sys-dm-os-windows-info-transact-sql.md)
- [sys.dm_os_workers](sys-dm-os-workers-transact-sql.md)

The following [!INCLUDE [ssNoVersion](../../includes/ssnoversion-md.md)] operating system-related dynamic management views are [!INCLUDE [ssInternalOnly](../../includes/ssinternalonly-md.md)].

- `sys.dm_os_function_symbolic_name`
- `sys.dm_os_memory_allocations`
- `sys.dm_os_ring_buffers`
- `sys.dm_os_sublatches`
- `sys.dm_os_worker_local_storage`

## Related content

- [System dynamic management views](system-dynamic-management-views.md)

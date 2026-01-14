---
title: "SQL Projects Tools"
description: "This overview reviews the tooling for SQL database projects."
author: dzsquared
ms.author: drskwier
ms.reviewer: randolphwest
ms.date: 12/03/2025
ms.service: sql
ms.subservice: sql-database-projects
ms.topic: overview
ms.collection:
  - data-tools
---

# SQL projects tools

Tooling for SQL projects is available in several development environments and command line interfaces. The primary tools for SQL projects are the **SqlPackage** command line utility, **SQL Server Data Tools** (SSDT) in Visual Studio, and the **SQL Database Projects extension** for Visual Studio Code.

Tools included in this article:

- [Graphical tools](#graphical-tools)
  - [SQL Database Projects extension](../visual-studio-code-extensions/sql-database-projects/sql-database-projects-extension.md)
  - [SQL Server Data Tools](../../ssdt/sql-server-data-tools.md)
- [Command line tools](#command-line-tools)
  - [SqlPackage](../sqlpackage/sqlpackage.md)

## Graphical tools

These tools provide a graphical interface for SQL projects, a T-SQL editor, and a build and publish process.

[SQL Database Projects extension](../visual-studio-code-extensions/sql-database-projects/sql-database-projects-extension.md) is an extension for **VS Code**. This extension provides a graphical interface for SQL projects, a T-SQL editor, and a build and publish process. The extension is also available in **Azure Data Studio** with the same functionality.

[SQL Server Data Tools](../../ssdt/sql-server-data-tools.md) (SSDT) is a **Visual Studio** component that provides a graphical interface for SQL projects. SSDT provides a visual designer for tables, a T-SQL editor, and a build and publish process.

### Feature set comparison

| Feature | VS Code | SSDT (VS2022-2026) | SDK-style SSDT, preview (VS2022) |
| --- | --- | --- | --- |
| [Create new empty project](get-started.md) | Yes | Yes | Yes |
| [Create new project from existing database](tutorials/start-from-existing-database.md) | Yes | Yes | Yes |
| Open existing Microsoft.Build.Sql projects | Yes | No | Yes |
| Solution management and operations | No | Yes | Yes |
| Project run build | Yes | Yes | Yes |
| Publish project to existing server | Yes | Yes | Yes |
| Publish project to a local development instance | Yes<sup>1</sup> | Yes<sup>2</sup> | Yes<sup>2</sup> |
| Publish options/properties | Yes | Yes | Yes |
| [Target platform](concepts/target-platform.md) can be updated | Yes | Yes | Yes |
| [SQLCMD variables](concepts/sqlcmd-variables.md) | Yes | Yes | Yes |
| [Project references](concepts/database-references.md) | Yes | Yes | Yes |
| [Dacpac references](concepts/database-references.md) | Yes | Yes | Yes |
| [Package references](concepts/package-references.md) | Yes | No | No |
| Publish profile creation | Yes | Yes | Yes |
| SQL files can be added by placing in project folder | Yes | No | Yes |
| SQL files can be excluded from build | Yes | Yes | No |
| [Pre/post deployment scripts](concepts/pre-post-deployment-scripts.md) | Yes | Yes | Yes |
| New object templates | Yes<sup>3</sup> | Yes | Yes<sup>3</sup> |
| Project files can be organized into folders | Yes | Yes | Yes |
| [Schema comparison](concepts/schema-comparison.md) project to database | Yes | Yes | Yes |
| [Schema comparison](concepts/schema-comparison.md) database to project | Yes | Yes | No |
| Graphical table designer | No | Yes | Yes |
| [Code analysis](concepts/sql-code-analysis/sql-code-analysis.md) - enable/disable rules GUI | No | Yes | No |
| Project properties - build output settings | No | Yes | Yes |
| Project properties - database settings GUI | No | Yes | No |
| Project run [code analysis](concepts/sql-code-analysis/sql-code-analysis.md) | Yes | Yes | No |
| Object renaming and refactoring | No | Yes | No |
| Intellisense provided in database files from project model | No | Yes | No |

1. Local development instance is a SQL Server container.
1. Local development instance is a SQL Server LocalDB instance.
1. Limited subset of templates available

## Command line tools

[SqlPackage](../sqlpackage/sqlpackage.md) is the primary command line utility for the DacFx library, enabling automation of the database development tasks such as deploying a `.dacpac` to a database or extracting the objects of a database to a SQL project or `.dacpac`.

Custom console applications can be built using the DacFx .NET library to automate database development tasks. The [Microsoft.SqlServer.Dac](/dotnet/api/microsoft.sqlserver.dac) namespace contains classes for creating, deploying, and extracting database objects and is foundational to the rest of the DacFx library.

CI/CD pipelines can be built with command line execution or with tasks specific to `.dacpac` and SQL projects deployment. The [GitHub sql-action](https://github.com/azure/sql-action) and [SqlAzureDacpacDeployment in Azure DevOps](/azure/devops/pipelines/tasks/reference/sql-azure-dacpac-deployment-v1) are examples of tasks that use SqlPackage underneath a management layer to facilitate deploying database changes.

### Conversion tools

The process of converting an [existing SQL project to an SDK-style project](howto/convert-original-sql-project.md) is done by manually editing the `.sqlproj` file to include the new SDK-style project format. Before beginning the process, it's recommended to both back up the project file and archive a `.dacpac` of the project. By comparing a "before" and "after" `.dacpac` built from the project, you can ensure that the conversion process has correctly completed.

### Project/solution management

Multiple SQL projects (and other projects) can be logically grouped together in a solution file. The solution file is a container for one or more projects and is used to manage the projects as a group, including the build action. Large solutions can be broken down into smaller solutions to improve performance and manageability, or dynamically generated for the appropriate task at hand. The [slngen solution file generator](https://github.com/microsoft/slngen) is available for Microsoft.Build.Sql projects and can be used to create a solution file for a set of projects programmatically and on-demand.

## Third-party tools

There are third-party tools available that provide functionality related to SQL projects and database deployment. Some tools are open source, such as [dbatools](https://dbatools.io/Publish-DbaDacPackage).

Developers have shared their projects utilizing extensibility points around SQL projects, including [code analysis](concepts/sql-code-analysis/sql-code-analysis.md) rules and customizing deployment plans. Some of these projects are:

- <https://github.com/tcartwright/SqlServer.Rules>
- <https://github.com/davebally/TSQL-Smells>
- <https://github.com/ErikEJ/SqlServer.Rules>
- <https://github.com/GoEddie/DeploymentContributorFilterer>

## Related content

- [Project-Oriented Offline Database Development](../../ssdt/project-oriented-offline-database-development.md)
- [SQL Database Projects extension](/azure-data-studio/extensions/sql-database-project-extension)
- [SqlPackage](../sqlpackage/sqlpackage.md)
- [GitHub sql-action](https://github.com/azure/sql-action)
- [Azure DevOps SQL deployments](/azure/devops/pipelines/targets/azure-sqldb)
- [Data-tier applications (DAC)](../../relational-databases/data-tier-applications/data-tier-applications.md)
- [DacFx feedback repository](https://github.com/microsoft/dacfx)
- [Get started with SQL database projects](get-started.md)
- [Tutorial: Create and deploy a SQL project](tutorials/create-deploy-sql-project.md)

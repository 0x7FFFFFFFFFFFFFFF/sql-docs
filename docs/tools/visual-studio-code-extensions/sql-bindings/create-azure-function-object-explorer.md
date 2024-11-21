---
title: Create Azure Functions With the SQL Bindings Extension for Visual Studio Code Through the Object Explorer
description: Use the mssql object explorer to create Azure functions with SQL Bindings in Visual Studio Code.
author: VasuBhog
ms.author: vabhog
ms.reviewer: drskwier, maghan, randolphwest
ms.date: 11/18/2024
ms.service: sql
ms.subservice: tools-other
ms.topic: conceptual
---

# Create Azure Functions with the SQL Bindings extension for Visual Studio Code through the Object Explorer

[!INCLUDE [sql-asdb-asdbmi-asa](../../../includes/applies-to-version/sql-asdb-asdbmi-asa.md)]

## Overview

Microsoft SQL Bindings for Visual Studio Code enable users to develop Azure Functions with Azure SQL bindings, see [Create Azure Functions with the SQL Bindings extension for Visual Studio Code](create-azure-function.md). To install the extension, see [SQL Bindings extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-mssql.sql-bindings-vscode).

## From the Object Explorer

To create an Azure Function from a specific `Table` or `View` in object explorer (OE), right-click on a table or view from a connected server in SQL Server object explorer and select `Create Azure Function with SQL Binding.`

**Table OE Command**:

:::image type="content" source="media/create-azure-function-object-explorer/create-function-table-object-explorer.png" alt-text="Screenshot of object explorer context menu to add a SQL binding from Table." lightbox="media/create-azure-function-object-explorer/create-function-table-object-explorer.png":::

**View OE Command**:

:::image type="content" source="media/create-azure-function-object-explorer/create-function-view-object-explorer.png" alt-text="Screenshot of object explorer context menu to add a SQL binding from View." lightbox="media/create-azure-function-object-explorer/create-function-view-object-explorer.png":::

If you haven't yet created the Azure Function project, a Visual Studio Code prompt appears to aid in creating a new Azure Function project.

:::image type="content" source="media/create-azure-function-object-explorer/create-azure-function-project.png" alt-text="Screenshot of Visual Studio Code notification to create a new Azure Function project since none were found in folder.":::

The extension then asks you to select the folder where you want to create the Azure Function.

:::image type="content" source="media/create-azure-function-object-explorer/select-folder-to-use-for-function.png" alt-text="Screenshot of a prompt to choose folder to create Azure Function with SQL binding to.":::

If you're creating an Azure Function with SQL binding from a table, the extension prompts you to select the binding type to use, either an `Input` (Retrieves data from a database) or `Output` (Save data to a database) binding.

> [!NOTE]  
> Azure Function with SQL Binding from a `View` is only supported for `Input` bindings.

:::image type="content" source="media/create-azure-function-object-explorer/binding-type-prompt.png" alt-text="Screenshot of a prompt to select binding type.":::

The extension then prompts you to enter the function name to be used for the Azure Function.

:::image type="content" source="media/create-azure-function-object-explorer/function-name-prompt.png" alt-text="Screenshot of a prompt to enter function name.":::

If you already have connection strings stored in the local.settings.json, then the extension prompts you to select the connection string to use for the Azure Function or create a new connection string.

:::image type="content" source="media/create-azure-function-object-explorer/create-new-sql-connection-string-setting.png" alt-text="Screenshot of a prompt to select connection string setting.":::

If you select `Create new local app setting`, then the extension prompts you to enter the connection string name and value.

:::image type="content" source="media/create-azure-function-object-explorer/enter-connection-string-setting-name.png" alt-text="Screenshot of a prompt to enter connection string.":::

If you're creating the `Azure Function with SQL Binding` to an existing Azure Function project, then the extension prompts you whether you would like to include the password for the connection string in the `local.settings.json` file.

:::image type="content" source="media/create-azure-function-object-explorer/password-prompt.png" alt-text="Screenshot of a prompt to save the password to the SQL connection string.":::

If `Yes`, then the password is saved to the `local.settings.json` file. If `No` then the extension warns you that the password won't be saved to the `local.settings.json` file (shown here), and you need to manually add the password later to the `local.settings.json` file.

:::image type="content" source="media/create-azure-function-object-explorer/do-not-save-password.png" alt-text="Screenshot of a warning to add password to SQL connection string later manually.":::

The extension then prompts you to provide the namespace for the Azure Function.

:::image type="content" source="media/create-azure-function-object-explorer/namespace-for-function.png" alt-text="Screenshot of a prompt for namespace for the Azure Function.":::

If you're creating a brand new Azure Function project with SQL binding, then the extension prompts whether you would like to include the password for the connection string in the `local.settings.json` file.

A progress notification appears to indicate that the Azure Function has completed.

:::image type="content" source="media/create-azure-function-object-explorer/finished-creating-project.png" alt-text="Screenshot of an information message indicating finished creating Azure Function Project.":::

Once the Azure Function is created, the extension generates the code either for an `Input` or `Output` binding. For more information, see [Generated code for Azure functions with SQL bindings](create-azure-function.md#generated-code-for-azure-functions-with-sql-bindings).

## Related content

- [Create Azure Functions with the SQL Bindings extension for Visual Studio Code](create-azure-function.md)
- [Learn more about SQL Bindings for Azure Functions](/azure/azure-functions/functions-bindings-azure-sql)
- [Create Azure Functions with the SQL Bindings extension for Visual Studio Code through the Command Palette](create-azure-function-command-palette.md)

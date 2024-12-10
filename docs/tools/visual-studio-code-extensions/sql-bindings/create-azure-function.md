---
title: Create Azure Functions With the SQL Bindings Extension for Visual Studio Code
description: Use the SQL Bindings extension for Visual Studio Code to create Azure functions with SQL bindings.
author: VasuBhog
ms.author: vabhog
ms.reviewer: drskwier, maghan, randolphwest
ms.date: 11/18/2024
ms.service: sql
ms.subservice: vs-code-sql-extensions
ms.topic: conceptual
---

# Create Azure Functions with the SQL Bindings extension for Visual Studio Code

[!INCLUDE [SQL Server ASDB, ASDBMI, ASDW](../../../includes/applies-to-version/sql-asdb-asdbmi-asa.md)]

Azure Functions support for [SQL bindings](/azure/azure-functions/functions-bindings-azure-sql) is available in preview for input and output bindings, making connecting to an Azure SQL database or SQL Server database to Azure Functions easier. The SQL Bindings extension for Visual Studio Code facilitates the process of developing Azure Functions with SQL bindings and is automatically installed with the [mssql extension for Visual Studio Code](https://aka.ms/mssql-marketplace) extension pack. This article shows how the [SQL Bindings extension](https://marketplace.visualstudio.com/items?itemName=ms-mssql.sql-bindings-vscode) for Visual Studio Code can be used to create Azure Functions with SQL bindings.

> [!NOTE]  
> Currently, the SQL Bindings extension only supports C# Azure Functions. JavaScript and Python Azure Functions support SQL bindings but aren't supported by the SQL Bindings extension at this time.

## From the Object Explorer

To create an Azure Function from a specific `Table` or `View` in object explorer (OE), right-click on a table or view from a connected server in SQL Server object explorer and select `Create Azure Function with SQL Binding.`

**Table OE Command**:

:::image type="content" source="media/create-azure-function/create-function-table-object-explorer.png" alt-text="Screenshot of object explorer context menu to add a SQL binding from Table." lightbox="media/create-azure-function/create-function-table-object-explorer.png":::

**View OE Command**:

:::image type="content" source="media/create-azure-function/create-function-view-object-explorer.png" alt-text="Screenshot of object explorer context menu to add a SQL binding from View." lightbox="media/create-azure-function/create-function-view-object-explorer.png":::

For more information about creating an Azure function with SQL bindings from the SQL Server Object Explorer, see [Create Azure Functions with the SQL Bindings extension for Visual Studio Code through the Object Explorer](create-azure-function-object-explorer.md).

## From the Command Palette

To create a new function with a SQL binding, run the `MS SQL: Create Azure Function with SQL Binding` command from the command palette.

:::image type="content" source="media/create-azure-function/create-azure-function-using-command-palette.png" alt-text="Screenshot of Visual Studio Code command palette command `MS SQL: Create Azure Function with SQL Binding (preview)." lightbox="media/create-azure-function/create-azure-function-using-command-palette.png":::

For more information about creating an Azure function with SQL bindings from the command palette, see [Create Azure Functions with the SQL Bindings extension for Visual Studio Code through the Command Palette](create-azure-function-command-palette.md).

### In an existing Azure Function

To add a SQL binding to an existing function, open the C# Azure Function in an editor and then run the `MS SQL: Add SQL Binding` command from the command palette.

:::image type="content" source="media/create-azure-function/add-sql-binding-command-palette.png" alt-text="Screenshot of Visual Studio Code command palette command `MS SQL: Add SQL Binding (preview)." lightbox="media/create-azure-function/add-sql-binding-command-palette.png":::

For more information, see [Create Azure Functions with the SQL Bindings extension for Visual Studio Code through the Command Palette](create-azure-function-command-palette.md).

## Generated code for Azure functions with SQL bindings

**The code generated for the Azure function with SQL Input Binding:**

```csharp
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace Company.Function
{
    public static class dboEmployees
    {
        // Visit https://aka.ms/sqlbindingsinput to learn how to use this input binding
    [FunctionName("dboEmployees")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [Sql("SELECT * FROM [dbo].[Employees]",
            CommandType = System.Data.CommandType.Text,
            ConnectionStringSetting = "SqlConnectionString")] IEnumerable<Object> result,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger with SQL Input Binding function processed a request.");

            return new OkObjectResult(result);
        }
    }
}
```

**The code generated for the Azure function with SQL Output Binding:**

```csharp
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace Company.Function
{
    public static class dboEmployees
    {
        // Visit [https://aka.ms/sqlbindingsoutput] to learn how to use this output binding
        [FunctionName("dboEmployees")]
        public static CreatedResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "addtodoitem")] HttpRequest req,
            [Sql("[dbo].[Test2]", ConnectionStringSetting = "NewSQLConnectionString")] out ToDoItem output,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger with SQL Output Binding function processed a request.");

            output = new ToDoItem
            {
                Id = "1",
                Priority = 1,
                Description = "Hello World"
            };

            return new CreatedResult($"/api/addtodoitem", output);
        }
    }

    public class ToDoItem
    {
        public string Id { get; set; }
        public int Priority { get; set; }
        public string Description { get; set; }
    }
}
```

## Related content

- [Install the SQL Bindings extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-mssql.sql-bindings-vscode)
- [Learn more about SQL Bindings for Azure Functions](/azure/azure-functions/functions-bindings-azure-sql)
- [Create Azure Functions with the SQL Bindings extension for Visual Studio Code through the Object Explorer](create-azure-function-object-explorer.md)
- [Create Azure Functions with the SQL Bindings extension for Visual Studio Code through the Command Palette](create-azure-function-command-palette.md)

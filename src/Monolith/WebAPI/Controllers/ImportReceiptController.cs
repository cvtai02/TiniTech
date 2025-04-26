using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Controllers.Base;

namespace WebAPI.Controllers;

[Route("api/import-receipts")]
public class ImportReceiptController : ApiController

{
    private readonly ILogger<CategoryController> _logger;

    public ImportReceiptController(ILogger<CategoryController> logger, ISender sender) : base(sender)
    {
        _logger = logger;
    }

    // GET: api/import-receipts
    [HttpGet]
    public async Task<IActionResult> GetImportReceipts()
    {
        var receipts = await Sender.Send(new Application.Inventory.Queries.GetListQuery());
        return Ok(receipts);
    }

    [HttpPost]
    public async Task<IActionResult> CreateImportReceipt([FromBody] Application.Inventory.Commands.CreateImportReceiptCommand command)
    {
        var result = await Sender.Send(command);
        return CreatedAtAction(nameof(GetImportReceipts), new { code = result }, result);
    }


}

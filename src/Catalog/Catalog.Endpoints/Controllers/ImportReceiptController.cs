using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Catalog.EndPoints.Controllers;

[Route("api/import-receipts")]
[Authorize(Roles = "Admin")]
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
        var receipts = await Sender.Send(new Catalog.Application.Inventory.Queries.GetListQuery());
        return Ok(receipts);
    }

    [HttpPost]
    public async Task<IActionResult> CreateImportReceipt([FromBody] Catalog.Application.Inventory.Commands.CreateImportReceiptCommand command)
    {
        var result = await Sender.Send(command);
        return CreatedAtAction(nameof(GetImportReceipts), new { code = result }, result);
    }


}

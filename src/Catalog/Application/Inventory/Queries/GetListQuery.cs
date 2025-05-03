using Catalog.Application.Common.Abstraction;
using Catalog.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebSharedModels.Dtos.Inventory;

namespace Catalog.Application.Inventory.Queries;

public class GetListQuery : IRequest<Result<List<ImportReceiptDto>>>
{
}

public class GetListQueryHandler : IRequestHandler<GetListQuery, Result<List<ImportReceiptDto>>>
{
    private readonly DbContextAbstract _context;

    public GetListQueryHandler(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<Result<List<ImportReceiptDto>>> Handle(GetListQuery request, CancellationToken cancellationToken)
    {
        var receipts = await _context.ImportReceipts
            .Select(receipt => receipt.ToReceiptDto())
            .ToListAsync(cancellationToken);

        return receipts;
    }
}

public static class ImportReceiptDtoExtensions
{
    public static ImportReceiptDto ToReceiptDto(this ImportReceipt receipt)
    {
        return new ImportReceiptDto
        {
            Code = receipt.Code,
            ReceiptDate = receipt.ReceiptDate,
            Supplier = receipt.Supplier,
            Note = receipt.Note,
            Items = [.. receipt.Items.Select(item => new ImportReceiptItemDto
            {
                ProductId = item.ProductId,
                VariantId = item.VariantId,
                Quantity = item.Quantity,
                UnitCost = item.UnitCost,
                Note = item.Note
            })]
        };
    }
}
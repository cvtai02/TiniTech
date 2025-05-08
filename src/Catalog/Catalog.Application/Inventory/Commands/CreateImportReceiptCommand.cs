using Catalog.Application.Common.Abstraction;
using Catalog.Domain.Entities;
using CrossCutting.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebSharedModels.Dtos.Inventory;

namespace Catalog.Application.Inventory.Commands;

public class CreateImportReceiptCommand : ImportReceiptDto, IRequest<Result<string>>
{
    public CreateImportReceiptCommand(ImportReceiptDto dto)
    {
        Code = dto.Code;
        ReceiptDate = dto.ReceiptDate;
        Supplier = dto.Supplier;
        Note = dto.Note;
        Items = dto.Items;
    }
    public ImportReceipt ToEntity()
    {
        return new ImportReceipt
        {
            Code = Code,
            ReceiptDate = ReceiptDate,
            Supplier = Supplier,
            Note = Note,
            Items = [.. Items.Select(i => new ImportReceiptItem
            {
                Sku = i.Sku,
                Quantity = i.Quantity,
                UnitCost = i.UnitCost,
            })]
        };
    }

}






public class CreateImportReceiptCommandHandler : IRequestHandler<CreateImportReceiptCommand, Result<string>>
{
    private readonly DbContextAbstract _context;

    public CreateImportReceiptCommandHandler(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<Result<string>> Handle(CreateImportReceiptCommand request, CancellationToken cancellationToken)
    {
        var importReceipt = request.ToEntity();
        _context.ImportReceipts.Add(importReceipt);

        foreach (var item in request.Items)
        {
            if (item.VariantId != 0)
            {
                var variant = await _context.Variants.Include(x => x.Metric).FirstOrDefaultAsync(x => x.Id == item.VariantId, cancellationToken);
                if (variant == null)
                {
                    return new NotFoundException($"Variant with ID {item.VariantId} not found.");
                }
                variant.Metric.Stock += item.Quantity;
            }
            else
            {
                var product = await _context.Products.Include(x => x.Metric).FirstOrDefaultAsync(x => x.Id == item.ProductId, cancellationToken);
                if (product == null)
                {
                    return new NotFoundException($"Product with SKU {item.Sku} not found.");
                }
                product.Metric.Stock += item.Quantity;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        return importReceipt.Code;
    }
}

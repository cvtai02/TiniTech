using Catalog.Application.Common.Abstraction;
using Catalog.Domain.Entities;
using MediatR;
using WebSharedModels.Dtos.Inventory;

namespace Catalog.Application.Inventory.Commands;

public class CreateImportReceiptCommand : IRequest<Result<string>>
{
    public string Code { get; set; } = string.Empty;
    public DateTime ReceiptDate { get; set; }
    public string SupplierId { get; set; } = string.Empty;
    public string? Note { get; set; } = null;
    public List<ImportReceiptItemDto> Items { get; set; } = [];

    public ImportReceipt ToEntity()
    {
        return new ImportReceipt
        {
            Code = Code,
            ReceiptDate = ReceiptDate,
            Supplier = SupplierId,
            Note = Note,
            Items = [.. Items.Select(i => new ImportReceiptItem
            {
                ProductId = i.ProductId,
                VariantId = i.VariantId,
                Quantity = i.Quantity,
                UnitCost = i.UnitCost,
                Note = i.Note
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
        await _context.ImportReceipts.AddAsync(importReceipt, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return importReceipt.Code;
    }
}
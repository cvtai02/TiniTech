using Catalog.Application.Common.Abstraction;
using Catalog.Domain.Entities;
using MediatR;
using WebSharedModels.Dtos.Inventory;

namespace Catalog.Application.Inventory.Commands;

public class CreateImportReceiptCommand : ImportReceiptDto, IRequest<Result<string>>
{
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
        await _context.ImportReceipts.AddAsync(importReceipt, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return importReceipt.Code;
    }
}
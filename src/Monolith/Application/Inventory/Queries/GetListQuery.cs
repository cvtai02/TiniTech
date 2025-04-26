using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Abstraction;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SharedViewModels.Inventory;

namespace Application.Inventory.Queries;

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
            .Select(receipt => ImportReceiptDto.FromEntity(receipt))
            .ToListAsync(cancellationToken);

        return receipts;
    }
}


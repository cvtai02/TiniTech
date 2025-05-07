using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Catalog.Application.Common.Abstraction;
using Catalog.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebSharedModels.Dtos.Products;

namespace Catalog.Application.Products.Queries.GetBySku;

public class GetBySkuQuery : IRequest<Result<List<ProductBySkuDto>>>
{
    public string Sku { get; set; } = string.Empty;
}

public class GetBySkuQueryHandler : IRequestHandler<GetBySkuQuery, Result<List<ProductBySkuDto>>>
{
    private readonly DbContextAbstract _context;

    public GetBySkuQueryHandler(DbContextAbstract context)
    {
        _context = context;
    }

    private static string ToIdentityName(Product p)
    {
        var name = p.Name;
        var attributes = p.Variants.SelectMany(v => v.VariantAttributes).ToList();

        // concate all variant attributes to the name
        foreach (var attribute in attributes)
        {
            name += $" - {attribute.Value}";
        }

        return name;
    }

    public async Task<Result<List<ProductBySkuDto>>> Handle(GetBySkuQuery request, CancellationToken cancellationToken)
    {


        var products = await _context.Products
            .Include(p => p.Variants)
            .Where(p => p.Sku == request.Sku)
            .Select(p => new ProductBySkuDto
            {
                Sku = p.Sku,
                Name = p.Name,
                ImageUrl = p.ImageUrl,
                IdentityName = ToIdentityName(p),
            })
            .ToListAsync(cancellationToken);

        return products;
    }
}

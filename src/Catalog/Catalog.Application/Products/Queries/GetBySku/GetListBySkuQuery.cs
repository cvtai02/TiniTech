using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Catalog.Application.Common.Abstraction;
using Catalog.Domain.Entities;
using CrossCutting.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebSharedModels.Dtos.Inventory;

namespace Catalog.Application.Products.Queries.GetBySku;

public class GetListBySkuQuery : IRequest<Result<List<SkuItem>>>
{
    public string Sku { get; set; } = string.Empty;
}

public class GetBySkuQueryHandler : IRequestHandler<GetListBySkuQuery, Result<List<SkuItem>>>
{
    private readonly DbContextAbstract _context;

    public GetBySkuQueryHandler(DbContextAbstract context)
    {
        _context = context;
    }

    private static string ToIdentityName(Variant v)
    {
        var name = v.Product.Name;
        var values = v.VariantAttributes.SelectMany(v => v.Value).ToList();

        // concate all variant attributes to the name
        foreach (var value in values)
        {
            name += $" - {value}";
        }

        return name;
    }

    public async Task<Result<List<SkuItem>>> Handle(GetListBySkuQuery request, CancellationToken cancellationToken)
    {



        var variants = await _context.Variants
            .Where(v => v.Sku.Contains(request.Sku) && v.IsDeleted == false)
            .Include(v => v.Product)
            .Skip(0)
            .Take(10)
            .OrderBy(v => v.Product.Name)
            .Select(v => new SkuItem
            {
                ProductId = v.ProductId,
                VariantId = v.Id,
                Sku = v.Sku,
                Name = v.Product.Name,
                ImageUrl = v.Product.ImageUrl,
                IdentityName = ToIdentityName(v),
            })
            .ToListAsync(cancellationToken);

        var products = await _context.Products
        .Where(p => p.Sku.Contains(request.Sku))
        .Skip(0)
        .Take(10)
        .Select(p => new SkuItem
        {
            ProductId = p.Id,
            Sku = p.Sku,
            Name = p.Name,
            ImageUrl = p.ImageUrl,
            IdentityName = p.Name,
        })
        .ToListAsync(cancellationToken);

        if (variants.Count > 0)
        {
            products.AddRange(variants);
        }
        else if (products.Count == 0)
        {
            return new NotFoundException("No products found with the given SKU");
        }


        return products;
    }
}

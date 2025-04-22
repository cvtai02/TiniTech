using Application.Common.Abstraction;
using Application.Common.Models;
using Application.Products.Queries.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Application.Products.Queries.GetDetailBySlug;

public class GetProductDetailBySlug : IRequest<Result<ProductDetailDto>>
{
    public string Slug { get; set; } = null!;
}

public class GetProductDetailBySlugHandler : IRequestHandler<GetProductDetailBySlug, Result<ProductDetailDto>>
{
    private readonly DbContextAbstract _context;

    public GetProductDetailBySlugHandler(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<Result<ProductDetailDto>> Handle(GetProductDetailBySlug request, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .Include(p => p.Metric)
            .Include(p => p.Images)
            .Include(p => p.Variants)
                .ThenInclude(v => v.VariantAttributes)
            .Include(p => p.Variants)
                .ThenInclude(v => v.Metric)
            .Include(p => p.Attributes)
                .ThenInclude(a => a.Attribute)
            .FirstOrDefaultAsync(p => p.Slug == request.Slug, cancellationToken);

        if (product == null) return new KeyNotFoundException($"Product with slug {request.Slug} not found.");

        var productDetail = ProductDetailDto.FromProduct(product);

        return productDetail;

    }
}
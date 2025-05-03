using Catalog.Application.Common.Abstraction;
using Catalog.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebSharedModels.Dtos.Products;

namespace Catalog.Application.Products.Queries.GetDetailBySlug;

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
            .Include(p => p.Variants.Where(v => v.IsDeleted == false))
                .ThenInclude(v => v.VariantAttributes)
            .Include(p => p.Variants)
                .ThenInclude(v => v.Metric)
            .Include(p => p.Attributes)
                .ThenInclude(a => a.Attribute)

            .Include(p => p.Attributes)
                .ThenInclude(a => a.ProductAttributeValues)
            .FirstOrDefaultAsync(p => p.Slug == request.Slug, cancellationToken);

        if (product == null) return new KeyNotFoundException($"Product with slug {request.Slug} not found.");

        var productDetail = product.ToDetailDto();

        return productDetail;

    }
}

public static class ProductDetailDtoExtensions
{
    public static ProductDetailDto ToDetailDto(this Product product)
    {
        return new ProductDetailDto
        {
            Id = product.Id,
            Slug = product.Slug,
            Name = product.Name,
            Sku = product.Sku,
            Status = product.Status,
            DefaultImageUrl = product.ImageUrl,
            Price = product.Metric.LowestPrice,
            CategoryId = product.CategoryId,
            FeaturedPoint = product.Metric.FeaturedPoint,
            Description = product.Description,
            Images = [.. product.Images.Select(i => new ProductImageDto
            {
                Id = i.Id,
                ImageUrl = i.ImageUrl,
                OrderPriority = i.OrderPriority
            })],
            Rating = product.Metric.RatingAvg,
            RatingCount = product.Metric.RatingCount,
            Stock = product.Metric.Stock,
            Sold = product.Metric.Sold,
            Attributes = [.. product.Attributes.Select(a => new AttributeDto
            {
                AttributeId = a.AttributeId,
                Name = a.Attribute.Name,
                OrderPriority = a.OrderPriority,
                IsPrimary = a.IsPrimary,
                Values = [.. a.ProductAttributeValues.Select(v => new AttributeValueDto
                {
                    OrderPriority = v.OrderPriority,
                    Value = v.Value,
                    ImageUrl = v.ImageUrl
                })]
            })],

            Variants = [.. product.Variants.Select(v => new VariantDto
            {
                Id = v.Id,
                ProductId = v.ProductId,
                Price = v.Price,
                IsDeleted = v.IsDeleted,
                Sku = v.Sku,
                Stock = v.Metric?.Stock ?? 0,
                Sold = v.Metric?.Sold ?? 0,
                VariantAttributes = [.. v.VariantAttributes.Select(va => new VariantAttributeDto
                {
                    AttributeId = va.AttributeId,
                    Value = va.Value
                })]
            })]
        };
    }
}
using Domain.Entities;

namespace Application.Products.Queries.Dtos;

public class ProductDetailDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = null!;
    public string Name { get; set; } = null!;
    public int Price { get; set; }
    public string Sku { get; set; } = null!;
    public int CategoryId { get; set; }
    public string Description { get; set; } = null!;
    public List<ProductImageDto> Images { get; set; } = [];
    public float Rating { get; set; }
    public int RatingCount { get; set; }
    public int Stock { get; set; }
    public int Sold { get; set; }
    public int FeaturedPoint { get; set; }
    public List<AttributeDto> Attributes { get; set; } = [];
    public List<VariantDto> Variants { get; set; } = [];

    public static ProductDetailDto FromProduct(Product product)
    {
        return new ProductDetailDto
        {
            Id = product.Id,
            Slug = product.Slug,
            Name = product.Name,
            Sku = product.Sku,
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
                Price = v.Price,
                Sku = v.Sku,
                Stock = v.Metric.Stock,
                VariantAttributes = [.. v.VariantAttributes.Select(va => new VariantAttributeDto
                {
                    AttributeId = va.AttributeId,
                    Value = va.Value
                })]
            })]
        };
    }
}

public class VariantDto
{
    public int Price { get; set; }
    public string Sku { get; set; } = null!;
    public int Stock { get; set; }
    public List<VariantAttributeDto> VariantAttributes { get; set; } = [];
}

public class VariantAttributeDto
{
    public int AttributeId { get; set; }
    public string Value { get; set; } = null!;
}

public class AttributeValueDto
{
    public float OrderPriority { get; set; }
    public string Value { get; set; } = null!;
    public string? ImageUrl { get; set; }
}

public class AttributeDto
{
    public int AttributeId { get; set; }
    public string Name { get; set; } = null!;
    public float OrderPriority { get; set; }
    public bool IsPrimary { get; set; }
    public List<AttributeValueDto> Values { get; set; } = [];
}

public class ProductImageDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = null!;
    public float OrderPriority { get; set; }
}
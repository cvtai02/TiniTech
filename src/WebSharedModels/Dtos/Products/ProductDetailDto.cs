using SharedKernel.Enums;
using WebSharedModels.Dtos.Attributes;

namespace WebSharedModels.Dtos.Products;


public class ProductDetailDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = null!;
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public string Sku { get; set; } = null!;
    public ProductStatus Status { get; set; }
    public string DefaultImageUrl { get; set; } = null!;
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
}

public class VariantDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public decimal Price { get; set; }
    public bool IsDeleted { get; set; }
    public string Sku { get; set; } = null!;
    public int Stock { get; set; }
    public int Sold { get; set; }
    public List<VariantAttributeDto> VariantAttributes { get; set; } = [];
}

public class VariantAttributeDto
{
    public int AttributeId { get; set; }
    public string Value { get; set; } = null!;
}


public class ProductImageDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = null!;
    public float OrderPriority { get; set; }
}
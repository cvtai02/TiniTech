using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Products.Queries.Dtos;

public class ProductDetail
{
    public int Id { get; set; }
    public string Slug { get; set; } = null!;
    public string Name { get; set; } = null!;
    public int Price { get; set; }
    public int CategoryId { get; set; }
    public string Description { get; set; } = null!;
    public List<string> ImageUrls { get; set; } = [];
    public float Rating { get; set; }
    public int RatingCount { get; set; }
    public int Stock { get; set; }
    public int Sold { get; set; }
    public List<AttributeDto> Attributes { get; set; } = [];
    public List<VariantDto> Variants { get; set; } = [];
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
    public string Name { get; set; } = null!;
    public string Value { get; set; } = null!;
}

public class AttributeValueDto
{
    public int OrderPriority { get; set; }
    public string Value { get; set; } = null!;
    public string? ImageUrl { get; set; }
}

public class AttributeDto
{
    public string Name { get; set; } = null!;
    public float OrderPriority { get; set; }
    public bool IsPrimary { get; set; }
    public List<AttributeValueDto> Values { get; set; } = [];
}
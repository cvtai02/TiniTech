using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Enums;

namespace SharedViewModels.Products;

public class ProductBriefDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Sku { get; set; } = null!;
    public int Price { get; set; }
    public int FeaturedPoint { get; set; }
    public ProductStatus Status { get; set; } = ProductStatus.Active;
    public string ImageUrl { get; set; } = null!;
    public float Rating { get; set; }
    public int RatingCount { get; set; }
    public int Stock { get; set; }
    public int Sold { get; set; }

    public static ProductBriefDto FromProduct(Domain.Entities.Product product)
    {
        return new ProductBriefDto
        {
            Id = product.Id,
            Slug = product.Slug,
            Name = product.Name,
            Sku = product.Sku,
            Price = product.Metric.LowestPrice,
            FeaturedPoint = product.Metric.FeaturedPoint,
            Status = product.Status,
            ImageUrl = product.ImageUrl,
            Rating = product.Metric.RatingAvg,
            RatingCount = product.Metric.RatingCount,
            Stock = product.Metric.Stock,
            Sold = product.Metric.Sold
        };
    }
}

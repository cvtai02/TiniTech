using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Enums;

namespace Application.Products.Queries.Dtos;

public class ProductBriefDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = null!;
    public string Name { get; set; } = null!;
    public int Price { get; set; }
    public ProductStatus Status { get; set; } = ProductStatus.Active;
    public string ImageUrl { get; set; } = null!;
    public float Rating { get; set; }
    public int RatingCount { get; set; }
    public int Stock { get; set; }
    public int Sold { get; set; }
}

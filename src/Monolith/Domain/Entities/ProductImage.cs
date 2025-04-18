using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;

namespace Domain.Entities;

public class ProductImage : BaseEntity
{
    public string ProductSlug { get; set; } = null!;
    public int Priority { get; set; }
    public string ImageUrl { get; set; } = null!;
    public Product? Product { get; set; } = null!;
}
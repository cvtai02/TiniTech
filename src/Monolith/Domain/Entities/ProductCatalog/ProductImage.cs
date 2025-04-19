using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;

namespace Domain.Entities;

public class ProductImage : BaseEntity
{
    public int ProductId { get; set; }
    public float OrderPriority { get; set; }
    public string ImageUrl { get; set; } = null!;
    public Product? Product { get; set; } = null!;
}
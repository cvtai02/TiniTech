using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;
using Domain.Entities;

namespace Domain.Entities;

public class Product : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string Slug { get; set; } = null!;
    public Category? Category { get; set; }
    public virtual IList<ProductVariant> ProductVariants { get; set; } = [];
}

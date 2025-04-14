using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;

namespace Domain.Entities;

public class ProductVariant : BaseEntity
{
    public int ProductId { get; set; }
    public int Price { get; set; }
    public string SKU { get; set; } = null!;
    public Product? Product { get; set; } = null!;
    public virtual ICollection<VariantPrimaryAttribute> VariantPrimaryAttributes { get; set; } = [];
    public virtual ICollection<VariantAttribute> VariantAttributes { get; set; } = [];
}


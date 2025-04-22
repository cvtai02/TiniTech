using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;

namespace Domain.Entities;

public class Variant : BaseAuditableEntity
{
    public int ProductId { get; set; }
    public int Price { get; set; }
    public string Sku { get; set; } = null!;
    public Product Product { get; set; } = null!;
    public virtual ICollection<VariantAttribute> VariantAttributes { get; set; } = [];
    public VariantMetric Metric { get; set; } = null!;
}


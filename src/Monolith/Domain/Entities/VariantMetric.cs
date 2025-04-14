using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;

namespace Domain.Entities;

public class VariantMetric : BaseEntity
{
    public int ProductVariantId { get; set; }
    public int Stock { get; set; }
    public int Sold { get; set; }

    public ProductVariant? ProductVariant { get; set; } = null!;
}

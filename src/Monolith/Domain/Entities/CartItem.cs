using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;

namespace Domain.Entities;

public class CartItem : BaseAuditableEntity
{
    public string UserId { get; set; } = null!;
    public int ProductVariantId { get; set; }
    public int Quantity { get; set; }
    public ProductVariant? ProductVariant { get; set; } = null!;
}

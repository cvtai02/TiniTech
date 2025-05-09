using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Contracts.Purchase;

public class OrderItem
{
    public int ProductId { get; set; } = 0;
    public int? VariantId { get; set; } = 0;
    public int Quantity { get; set; } = 0;
    public decimal Price { get; set; } = 0;
}
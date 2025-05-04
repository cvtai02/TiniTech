using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebSharedModels.Dtos.Orders;


public class CreateOrderItemDto
{
    public int ProductId { get; set; }
    public int? VariantId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }   // use for double checking
}
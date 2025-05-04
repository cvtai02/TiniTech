using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebSharedModels.Dtos.Orders;

public class OrderDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = null!;
    public string ShippingAddress { get; set; } = null!;
    public string BillingAddress { get; set; } = null!;
    public decimal TotalAmount { get; set; }
    public DateTime OrderDate { get; set; }
    public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Contracts.Purchase.Events;

public class OrderCreated
{
    public int OrderId { get; set; } = 0;
    public string? UserId { get; set; } = string.Empty;
    public List<OrderItem> Items { get; set; } = [];
}

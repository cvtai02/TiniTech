using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;
using Domain.Constants;
using Domain.ValueObjects;

namespace Domain.Entities;

public class Order : BaseAuditableEntity
{
    public string UserId { get; set; } = null!;
    public Address ShippingAddress { get; set; } = null!;
    public string OrderNumber { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string Notes { get; set; } = String.Empty;
    public int ItemsPrice { get; set; }
    public int ShippingPrice { get; set; }
    public int Discount { get; set; }
    public string TotalCost { get; set; } = null!;
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new HashSet<OrderItem>();
}

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
    public decimal ItemsPrice { get; set; }
    public decimal ShippingPrice { get; set; }
    public decimal Discount { get; set; }
    public decimal TotalCost { get; set; }
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new HashSet<OrderItem>();
}

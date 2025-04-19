using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;
using Domain.ValueObjects;

namespace Domain.Entities;

public class Shipping : BaseEntity
{
    public int OrderId { get; set; }
    public int ShippingServiceId { get; set; }
    public Address To { get; set; } = null!;
    public Address From { get; set; } = null!;
    public string TrackingCode { get; set; } = null!;
}

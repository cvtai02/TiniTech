using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;

namespace Domain.Entities;

public class Payment : BaseAuditableEntity
{
    public string UserId { get; set; } = null!;
    public int OrderId { get; set; }
    public int PaymentServiceId { get; set; }
    public int Amount { get; set; }
    public string Status { get; set; } = null!;
}

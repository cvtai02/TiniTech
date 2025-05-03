using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;
using Domain.ValueObjects;

namespace Domain.Entities;

public class Payment : BaseAuditableEntity
{
    public string UserId { get; set; } = null!;
    public int OrderId { get; set; }
    public int PaymentGatewayId { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = null!;
    public string TransactionId { get; set; } = null!;
    public PaymentGateway PaymentGateway { get; set; } = null!;
}

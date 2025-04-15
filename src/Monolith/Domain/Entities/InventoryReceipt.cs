using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Permissions;
using System.Threading.Tasks;
using Domain.Base;

namespace Domain.Entities;

public class InventoryReceipt : BaseAuditableEntity
{
    public int Code { get; set; }
    public string Supplier { get; set; } = null!;
    public int TotalCost { get; set; }
    public string Note { get; set; } = null!;
}

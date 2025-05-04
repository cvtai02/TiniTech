using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using SharedKernel.Base;

namespace Purchase.Core.Entities;

public class StockItem : BaseAuditableEntity
{
    [NotMapped]
    public new int Id { get; set; }
    public int ProductId { get; set; }
    public int? VariantId { get; set; }
    public int Quantity { get; set; }
    public int Price { get; set; }

}

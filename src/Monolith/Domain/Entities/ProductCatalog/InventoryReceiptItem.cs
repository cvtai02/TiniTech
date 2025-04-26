using System.Runtime.CompilerServices;
using Domain.Base;

namespace Domain.Entities;

public class ImportReceiptItem : BaseEntity
{
    public int ImportReceiptId { get; set; }
    public int ProductId { get; set; } //index this
    public int? VariantId { get; set; } //index this
    public int Quantity { get; set; }
    public decimal UnitCost { get; set; }
    public string? Note { get; set; } = null!;
    public decimal TotalCost => Quantity * UnitCost;
    public ImportReceipt? InventoryReceipt { get; set; } = null!;

}

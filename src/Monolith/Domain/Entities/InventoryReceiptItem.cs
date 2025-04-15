using System.Runtime.CompilerServices;
using Domain.Base;

namespace Domain.Entities;

public class InventoryReceiptItem : BaseEntity
{
    public int InventoryReceiptId { get; set; }
    public int ProductVariantId { get; set; } //index this
    public int Quantity { get; set; }
    public int UnitCost { get; set; }
    public int TotalCost => Quantity * UnitCost;
    public InventoryReceipt? InventoryReceipt { get; set; } = null!;

}

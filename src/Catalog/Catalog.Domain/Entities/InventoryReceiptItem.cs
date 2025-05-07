namespace Catalog.Domain.Entities;

public class ImportReceiptItem : BaseEntity
{
    public int ImportReceiptId { get; set; }
    public string Sku { get; set; } = null!;
    public int Quantity { get; set; }
    public decimal UnitCost { get; set; }
    public decimal TotalCost => Quantity * UnitCost;
    public ImportReceipt? InventoryReceipt { get; set; } = null!;

}

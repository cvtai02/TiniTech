namespace WebSharedModels.Dtos.Inventory;

public class ImportReceiptDto
{
    public string Code { get; set; } = string.Empty;
    public DateTime ReceiptDate { get; set; }
    public string? Supplier { get; set; } = string.Empty;
    public string? Note { get; set; } = null;
    public List<ImportReceiptItemDto> Items { get; set; } = new List<ImportReceiptItemDto>();
    public decimal TotalCost => Items.Sum(item => item.Quantity * item.UnitCost);


}

public class ImportReceiptItemDto
{
    public string Sku { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitCost { get; set; }
    public string? Note { get; set; } = null;
}
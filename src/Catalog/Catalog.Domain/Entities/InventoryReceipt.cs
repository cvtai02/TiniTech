using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Catalog.Domain.Entities;

public class ImportReceipt : BaseAuditableEntity
{
    public new int Id { get; set; }
    public string Code { get; set; } = null!;
    public string? Supplier { get; set; }
    public decimal TotalCost => Items.Sum(item => item.Quantity * item.UnitCost);
    public string? Note { get; set; } = null!;
    public DateTime ReceiptDate { get; set; }
    public List<ImportReceiptItem> Items { get; set; } = [];

}

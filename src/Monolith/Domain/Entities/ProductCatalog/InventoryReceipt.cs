using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Base;

namespace Domain.Entities;

public class ImportReceipt : BaseAuditableEntity
{
    [NotMapped]
    public new int Id { get; set; }
    [Key]
    public string Code { get; set; } = null!;
    public string? Supplier { get; set; }
    public decimal TotalCost { get; set; }
    public string? Note { get; set; } = null!;
    public DateTime ReceiptDate { get; set; }
    public List<ImportReceiptItem> Items { get; set; } = [];

}

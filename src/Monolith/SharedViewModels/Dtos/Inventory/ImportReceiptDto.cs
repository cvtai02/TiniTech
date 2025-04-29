using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;

namespace SharedViewModels.Inventory;



public class ImportReceiptDto
{
    public string Code { get; set; } = string.Empty;
    public DateTime ReceiptDate { get; set; }
    public string? Supplier { get; set; } = string.Empty;
    public string? Note { get; set; } = null;
    public List<ImportReceiptItemDto> Items { get; set; } = new List<ImportReceiptItemDto>();

    public decimal TotalCost => Items.Sum(item => item.Quantity * item.UnitCost);

    public static ImportReceiptDto FromEntity(ImportReceipt receipt)
    {
        return new ImportReceiptDto
        {
            Code = receipt.Code,
            ReceiptDate = receipt.ReceiptDate,
            Supplier = receipt.Supplier,
            Note = receipt.Note,
            Items = [.. receipt.Items.Select(item => new ImportReceiptItemDto
            {
                ProductId = item.ProductId,
                VariantId = item.VariantId,
                Quantity = item.Quantity,
                UnitCost = item.UnitCost,
                Note = item.Note
            })]
        };
    }
}

public class ImportReceiptItemDto
{
    public int ProductId { get; set; }
    public int? VariantId { get; set; } = null;
    public int Quantity { get; set; }
    public decimal UnitCost { get; set; }
    public string? Note { get; set; } = null;
}
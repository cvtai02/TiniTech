using SharedKernel.Base;

namespace Purchase.Core.Entities;

public class CartItem : BaseAuditableEntity
{
    public int ProductId { get; set; }
    public int? VariantId { get; set; }
    public int Quantity { get; set; }
    public StockItem StockItem { get; set; } = null!;
}

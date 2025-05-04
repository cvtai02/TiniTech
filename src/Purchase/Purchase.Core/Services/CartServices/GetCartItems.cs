using Microsoft.EntityFrameworkCore;
using Purchase.Core.Abstraction;
using Purchase.Core.Mapping;
using WebSharedModels.Dtos.Orders;

namespace Purchase.Core.Services.CartServices;

public class GetCartItems
{
    private readonly DbContextAbstract _context;

    public GetCartItems(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<List<OrderItemDto>> Handle()
    {
        var cartItems = await _context.CartItems
            .Include(x => x.StockItem)
            .ToListAsync();

        return [.. cartItems.Select(x => x.ToOrderItemDto())];
    }
}

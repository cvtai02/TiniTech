using Microsoft.EntityFrameworkCore;
using Purchase.Core.Abstraction;
using Purchase.Core.Entities;

namespace Purchase.Core.Services.OrderServices;

public class GetUserOrders
{
    private readonly DbContextAbstract _context;

    public GetUserOrders(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<List<Order>> Handle(string userId, int page, int pageSize)
    {
        var orders = await _context.Orders
            .AsNoTracking()
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.Created)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return orders;
    }
}

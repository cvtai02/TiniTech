using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Contracts.Purchase.Interfaces;
using Microsoft.EntityFrameworkCore;
using Purchase.Core.Abstraction;

namespace Purchase.Core.ContractsImp;

public class CheckUserProductPurchase : ICheckUserProductPurchase
{
    private readonly DbContextAbstract _dbContext;

    public CheckUserProductPurchase(DbContextAbstract dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DateTimeOffset?> GetUserProductPurchaseDate(string userId, int productId)
    {

        var x = await _dbContext.Orders
            .Include(o => o.OrderItems)
            .Where(o => o.OrderItems.Any(oi => oi.ProductId == productId) && o.UserId == userId)
            .OrderByDescending(o => o.Created)
            .Select(o => o.Created)
            .FirstOrDefaultAsync();

        return x != default ? x : null;
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Purchase.Core.Abstraction;
using Purchase.Core.Entities;
using Purchase.Core.Services.OrderServices.Dtos;
using SharedKernel.Enums;

namespace Purchase.Core.Services.OrderServices;

public class GetOrders
{
    private readonly DbContextAbstract _context;

    public GetOrders(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<List<Order>> Handle(GetOrdersQuery query)
    {
        var orders = await _context.Orders
            .Where(o => query.OrderStatus == null || o.Status == query.OrderStatus)
            .OrderByDescending(o => o.Created)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .AsNoTracking()
            .ToListAsync();

        return orders;
    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Purchase.Core.Abstraction;
using Purchase.Core.Extensions;
using SharedKernel.Interfaces;
using WebSharedModels.Dtos.Orders;

namespace Purchase.Core.Services.Queries.CartQueries;

public class GetCartItems
{
    private readonly DbContextAbstract _context;
    private readonly IUser _user;

    public GetCartItems(DbContextAbstract context, IUser user)
    {
        _context = context;
        _user = user;
    }

    public async Task<List<OrderItemDto>> Handle()
    {
        var cartItems = await _context.CartItems
            .Where(x => x.CreatedBy == _user.Id)
            .ToListAsync();

        return [.. cartItems.Select(x => x.ToOrderItemDto())];
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Purchase.Core.Abstraction;
using SharedKernel.Interfaces;

namespace Purchase.Core.Services.CartServices;

public class UpdateCartItemQuantityAsync
{
    private readonly DbContextAbstract _context;
    private readonly IUser _user;

    public UpdateCartItemQuantityAsync(DbContextAbstract context, IUser user)
    {
        _context = context;
        _user = user;
    }

    public async Task Handle(int productId, int? variantId, int quantity)
    {
        if (quantity <= 0)
        {
            quantity = 0;
        }

        var cartItem = await _context.CartItems
            .Where(x => x.CreatedBy == _user.Id && x.ProductId == productId && x.VariantId == variantId)
            .FirstOrDefaultAsync();

        if (cartItem != null)
        {
            cartItem.Quantity = quantity;
            await _context.SaveChangesAsync();
        }
    }
}

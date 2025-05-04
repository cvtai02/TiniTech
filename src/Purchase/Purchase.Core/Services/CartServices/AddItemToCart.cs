using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Purchase.Core.Abstraction;
using Purchase.Core.Entities;
using SharedKernel.Interfaces;
using WebSharedModels.Dtos.Orders;

namespace Purchase.Core.Services.CartServices;

public class AddItemToCart
{
    private readonly DbContextAbstract _context;
    private readonly IUser _user;

    public AddItemToCart(DbContextAbstract context, IUser user)
    {
        _context = context;
        _user = user;
    }

    public async Task Handle(CreateOrderItemDto orderItemDto, int quantity)
    {
        var cart = await _context.CartItems
            .Where(x => x.CreatedBy == _user.Id && x.ProductId == orderItemDto.ProductId && x.VariantId == orderItemDto.VariantId)
            .FirstOrDefaultAsync();

        if (cart == null)
        {
            cart = new CartItem
            {
                ProductId = orderItemDto.ProductId,
                VariantId = orderItemDto.VariantId,
                Quantity = quantity,
            };
            await _context.CartItems.AddAsync(cart);
        }
        else
        {
            cart.Quantity += quantity;
        }

        await _context.SaveChangesAsync();
    }

}

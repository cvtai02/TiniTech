using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CrossCutting.Exceptions;
using Purchase.Core.Abstraction;
using SharedKernel.Enums;

namespace Purchase.Core.Services.OrderServices;

public class UpdateOrderStatus
{
    private readonly DbContextAbstract _context;

    public UpdateOrderStatus(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task Handle(int orderId, OrderStatus status)
    {
        var order = await _context.Orders.FindAsync(orderId) ?? throw new NotFoundException("Order not found or access denied.");
        order.Status = status;
        await _context.SaveChangesAsync();
    }

}

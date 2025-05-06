using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebSharedModels.Dtos.Orders;

namespace WebMVC.Services.Abstractions;

public interface IOrderService
{
    Task<bool> PlaceOrderAsync(int cartId, string paymentMethod, string shippingAddress, string billingAddress);
    Task<bool> CancelOrderAsync(int orderId);
    Task<List<OrderDto>> GetProcessingOrdersAsync(string userId);
}

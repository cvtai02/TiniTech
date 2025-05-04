using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebSharedModels.Dtos.Orders;

namespace WebMVC.Services.Abstractions;

public interface ICartService
{
    Task<List<OrderItemDto>> GetCartItemsAsync();
    Task<int> AddToCartAsync(int productId, int? variantId, int quantity);
    Task<int> UpdateCartItemQuantityAsync(int productId, int? variantId, int quantity);
}

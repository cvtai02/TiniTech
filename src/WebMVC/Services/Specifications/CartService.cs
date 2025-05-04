using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebMVC.Services.Abstractions;
using WebMVC.Services.Base;
using WebSharedModels.Dtos.Orders;

namespace WebMVC.Services.Specifications;

public class CartService : ICartService
{
    
    private readonly ApiService _apiService;

    public CartService(ApiService apiService)
    {
        _apiService = apiService;
    }

    public Task<int> AddToCartAsync(int productId, int? variantId, int quantity)
    {
        throw new NotImplementedException();
    }

    public Task<List<OrderItemDto>> GetCartItemsAsync()
    {
        throw new NotImplementedException();
    }
    Task<int> ICartService.UpdateCartItemQuantityAsync(int productId, int? variantId, int quantity)
    {
        throw new NotImplementedException();
    }
}

using Purchase.Core.Abstraction;
using WebSharedModels.Dtos.Orders;

namespace Purchase.Infrastructure.ShippingInfras;

public class ShippingFeeCalculator : IShippingFeeCalculator
{
    public Task<decimal> CalculateShippingCostAsync(CreateOrderDto address)
    {
        return Task.FromResult(0m);
    }
}

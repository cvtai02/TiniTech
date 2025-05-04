using WebSharedModels.Dtos.Orders;

namespace Purchase.Core.Abstraction;

public interface IShippingFeeCalculator
{
    Task<decimal> CalculateShippingCostAsync(CreateOrderDto address);
}

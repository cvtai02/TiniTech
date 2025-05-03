using WebSharedModels.Dtos.Orders;

namespace Catalog.Application.Common.Abstraction;

public interface IShippingFeeCalculator
{
    Task<decimal> CalculateShippingCostAsync(CreateOrderDto address);
}

using MediatR;
using Purchase.Core.Abstraction;
using WebSharedModels.Dtos.Orders;

namespace Application.Orders.Queries;

public class ShippingFeeQuery : IRequest<decimal>
{
    public CreateOrderDto Order { get; set; } = null!;
}

public class ShippingFeeQueryHandler : IRequestHandler<ShippingFeeQuery, decimal>
{
    private readonly IShippingFeeCalculator _shippingFeeCalculator;

    public ShippingFeeQueryHandler(IShippingFeeCalculator shippingFeeCalculator)
    {
        _shippingFeeCalculator = shippingFeeCalculator;
    }

    public async Task<decimal> Handle(ShippingFeeQuery request, CancellationToken cancellationToken)
    {
        return await _shippingFeeCalculator.CalculateShippingCostAsync(request.Order);
    }
}

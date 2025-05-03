using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Abstraction;
using Domain.ValueObjects;
using SharedViewModels.Dtos.Orders;

namespace Infrastructure.ShippingService;

public class ShippingFeeCalculator : IShippingFeeCalculator
{
    public Task<decimal> CalculateShippingCostAsync(CreateOrderDto address)
    {
        return Task.FromResult(0m);
    }

    
}

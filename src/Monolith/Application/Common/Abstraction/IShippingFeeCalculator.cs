using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.ValueObjects;
using SharedViewModels.Dtos.Orders;

namespace Application.Common.Abstraction;

public interface IShippingFeeCalculator
{
    Task<decimal> CalculateShippingCostAsync(CreateOrderDto address);
}

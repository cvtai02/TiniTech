using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SharedKernel.Enums;

namespace Purchase.Core.Services.OrderServices.Dtos;

public class GetOrdersQuery
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public OrderStatus? OrderStatus { get; set; } = null!;
    public string? UserId { get; set; } = null!;
}

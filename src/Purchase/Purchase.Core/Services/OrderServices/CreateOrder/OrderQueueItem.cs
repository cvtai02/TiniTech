using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Purchase.Core.Entities;

namespace Purchase.Core.Services.OrderServices.CreateOrder;

public class OrderQueueItem
{
    public Order Order { get; set; } = null!;
    // callback
    public Action<int> OnSuccess { get; set; } = null!;

    public Action<Exception> OnFailure { get; set; } = null!;
}

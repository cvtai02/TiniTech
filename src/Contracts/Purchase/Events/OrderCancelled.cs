using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Contracts.Purchase.Events;

public class OrderCancelled
{
    public int OrderId { get; set; } = 0;


}

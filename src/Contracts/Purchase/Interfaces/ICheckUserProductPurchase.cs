using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Contracts.Purchase.Interfaces;

public interface ICheckUserProductPurchase
{
    Task<DateTimeOffset?> GetUserProductPurchaseDate(string userId, int productId);
}

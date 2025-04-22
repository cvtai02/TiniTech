using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Products.Queries.Enums;

public enum OrderCriteria
{
    Sold,
    Stock,
    Rating,
    Price,
    CreatedDate,
    FeaturedPoint,
}
public enum OrderDirection
{
    Ascending,
    Descending
}

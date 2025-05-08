using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebSharedModels.Dtos.Rating;

public class ProductRatingQuery
{
    public int ProductId { get; set; } = 0;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 3;

    public ProductRatingQuery(int productId, int page, int pageSize)
    {
        ProductId = productId;
        Page = page;
        PageSize = pageSize;
    }

    public ProductRatingQuery(int productId)
    {
        ProductId = productId;
    }

    public ProductRatingQuery()
    {
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebSharedModels.Dtos.Rating;

public class GetProductRatingQuery
{
    public int ProductId { get; set; } = 0;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

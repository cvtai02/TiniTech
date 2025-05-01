using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Enums;
using SharedViewModels.Dtos.Products;
using SharedViewModels.Enums;

namespace WebMVC.Extensions;

public static class ProductQueryParametersExtensions
{
    public static string ToCollectionHref(this ProductQueryParameters parameters)
    {
        var href = $"/collections/{parameters.CategorySlug}?order={parameters.Order}&page={parameters.Page}&pageSize={parameters.PageSize}";
        if (parameters.Search != null)
        {
            href += $"&search={parameters.Search}";
        }
        return href;
    }

    public static string GetCollectionHrefDefault(this ProductQueryParameters parameters)
    {
        return $"/collections/whatever?Page=1&PageSize=10&order={FrontStoreOrderEnum.MostFeatured}";
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SharedViewModels.Enums;

namespace SharedViewModels.Dtos.Products;
public class ProductQueryParameters
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public FrontStoreOrderEnum SortOrder { get; set; } = FrontStoreOrderEnum.MostFeatured;
    public string? CategorySlug { get; set; } = null;

    public override string ToString()
    {
        return $"Page: {Page}, PageSize: {PageSize}, Search: {Search}, SortOrder: {SortOrder}, CategorySlug: {CategorySlug}";
    }


}
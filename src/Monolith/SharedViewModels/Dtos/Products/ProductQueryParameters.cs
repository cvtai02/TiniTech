using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CrossCutting.Extensions;
using SharedViewModels.Enums;

namespace SharedViewModels.Dtos.Products;
public class ProductQueryParameters
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public FrontStoreOrderEnum Order { get; set; } = FrontStoreOrderEnum.MostFeatured;
    public string? CategorySlug { get; set; } = "whatever";

    public override string ToString()
    {
        return $"Page: {Page}, PageSize: {PageSize}, Search: {Search}, Order: {Order}, CategorySlug: {CategorySlug}";
    }

    public ProductQueryParameters SetCloneSearch(string? search)
    {
        Search = search;
        return this.ShallowClone();
    }
    public ProductQueryParameters SetCloneOrder(FrontStoreOrderEnum order)
    {
        Order = order;
        return this.ShallowClone();
    }

    public ProductQueryParameters SetCloneCategorySlug(string? categorySlug)
    {
        CategorySlug = categorySlug;
        return this.ShallowClone();
    }

    public ProductQueryParameters SetClonePage(int page)
    {
        Page = page;
        return this.ShallowClone();
    }

    public ProductQueryParameters SetClonePageSize(int pageSize)
    {
        PageSize = pageSize;
        return this.ShallowClone();
    }
}
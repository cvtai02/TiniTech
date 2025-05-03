using CrossCutting.Extensions;
using WebSharedModels.Enums;

namespace WebSharedModels.Dtos.Products;
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
        var r = this.ShallowClone();
        r.Search = search;
        return r;
    }
    public ProductQueryParameters SetCloneOrder(FrontStoreOrderEnum order)
    {
        var r = this.ShallowClone();
        r.Order = order;
        return r;
    }

    public ProductQueryParameters SetCloneCategorySlug(string? categorySlug)
    {
        var r = this.ShallowClone();
        r.CategorySlug = categorySlug;
        return r;
    }

    public ProductQueryParameters SetClonePage(int page)
    {
        var r = this.ShallowClone();
        r.Page = page;
        return r;
    }

    public ProductQueryParameters SetClonePageSize(int pageSize)
    {
        var r = this.ShallowClone();
        r.PageSize = pageSize;
        return r;
    }
}
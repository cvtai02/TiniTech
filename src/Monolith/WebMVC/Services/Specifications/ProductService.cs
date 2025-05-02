using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Domain.Enums;
using SharedViewModels.Common;
using SharedViewModels.Dtos.Products;
using SharedViewModels.Enums;
using SharedViewModels.Products;
using WebMVC.Services.Abstractions;
using WebMVC.Services.Base;

namespace WebMVC.Services.Specifications;

public class ProductService : IProductService
{
    private readonly ApiService _apiService;

    public ProductService(ApiService apiService)
    {
        _apiService = apiService;
    }
    public async Task<PaginatedList<ProductBriefDto>> GetByQueryAsync(ProductQueryParameters parameters, CancellationToken cancellationToken)
    {
        var response = await _apiService.GetDataAsync<Response<PaginatedList<ProductBriefDto>>>($"api/products{GetApiQueryString(parameters)}", cancellationToken);
        return response.Data ?? new PaginatedList<ProductBriefDto>();
    }

    public async Task<PaginatedList<ProductBriefDto>> GetBestSellerAsync(CancellationToken cancellationToken)
    {
        var query = $"?Status={ProductStatus.Active}&PageNumber=1&PageSize=5&orderBy=sold&orderDirection=descending";
        var response = await _apiService.GetDataAsync<Response<PaginatedList<ProductBriefDto>>>($"api/products{query}", cancellationToken);
        return response.Data ?? new PaginatedList<ProductBriefDto>();
    }

    public async Task<ProductDetailDto> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var response = await _apiService.GetDataAsync<Response<ProductDetailDto>>($"api/products/{slug}", cancellationToken);
        return response.Data ?? new ProductDetailDto();

    }

    public static string GetApiQueryString(ProductQueryParameters parameters)
    {
        var query = $"?Status={ProductStatus.Active}&PageNumber={parameters.Page}&PageSize={parameters.PageSize}";
        if (!string.IsNullOrEmpty(parameters.Search))
        {
            query += $"&search={parameters.Search}";
        }
        if (parameters.Order == FrontStoreOrderEnum.PriceLowToHigh)
        {
            query += $"&orderBy=price&orderDirection=ascending";
        }
        else if (parameters.Order == FrontStoreOrderEnum.PriceHighToLow)
        {
            query += $"&orderBy=price&orderDirection=descending";
        }
        else if (parameters.Order == FrontStoreOrderEnum.BestSelling)
        {
            query += $"&orderBy=sold&orderDirection=descending";
        }
        else if (parameters.Order == FrontStoreOrderEnum.HighestRated)
        {
            query += $"&orderBy=rating&orderDirection=descending";
        }
        else if (parameters.Order == FrontStoreOrderEnum.MostFeatured)
        {
            query += $"&orderBy=featuredPoint&orderDirection=descending";
        }
        if (!string.IsNullOrEmpty(parameters.CategorySlug) && parameters.CategorySlug != "whatever")
        {
            query += $"&categorySlug={parameters.CategorySlug}";
        }
        return query;
    }


    public async Task<PaginatedList<ProductBriefDto>> GetFeaturedAsync(CancellationToken cancellationToken)
    {
        var query = $"?Status={ProductStatus.Active}&PageNumber=1&PageSize=5&orderBy=featuredPoint&orderDirection=descending";
        var response = await _apiService.GetDataAsync<Response<PaginatedList<ProductBriefDto>>>($"api/products{query}", cancellationToken);
        return response.Data ?? new PaginatedList<ProductBriefDto>();
    }

    public async Task<List<ProductBriefDto>> GetRelated(int productId, CancellationToken cancellationToken)
    {
        var query = $"?productId={productId}&Page=1&PageSize=5";
        var response = await _apiService.GetDataAsync<Response<List<ProductBriefDto>>>($"api/products/related{query}", cancellationToken);
        return response.Data ?? [];
    }
}

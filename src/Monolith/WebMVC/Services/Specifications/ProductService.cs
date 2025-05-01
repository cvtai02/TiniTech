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
        Console.WriteLine($"GetByQueryAsync: {JsonSerializer.Serialize(response)}");
        return response.Data ?? new PaginatedList<ProductBriefDto>();
    }

    public Task<List<ProductBriefDto>> GetBestSellerAsync(CancellationToken cancellationToken)
    {
        //mock
        var products = new List<ProductBriefDto>
        {
            new ProductBriefDto
            {
                Id = 1,
                Name = "Product 1",
                Price = 100.00m,
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
            },
            new ProductBriefDto
            {
                Id = 2,
                Name = "Product 2",
                Price = 200.00m,
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
            }

        };

        return Task.FromResult(products);
    }

    public async Task<ProductDetailDto> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var response = await _apiService.GetDataAsync<Response<ProductDetailDto>>($"api/products/{slug}", cancellationToken);
        Console.WriteLine($"GetBySlugAsync: {JsonSerializer.Serialize(response)}");
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
            query += $"&orderBy=price&orderDirection=decscending";
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
            // the default order is most featured
            // query += $"&orderBy=rating&orderDirection=descending";
        }
        if (!string.IsNullOrEmpty(parameters.CategorySlug) && parameters.CategorySlug != "whatever")
        {
            query += $"&categorySlug={parameters.CategorySlug}";
        }
        return query;
    }


    public Task<List<ProductBriefDto>> GetFeaturedAsync(CancellationToken cancellationToken)
    {
        //mock
        var products = new List<ProductBriefDto>
        {
            new ProductBriefDto
            {
                Id = 1,
                Name = "Product 1",
                Price = 100.00m,
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
            },
            new ProductBriefDto
            {
                Id = 2,
                Name = "Product 2",
                Price = 200.00m,
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
            },new ProductBriefDto
            {
                Id = 2,
                Name = "Product 2",
                Price = 200.00m,
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
            },new ProductBriefDto
            {
                Id = 2,
                Name = "Product 2",
                Price = 200.00m,
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
            },new ProductBriefDto
            {
                Id = 2,
                Name = "Product 2",
                Price = 200.00m,
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
            }

        };

        return Task.FromResult(products);
    }
}

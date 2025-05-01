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

    public Task<ProductDetailDto> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        //mock
        var product = new ProductDetailDto
        {
            Id = 1,
            Name = "Product 1",
            Price = 100.00m,
            DefaultImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
            Description = "This is a sample product description.",
            Images = new List<ProductImageDto>
            {
                new ProductImageDto
                {
                    Id = 1,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
                    OrderPriority = 1
                },
                new ProductImageDto
                {
                    Id = 2,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
                    OrderPriority = 2
                }
                ,
                new ProductImageDto
                {
                    Id = 3,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
                    OrderPriority = 2
                },
                new ProductImageDto
                {
                    Id = 4,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
                    OrderPriority = 2
                }
            },
            Attributes =
            [
                new AttributeDto
                {
                    AttributeId = 1,
                    Name = "Color",
                    OrderPriority = 1,
                    IsPrimary = true,
                    Values = new List<AttributeValueDto>
                    {
                        new AttributeValueDto
                        {
                            OrderPriority = 1,
                            Value = "Red",
                            ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                        },
                        new AttributeValueDto
                        {
                            OrderPriority = 2,
                            Value = "Blue",
                            ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                        }
                    }
                },
                new AttributeDto {
                    AttributeId = 2,
                    Name = "Size",
                    OrderPriority = 1,
                    IsPrimary = false,
                    Values = new List<AttributeValueDto>
                    {
                        new AttributeValueDto
                        {
                            OrderPriority = 1,
                            Value = "L",
                        },
                        new AttributeValueDto
                        {
                            OrderPriority = 2,
                            Value = "M",
                        }
                    }
                }
            ],
            Variants = new List<VariantDto>
            {
                new VariantDto
                {
                    Id = 1,
                    Price = 100.00m,
                    Stock = 10,
                    Sku = "SKU-001",
                    VariantAttributes =
                    [
                        new VariantAttributeDto
                        {
                            AttributeId = 1,
                            Value = "Red",
                        },
                        new VariantAttributeDto
                        {
                            AttributeId = 2,
                            Value = "L",
                        }
                    ]
                },
                new VariantDto
                {
                    Id = 1,
                    Price = 100.00m,
                    Stock = 10,
                    Sku = "SKU-001",
                    VariantAttributes =
                    [
                        new VariantAttributeDto
                        {
                            AttributeId = 1,
                            Value = "Blue",
                        },
                        new VariantAttributeDto
                        {
                            AttributeId = 2,
                            Value = "M",
                        }
                    ]
                },
            }
        };

        return Task.FromResult(product);

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

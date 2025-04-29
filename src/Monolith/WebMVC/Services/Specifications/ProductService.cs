using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SharedViewModels.Products;
using WebMVC.Services.Abstractions;

namespace WebMVC.Services.Specifications;

public class ProductService : IProductService
{
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
                ImageUrl = "https://stock.adobe.com/search/images?k=no+image+available",
            },
            new ProductBriefDto
            {
                Id = 2,
                Name = "Product 2",
                Price = 200.00m,
                ImageUrl = "https://stock.adobe.com/search/images?k=no+image+available",
            }

        };

        return Task.FromResult(products);
    }

    public Task<List<ProductBriefDto>> GetHighlightedAsync(CancellationToken cancellationToken)
    {
        //mock
        var products = new List<ProductBriefDto>
        {
            new ProductBriefDto
            {
                Id = 1,
                Name = "Product 1",
                Price = 100.00m,
                ImageUrl = "https://example.com/image1.jpg",
            },
            new ProductBriefDto
            {
                Id = 2,
                Name = "Product 2",
                Price = 200.00m,
                ImageUrl = "https://example.com/image2.jpg",
            }

        };

        return Task.FromResult(products);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using SharedViewModels.Common;
using SharedViewModels.Dtos.Products;
using SharedViewModels.Enums;
using SharedViewModels.Products;

namespace WebMVC.Services.Abstractions;

public interface IProductService
{
    Task<PaginatedList<ProductBriefDto>> GetBestSellerAsync(CancellationToken cancellationToken);
    Task<PaginatedList<ProductBriefDto>> GetFeaturedAsync(CancellationToken cancellationToken);
    Task<PaginatedList<ProductBriefDto>> GetByQueryAsync(ProductQueryParameters parameters, CancellationToken cancellationToken);
    Task<ProductDetailDto> GetBySlugAsync(string slug, CancellationToken cancellationToken);
    Task<List<ProductBriefDto>> GetRelated(int productId, CancellationToken cancellationToken);
}



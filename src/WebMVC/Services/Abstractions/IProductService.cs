using SharedKernel.Models;
using WebSharedModels.Dtos.Products;

namespace WebMVC.Services.Abstractions;

public interface IProductService
{
    Task<PaginatedList<ProductBriefDto>> GetBestSellerAsync(CancellationToken cancellationToken);
    Task<PaginatedList<ProductBriefDto>> GetFeaturedAsync(CancellationToken cancellationToken);
    Task<PaginatedList<ProductBriefDto>> GetByQueryAsync(ProductQueryParameters parameters, CancellationToken cancellationToken);
    Task<ProductDetailDto> GetBySlugAsync(string slug, CancellationToken cancellationToken);
    Task<List<ProductBriefDto>> GetRelated(int productId, CancellationToken cancellationToken);
}



using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SharedViewModels.Products;

namespace WebMVC.Services.Abstractions;

public interface IProductService
{
    Task<List<ProductBriefDto>> GetBestSellerAsync(CancellationToken cancellationToken);

    Task<List<ProductBriefDto>> GetHighlightedAsync(CancellationToken cancellationToken);
}

using WebSharedModels.Dtos.Products;

namespace WebMVC.Models;

public class ProductViewModel
{
    public ProductDetailDto Product { get; set; } = new ProductDetailDto();
    public List<ProductBriefDto> RelatedProducts { get; set; } = new List<ProductBriefDto>();
}

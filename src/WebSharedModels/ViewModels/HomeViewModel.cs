using WebSharedModels.Dtos.Products;

namespace WebSharedModels.ViewModels;

public class HomeViewModel
{

    public List<ProductBriefDto> BestSellers { get; set; } = [];
    public List<ProductBriefDto> FeaturedProducts { get; set; } = [];
}

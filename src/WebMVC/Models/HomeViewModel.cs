using WebSharedModels.Dtos.Products;

namespace WebMVC.Models;

public class HomeViewModel
{

    public List<ProductBriefDto> BestSellers { get; set; } = [];
    public List<ProductBriefDto> FeaturedProducts { get; set; } = [];
}

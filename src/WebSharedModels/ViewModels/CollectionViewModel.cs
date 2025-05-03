using SharedKernel.Models;
using WebSharedModels.Dtos.Categories;
using WebSharedModels.Dtos.Products;

namespace WebSharedModels.ViewModels;

public class CollectionViewModel
{
    public List<CategoryDto> Categories { get; set; } = [];
    public PaginatedList<ProductBriefDto> Products { get; set; } = new PaginatedList<ProductBriefDto>();

    public ProductQueryParameters QueryParameters { get; set; } = new ProductQueryParameters();
}

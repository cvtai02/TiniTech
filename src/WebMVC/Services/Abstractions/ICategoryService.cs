using WebSharedModels.Dtos.Categories;

namespace WebMVC.Services.Abstractions;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetActiveCategoriesAsync(CancellationToken cancellationToken);
}

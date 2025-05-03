using WebMVC.Services.Abstractions;
using WebMVC.Services.Base;
using WebSharedModels.Dtos.Categories;
using WebSharedModels.Dtos.Common;

namespace WebMVC.Services.Specifications;

public class CategoryService : ICategoryService
{
    private readonly ApiService _apiService;

    public CategoryService(ApiService apiService)
    {
        _apiService = apiService;
    }

    public async Task<List<CategoryDto>> GetActiveCategoriesAsync(CancellationToken cancellationToken)
    {

        var response = await _apiService.GetDataAsync<Response<List<CategoryDto>>>("api/categories?status=active", cancellationToken);

        return response.Data ?? new List<CategoryDto>();
    }

}

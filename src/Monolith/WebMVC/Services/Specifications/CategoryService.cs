using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SharedViewModels.Categories;
using SharedViewModels.Common;
using WebMVC.Services.Abstractions;
using WebMVC.Services.Base;

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

        var response = await _apiService.GetDataAsync<Response<List<CategoryDto>>>("api/categories?status=active");

        return response.Data ?? new List<CategoryDto>();
    }
}

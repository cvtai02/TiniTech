using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SharedViewModels.Categories;

namespace WebMVC.Services.Abstractions;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetActiveCategoriesAsync(CancellationToken cancellationToken);
}

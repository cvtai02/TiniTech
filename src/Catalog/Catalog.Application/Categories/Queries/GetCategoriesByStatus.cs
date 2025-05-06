using Catalog.Application.Common.Abstraction;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebSharedModels.Dtos.Categories;

namespace Catalog.Application.Categories.Queries;

public class GetCategoriesByStatusQuery : IRequest<Result<List<CategoryDto>>>
{
    public CategoryStatus? Status { get; set; } = null!;
}

public class GetCategoriesByStatusQueryHandler : IRequestHandler<GetCategoriesByStatusQuery, Result<List<CategoryDto>>>
{
    private readonly DbContextAbstract _context;

    public GetCategoriesByStatusQueryHandler(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<Result<List<CategoryDto>>> Handle(GetCategoriesByStatusQuery request, CancellationToken cancellationToken)
    {
        // First get all categories
        var categories = await _context.Categories
            .AsNoTracking()
            .Where(c => request.Status == null || c.Status == request.Status)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Slug = c.Slug,
                ParentId = c.ParentId,
                Status = c.Status,
            })
            .ToListAsync(cancellationToken);

        // Build hierarchy for root categories (those with no parent)
        var rootCategories = categories
            .Where(c => c.ParentId == null)
            .ToList();

        // Map child categories to their parents
        foreach (var category in rootCategories)
        {
            BuildCategoryHierarchy(category, categories);
        }

        return rootCategories;
    }

    private void BuildCategoryHierarchy(CategoryDto parent, List<CategoryDto> allCategories)
    {
        parent.Subcategories = allCategories
            .Where(c => c.ParentId == parent.Id)
            .ToList();

        foreach (var child in parent.Subcategories)
        {
            BuildCategoryHierarchy(child, allCategories);
        }
    }
}

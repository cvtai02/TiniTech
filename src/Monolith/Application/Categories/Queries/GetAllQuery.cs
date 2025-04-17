using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Categories.Queries;

public class GetAllCategoriesQuery : IRequest<Result<List<CategoryDto>>>
{
}

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int? ParentId { get; set; }
    public List<CategoryDto> Subcategories { get; set; } = new List<CategoryDto>();
}

public class GetAllCategoriesQueryHandler : IRequestHandler<GetAllCategoriesQuery, Result<List<CategoryDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetAllCategoriesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<CategoryDto>>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
    {
        // First get all categories
        var categories = await _context.Categories
            .AsNoTracking()
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Slug = c.Slug,
                ParentId = c.ParentId
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

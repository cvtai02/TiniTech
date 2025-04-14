
using Domain.Base;

namespace Domain.Entities;

public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int ParentId { get; set; }
    public Category? Parent { get; set; }
    public ICollection<Category> Subcategories { get; set; } = new List<Category>();
}

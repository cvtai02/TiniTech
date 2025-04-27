
using CrossCutting.Extensions;
using Domain.Base;
using Domain.Enums;

namespace Domain.Entities;

public class Category : BaseAuditableEntity
{
    private string _name = string.Empty;

    public string Name
    {
        get => _name;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Category name cannot be empty or whitespace.", nameof(value));
            }
            else
            {
                _name = char.ToUpper(value[0]) + value[1..];
            }
            Slug = value.ToSlug();
        }
    }
    public string Description { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int? ParentId { get; set; }
    public CategoryStatus Status { get; set; } = CategoryStatus.Active;
    public Category? Parent { get; set; }
    public ICollection<Category> Subcategories { get; set; } = [];
    public ICollection<Product> Products { get; set; } = [];
}

using Catalog.Domain.Entities;
using FluentValidation;

namespace Catalog.Application.Products.Commands.UpdateProductStatus;

public class ActivateProductStatusValidator : AbstractValidator<Product>
{
    public ActivateProductStatusValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Product name is required.");
        RuleFor(x => x.Sku).NotEmpty().WithMessage("Product SKU is required.");
        // RuleFor(x => x.Description).NotEmpty().WithMessage("Product description is required.");
        RuleFor(x => x.CategoryId).NotEmpty().WithMessage("Product category is required.");
        RuleFor(x => x.Metric.LowestPrice).GreaterThanOrEqualTo(0).WithMessage("Product price must be greater than or equal to 0.");

        RuleFor(x => x.Category).NotNull().WithMessage("Product category is required.");
        RuleFor(x => x.Category.Status).NotEqual(CategoryStatus.Deleted)
            .WithMessage("Product category must not be deleted.");

        RuleFor(x => x.Images).NotEmpty().WithMessage("Product images are required.");

        RuleFor(x => x)
            .Must(product => !product.Attributes.Any() || product.Variants.Any(v => !v.IsDeleted))
            .WithMessage("When attributes are defined, at least one non-deleted variant is required.");

        RuleForEach(x => x.Attributes).Must(attribute => attribute.ProductAttributeValues.Any())
            .WithMessage("Each attribute must have at least one value.");

        RuleForEach(x => x.Variants).ChildRules(variants =>
        {
            variants.RuleFor(v => v.Sku).NotEmpty().WithMessage("Variant SKU is required.");
        });
    }
}

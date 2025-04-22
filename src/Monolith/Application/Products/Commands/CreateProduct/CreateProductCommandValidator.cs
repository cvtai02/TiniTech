using Application.Common.Abstraction;
using FluentValidation;

namespace Application.Products.Commands.CreateProductCommand;

public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator(IImageService imageService)
    {
        var allowImageContentTypes = imageService.AllowImageContentTypes;
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name must not exceed 100 characters.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.")
                .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");

            RuleFor(x => x.CategoryId)
                .GreaterThan(0).WithMessage("CategoryId must be greater than 0.");

            RuleFor(x => x.Images)
                .NotEmpty().WithMessage("At least one image is required.")
                .ForEach(image =>
                {
                    image.Must(file => file.Length > 0).WithMessage("File is empty.")
                        .Must(file => allowImageContentTypes.Contains(file.ContentType))
                        .WithMessage("Image content type is not supported.")
                        .Must(file => file.Length <= 5 * 1024 * 1024).WithMessage("Image size must not exceed 5MB.");
                });
        }
    }

}

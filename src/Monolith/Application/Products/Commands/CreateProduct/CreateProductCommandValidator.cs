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

            RuleFor(x => x.CategoryId)
                .NotEmpty().WithMessage("CategoryId is required.");

            RuleFor(x => x.Images)
                .ForEach(image =>
                {
                    image
                        .Must(file => allowImageContentTypes.Contains(file.ContentType))
                        .WithMessage("Image content type is not supported.")
                        .Must(file => file.Length <= 5 * 1024 * 1024).WithMessage("Image size must not exceed 5MB.")
                        .Must(file => file.Length > 800 * 800).WithMessage("Image quality is too low.");
                });
        }
    }

}

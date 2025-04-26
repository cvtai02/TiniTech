using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Abstraction;
using FluentValidation;

namespace Application.Products.Commands.UpdateProductImages;

public class UpdateProductImagesCommandValidator : AbstractValidator<UpdateProductImagesCommand>
{
    public UpdateProductImagesCommandValidator(IImageService imageService)
    {
        RuleFor(x => x.AddImages)
            .ForEach(image =>
            {
                image
                    .Must(file => imageService.AllowImageContentTypes.Contains(file.ContentType))
                    .WithMessage("Image content type is not supported.")
                    .Must(file => file.Length <= 5 * 1024 * 1024).WithMessage("Image size must not exceed 5MB.");
                // .Must(file => file.Length > 800 * 800).WithMessage("Image quality is too low.");
            });
    }

}

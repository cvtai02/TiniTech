using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Products.Commands.UpdateProductInfo;

public class UpdateProductInfoValidator : AbstractValidator<UpdateProductInfoCommand>
{
    public UpdateProductInfoValidator()
    {
        RuleFor(x => x.New.Name)
            .NotEmpty()
            .WithMessage("Product name is required.")
            .MaximumLength(100)
            .WithMessage("Product name must not exceed 100 characters.");

        RuleFor(x => x.New.Sku)
            .NotEmpty()
            .WithMessage("Product SKU is required.")
            .MaximumLength(50)
            .WithMessage("Product SKU must not exceed 50 characters.");

        
    }
}

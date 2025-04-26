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
        RuleFor(x => x.Name)
                .MaximumLength(100).WithMessage("Name must not exceed 100 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");
    }
}

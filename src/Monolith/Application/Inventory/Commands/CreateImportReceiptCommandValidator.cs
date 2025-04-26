using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Inventory.Commands;

public class CreateImportReceiptCommandValidator : AbstractValidator<CreateImportReceiptCommand>
{
    public CreateImportReceiptCommandValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty()
            .WithMessage("Code is required.")
            .MaximumLength(50)
            .WithMessage("Code must not exceed 50 characters.");

        RuleFor(x => x.ReceiptDate)
            .NotEmpty()
            .WithMessage("Receipt date is required.");

        RuleFor(x => x.Items)
            .NotEmpty()
            .WithMessage("At least one item is required.")
            .Must(items => items.All(item => item.Quantity > 0))
            .WithMessage("All items must have a quantity greater than zero.");
    }

}

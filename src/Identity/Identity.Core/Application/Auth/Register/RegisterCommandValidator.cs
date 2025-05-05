using System.Data;
using FluentValidation;
using Identity.Core.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Identity.Core.Application.Auth.Commands.Register;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        Console.WriteLine("RegisterCommandValidator");
        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long.");
    }

}

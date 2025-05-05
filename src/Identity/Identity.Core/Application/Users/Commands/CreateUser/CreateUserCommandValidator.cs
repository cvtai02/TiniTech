using System.Data;
using FluentValidation;
using Identity.Core.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Identity.Core.Application.Users.Commands.CreateUser;

public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator(DbContextAbstract dbContext)
    {
        Console.WriteLine("CreateUserCommandValidator");
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(50).WithMessage("First name must not exceed 50 characters.");
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        // var validRoles = typeof(Roles)
        //         .GetFields(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static)
        //         .Select(f => f.GetValue(null)?.ToString()?.ToLower())
        //         .ToList();

        // RuleFor(x => x.Role)
        //     .NotEmpty().WithMessage("Role is required.")
        //     .Must(role => validRoles.Contains(role))
        //     .WithMessage($"Role must be one of the following: {string.Join(", ", validRoles)}.");
    }

}

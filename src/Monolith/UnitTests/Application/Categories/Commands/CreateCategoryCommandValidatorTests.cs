using Application.Categories.Commands;
using Application.Categories.Commands.CreateCategory;
using FluentValidation.TestHelper;

namespace UnitTests.Categories.Commands;

public class CreateCategoryCommandValidatorTests
{
    private readonly CreateCategoryCommandValidator _validator;

    public CreateCategoryCommandValidatorTests()
    {
        _validator = new CreateCategoryCommandValidator();
    }

    [Fact]
    public void Validator_WhenNameIsEmpty_ShouldHaveError()
    {
        // Arrange
        var command = new CreateCategoryCommand
        {
            Name = string.Empty,
            Description = "Valid description"
        };

        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Name)
              .WithErrorMessage("Name is required.");
    }

    [Fact]
    public void Validator_WhenNameExceeds100Characters_ShouldHaveError()
    {
        // Arrange
        var command = new CreateCategoryCommand
        {
            Name = new string('A', 101),
            Description = "Valid description"
        };

        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Name)
              .WithErrorMessage("Name must not exceed 100 characters.");
    }

    [Fact]
    public void Validator_WhenNameIsValid_ShouldNotHaveNameError()
    {
        // Arrange
        var command = new CreateCategoryCommand
        {
            Name = "Valid Category Name",
            Description = "Valid description"
        };

        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validator_WhenDescriptionExceeds500Characters_ShouldHaveError()
    {
        // Arrange
        var command = new CreateCategoryCommand
        {
            Name = "Valid Name",
            Description = new string('A', 501)
        };

        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Description)
              .WithErrorMessage("Description must not exceed 500 characters.");
    }

    [Fact]
    public void Validator_WhenDescriptionIsValid_ShouldNotHaveDescriptionError()
    {
        // Arrange
        var command = new CreateCategoryCommand
        {
            Name = "Valid Name",
            Description = "Valid description"
        };

        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveValidationErrorFor(x => x.Description);
    }

    [Fact]
    public void Validator_WhenDescriptionIsEmpty_ShouldNotHaveError()
    {
        // Arrange
        var command = new CreateCategoryCommand
        {
            Name = "Valid Name",
            Description = string.Empty
        };

        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveValidationErrorFor(x => x.Description);
    }
}

using Application.Products.Commands.UpdateProductInfo;
using FluentValidation.TestHelper;

namespace UnitTests.Products.Validators;

public class UpdateProductInfoValidatorTests
{
    private readonly UpdateProductInfoValidator _validator;

    public UpdateProductInfoValidatorTests()
    {
        _validator = new UpdateProductInfoValidator();
    }

    [Fact]
    public void Validate_WithValidCommand_ShouldNotHaveErrors()
    {
        // Arrange
        var command = new UpdateProductInfoCommand
        {
            ProductId = 1,
            Name = "Valid Product Name",
            Description = "Valid description"
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithTooLongName_ShouldHaveError()
    {
        // Arrange
        var command = new UpdateProductInfoCommand
        {
            ProductId = 1,
            Name = new string('A', 101) // 101 characters
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Name)
              .WithErrorMessage("Name must not exceed 100 characters.");
    }

    [Fact]
    public void Validate_WithTooLongDescription_ShouldHaveError()
    {
        // Arrange
        var command = new UpdateProductInfoCommand
        {
            ProductId = 1,
            Description = new string('A', 501) // 501 characters
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Description)
              .WithErrorMessage("Description must not exceed 500 characters.");
    }
}

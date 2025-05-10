using Catalog.Application.Products.Commands.CreateProductCommand;
using Catalog.Application.Products.Commands.UpdateProductInfo;
using Catalog.Application.Products.Queries.GetBySku;
using Catalog.Application.Products.Queries.GetDetailBySlug;
using Catalog.Application.Products.Queries.GetProducts;
using Catalog.Application.Products.Queries.GetRelated;
using Catalog.EndPoints.Controllers;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using SharedKernel.Exceptions;
using SharedKernel.Models;
using WebSharedModels.Dtos.Common;
using Xunit;

namespace Catalog.Tests.Controllers;

public class CreateProductEndpointTests
{
    private readonly Mock<ISender> _mockSender;
    private readonly Mock<ILogger<ProductController>> _mockLogger;
    private readonly ProductController _controller;

    public CreateProductEndpointTests()
    {
        _mockSender = new Mock<ISender>();
        _mockLogger = new Mock<ILogger<ProductController>>();
        _controller = new ProductController(_mockLogger.Object, _mockSender.Object);
    }

    [Fact]
    public async Task Create_ShouldReturn201_WhenSuccessful()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            CategoryId = 2,
            Name = "Test Product",
            Sku = "TEST-SKU",
        };
        var expectedResponse = "new-product-slug";
        _mockSender.Setup(s => s.Send(It.IsAny<CreateProductCommand>(), default))
                   .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.Create(command);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(_controller.GetBySlug), createdResult.ActionName);
        Assert.NotNull(createdResult.Value);
        Assert.Equal(expectedResponse, ((Response<string>)createdResult.Value).Data);
        Assert.Equal(200, ((Response<string>)createdResult.Value).Status);
    }

    [Fact]
    public async Task Create_ShouldReturn400_WhenValidationFails()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            CategoryId = 1,
            Name = "",
            Sku = "TEST-SKU",
        };

        var errors = new FluentValidationException(
                        new List<ValidationFailure>
                        {
                            new ValidationFailure("Test", "Validation error")
                        }
                   );
        _mockSender.Setup(s => s.Send(It.IsAny<CreateProductCommand>(), default))
                   .ReturnsAsync(errors);

        // Act
        var result = await _controller.Create(command);

        // Assert

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.NotNull(badRequestResult.Value);
        Assert.Equal(400, ((ProblemDetails)badRequestResult.Value).Status);
        Assert.Equal(errors.Errors, ((ProblemDetails)badRequestResult.Value).Extensions["errors"] as IDictionary<string, string[]>);
    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Catalog.Application.Common.Abstraction;
using Catalog.Application.Common.Exceptions;
using Catalog.Application.Products.Commands.CreateProductCommand;
using MassTransit.Mediator;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit.Abstractions;

namespace Catalog.Tests.Products;

public class CreateProductCommandHandlerTests : IClassFixture<TestFixture>
{
    private readonly TestFixture _commonFixture;
    private readonly TestFixture UniqueFixture;

    private readonly ITestOutputHelper _output;

    public CreateProductCommandHandlerTests(TestFixture fixture, ITestOutputHelper output)
    {
        _output = output;
        _commonFixture = fixture;

        UniqueFixture = new TestFixture();
    }


    [Fact]
    public async Task ShouldReturnNotFound_WhenCategoryIdNotAvailable()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Name = "Test Product",
            Sku = "TEST-SKU",
            CategoryId = 9999, // Non-existing category ID
        };
        var handler = new CreateProductCommandHandler(UniqueFixture.DbContext, UniqueFixture.MockImageService.Object);
        // Act
        var result = await handler.Handle(command, CancellationToken.None);
        // Assert
        Assert.True(result.IsFailure);
    }


    [Fact]
    public async Task ShouldReturnFailure_WhenCategoryIsNotChildren()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Name = "Test Product",
            Sku = "TEST-SKU",
            CategoryId = 1,
        };

        var handler = new CreateProductCommandHandler(UniqueFixture.DbContext, UniqueFixture.MockImageService.Object);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsFailure);
    }

    [Fact]
    public async Task ShouldReturnFailure_WhenCreateSameSku()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Name = "Test Product",
            Sku = "TEST-SKU",
            CategoryId = 2,
        };

        var handler = new CreateProductCommandHandler(UniqueFixture.DbContext, UniqueFixture.MockImageService.Object);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);
        Assert.True(result.IsSuccess);
        var result2 = await handler.Handle(command, CancellationToken.None);
        Assert.True(result2.IsFailure);

    }

    [Fact]
    public async Task ShouldReturnFailure_WhenUploadImagesFailed()
    {
        UniqueFixture.MockImageService.Setup(x => x.UploadImageAsync(It.IsAny<IFormFile>(), It.IsAny<string>(), It.IsAny<string>()))
            .Throws(new ImageUploadFailException("No images were uploaded successfully."));

        // Arrange
        var imageService = UniqueFixture.MockImageService;
        //create list of IFormFile images
        var images = new List<IFormFile>();
        for (int i = 0; i < 2; i++)
        {
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.FileName).Returns($"test{i}.jpg");
            fileMock.Setup(f => f.Length).Returns(1024);
            images.Add(fileMock.Object);
        }

        var command = new CreateProductCommand
        {
            Name = "Test Product",
            CategoryId = 2,
            Sku = "TEST-SKU",
            Images = images,
        };

        var handler = new CreateProductCommandHandler(UniqueFixture.DbContext, UniqueFixture.MockImageService.Object);
        var result = await handler.Handle(command, CancellationToken.None);

        Assert.True(result.IsFailure);
        Assert.True(result.Exception is ImageUploadFailException);
    }

    [Fact]
    public async Task ShouldReturnValidationExceptions_WhenRequiredFieldsOfCommandAreMissing()
    {

        var command = new CreateProductCommand
        {
            // Missing required fields

            // Name = "Test Product",
            // Description = "Test Description",
            // Sku = "TEST-SKU",
        };

        var handler = new CreateProductCommandHandler(UniqueFixture.DbContext, UniqueFixture.MockImageService.Object);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
    }

    [Fact]
    public async Task ShouldCreateProduct_WhenOnlyRequiredFieldsOfCommandIsSetted()
    {
        var command = new CreateProductCommand
        {
            Name = "Test Product",
            CategoryId = 2,
            Sku = "TEST-SKU",
            Price = 1,
        };

        var handler = new CreateProductCommandHandler(UniqueFixture.DbContext, UniqueFixture.MockImageService.Object);

        // Act
        //try
        //{
        var result = await handler.Handle(command, CancellationToken.None);

        Assert.True(result.IsSuccess);
        //}
        //catch (Exception ex)
        //{
        //    _output.WriteLine(ex.Message);
        //}


        // Assert
    }

    [Fact]
    public async Task ShouldCreateProduct_WhenAllFieldsOfCommandAreSetted()
    {
        // Arrange
        var imageService = UniqueFixture.MockImageService;
        //create list of IFormFile images
        var images = new List<IFormFile>();
        for (int i = 0; i < 2; i++)
        {
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.FileName).Returns($"test{i}.jpg");
            fileMock.Setup(f => f.Length).Returns(1024);
            images.Add(fileMock.Object);
        }



        var command = new CreateProductCommand
        {
            Name = "Test Product",
            CategoryId = 2,
            Sku = "TEST-SKU",
            Price = 1,
            Description = "Test Description",
            Images = images,
        };

        var handler = new CreateProductCommandHandler(UniqueFixture.DbContext, UniqueFixture.MockImageService.Object);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        var createdProduct = UniqueFixture.DbContext.Products
            .Include(p => p.Images)
            .Include(p => p.Metric)
            .FirstOrDefault(p => p.Sku == command.Sku);

        // Assert
        Assert.True(result.IsSuccess);

        Assert.NotNull(createdProduct);
        Assert.Equal(command.Name, createdProduct.Name);
        Assert.Equal(command.Sku, createdProduct.Sku);
        Assert.Equal(command.Description, createdProduct.Description);
        Assert.Equal(command.Price, createdProduct.Metric.LowestPrice);
        Assert.Equal(command.CategoryId, createdProduct.CategoryId);
        Assert.Equal(command.Images.Count, createdProduct.Images.Count);

    }

}

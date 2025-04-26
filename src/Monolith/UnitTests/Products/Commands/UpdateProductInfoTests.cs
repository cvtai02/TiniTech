using Application.Common.Models;
using Application.Products.Commands.UpdateProductInfo;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace UnitTests.Products.Commands;

public class UpdateProductInfoTests : IClassFixture<TestFixture>
{
    private readonly TestFixture _fixture;

    public UpdateProductInfoTests(TestFixture fixture)
    {
        _fixture = fixture;

        // Ensure database is clean and seeded for each test
        _fixture.DbContext.Database.EnsureDeleted();
        _fixture.DbContext.Database.EnsureCreated();
        _fixture.DbContext.SeedTestData();
    }

    [Fact]
    public async Task Handle_WithBasicProductUpdates_ShouldUpdateProduct()
    {
        // Arrange
        var command = new UpdateProductInfoCommand
        {
            ProductId = 1,
            Name = "Updated Product Name",
            Sku = "Updated-SKU",
            Price = 999,
            CategoryId = 2,
            Description = "Updated product description",
            Status = ProductStatus.Inactive
        };

        var handler = new UpdateProductInfoCommandHandler(_fixture.DbContext);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be(1);

        // Verify the product was updated
        var updatedProduct = await _fixture.DbContext.Products
            .Include(p => p.Metric)
            .FirstAsync(p => p.Id == 1);

        updatedProduct.Name.Should().Be("Updated Product Name");
        updatedProduct.Sku.Should().Be("Updated-SKU");
        updatedProduct.Metric.LowestPrice.Should().Be(999);
        updatedProduct.CategoryId.Should().Be(2);
        updatedProduct.Description.Should().Be("Updated product description");
        updatedProduct.Status.Should().Be(ProductStatus.Inactive);
    }

    [Fact]
    public async Task Handle_WithNewVariants_ShouldAddVariantsToProduct()
    {
        // Arrange
        var command = new UpdateProductInfoCommand
        {
            ProductId = 1,
            Variants = new CrudVariantDto
            {
                AddList = new List<CreateVariantDto>
                {
                    new CreateVariantDto
                    {
                        Price = 150,
                        SKU = "VAR-001",
                        Attributes = new List<VariantAttributeDto>
                        {
                            new VariantAttributeDto { AttributeId = 1, Values = "Red" }
                        }
                    }
                }
            }
        };

        var handler = new UpdateProductInfoCommandHandler(_fixture.DbContext);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();

        // Verify the variant was added
        var product = await _fixture.DbContext.Products
            .Include(p => p.Variants)
                .ThenInclude(v => v.VariantAttributes)
            .FirstAsync(p => p.Id == 1);

        product.Variants.Should().HaveCount(1);
        product.Variants.First().Price.Should().Be(150);
        product.Variants.First().Sku.Should().Be("VAR-001");
        product.Variants.First().VariantAttributes.Should().HaveCount(1);
        product.Variants.First().VariantAttributes.First().AttributeId.Should().Be(1);
        product.Variants.First().VariantAttributes.First().Value.Should().Be("Red");
    }

    [Fact]
    public async Task Handle_WithProductAttributes_ShouldAddAttributesToProduct()
    {
        // Arrange
        var command = new UpdateProductInfoCommand
        {
            ProductId = 1,
            Attributes = new CrudProductAttributeDto
            {
                AddList = new List<CreateProductAttributeDto>
                {
                    new CreateProductAttributeDto
                    {
                        AttributeId = 1,
                        IsPrimary = true,
                        OrderPriority = 1,
                        Values = new List<AttributeValueDto>
                        {
                            new AttributeValueDto { Value = "Red", OrderPriority = 1 },
                            new AttributeValueDto { Value = "Blue", OrderPriority = 2 }
                        }
                    }
                }
            }
        };

        var handler = new UpdateProductInfoCommandHandler(_fixture.DbContext);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();

        // Verify the attributes were added
        var product = await _fixture.DbContext.Products
            .Include(p => p.Attributes)
                .ThenInclude(a => a.ProductAttributeValues)
            .FirstAsync(p => p.Id == 1);

        product.Attributes.Should().HaveCount(1);
        product.Attributes.First().AttributeId.Should().Be(1);
        product.Attributes.First().IsPrimary.Should().BeTrue();
        product.Attributes.First().OrderPriority.Should().Be(1);
        product.Attributes.First().ProductAttributeValues.Should().HaveCount(2);
        product.Attributes.First().ProductAttributeValues.Should().Contain(av => av.Value == "Red");
        product.Attributes.First().ProductAttributeValues.Should().Contain(av => av.Value == "Blue");
    }

    [Fact]
    public async Task Handle_WithNonExistentProduct_ShouldReturnKeyNotFoundException()
    {
        // Arrange
        var command = new UpdateProductInfoCommand
        {
            ProductId = 999, // Non-existent product ID
            Name = "This product doesn't exist"
        };

        var handler = new UpdateProductInfoCommandHandler(_fixture.DbContext);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Exception.Should().BeOfType<KeyNotFoundException>();
        result.Exception.Message.Should().Contain("Product with ID 999 not found");
    }
}

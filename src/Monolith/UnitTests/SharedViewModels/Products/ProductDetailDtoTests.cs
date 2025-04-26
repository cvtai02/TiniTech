using System.Collections.Generic;
using Domain.Entities;
using Domain.Enums;
using SharedViewModels.Products;

namespace UnitTests.Products;

public class ProductDetailDtoTests : IClassFixture<TestFixture>
{
    private readonly TestFixture _fixture;

    public ProductDetailDtoTests(TestFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public void FromProduct_BasicPropertiesMapping_ShouldMapCorrectly()
    {
        // Arrange
        var metric = new ProductMetric
        {
            Id = 1,
            LowestPrice = 500,
            Stock = 100,
            Sold = 20,
            RatingAvg = 4.5f,
            RatingCount = 10,
            FeaturedPoint = 3
        };

        var product = new Product
        {
            Id = 1,
            Slug = "test-product",
            Name = "Test Product",
            Sku = "TP-001",
            Status = ProductStatus.Active,
            ImageUrl = "https://example.com/image.jpg",
            CategoryId = 1,
            Description = "Test product description",
            Metric = metric,
            Images = new List<ProductImage>(),
            Attributes = new List<ProductAttribute>(),
            Variants = new List<Variant>()
        };

        // Act
        var dto = ProductDetailDto.FromProduct(product);

        // Assert
        dto.Should().NotBeNull();
        dto.Id.Should().Be(product.Id);
        dto.Slug.Should().Be(product.Slug);
        dto.Name.Should().Be(product.Name);
        dto.Sku.Should().Be(product.Sku);
        dto.DefaultImageUrl.Should().Be(product.ImageUrl);
        dto.Price.Should().Be(metric.LowestPrice);
        dto.CategoryId.Should().Be(product.CategoryId);
        dto.Description.Should().Be(product.Description);
        dto.Rating.Should().Be(metric.RatingAvg);
        dto.RatingCount.Should().Be(metric.RatingCount);
        dto.Stock.Should().Be(metric.Stock);
        dto.Sold.Should().Be(metric.Sold);
        dto.FeaturedPoint.Should().Be(metric.FeaturedPoint);
    }

    [Fact]
    public void FromProduct_ImagesMapping_ShouldMapCorrectly()
    {
        // Arrange
        var product = CreateProductWithMetric();
        product.Images = new List<ProductImage>
        {
            new ProductImage { Id = 1, ProductId = 1, ImageUrl = "https://example.com/image1.jpg", OrderPriority = 1 },
            new ProductImage { Id = 2, ProductId = 1, ImageUrl = "https://example.com/image2.jpg", OrderPriority = 2 }
        };

        // Act
        var dto = ProductDetailDto.FromProduct(product);

        // Assert
        dto.Images.Should().HaveCount(2);
        dto.Images[0].Id.Should().Be(product.Images[0].Id);
        dto.Images[0].ImageUrl.Should().Be(product.Images[0].ImageUrl);
        dto.Images[0].OrderPriority.Should().Be(product.Images[0].OrderPriority);
        dto.Images[1].Id.Should().Be(product.Images[1].Id);
        dto.Images[1].ImageUrl.Should().Be(product.Images[1].ImageUrl);
        dto.Images[1].OrderPriority.Should().Be(product.Images[1].OrderPriority);
    }

    [Fact]
    public void FromProduct_AttributesMapping_ShouldMapCorrectly()
    {
        // Arrange
        var product = CreateProductWithMetric();
        var colorAttribute = new AttributeEntity { Id = 1, Name = "Color" };
        var sizeAttribute = new AttributeEntity { Id = 2, Name = "Size" };

        product.Attributes = new List<ProductAttribute>
        {
            new ProductAttribute
            {
                AttributeId = 1,
                Attribute = colorAttribute,
                OrderPriority = 1,
                IsPrimary = true,
                ProductAttributeValues = new List<ProductAttributeValue>
                {
                    new ProductAttributeValue { OrderPriority = 1, Value = "Red", ImageUrl = "https://example.com/red.jpg" },
                    new ProductAttributeValue { OrderPriority = 2, Value = "Blue", ImageUrl = "https://example.com/blue.jpg" }
                }
            },
            new ProductAttribute
            {
                AttributeId = 2,
                Attribute = sizeAttribute,
                OrderPriority = 2,
                IsPrimary = false,
                ProductAttributeValues = new List<ProductAttributeValue>
                {
                    new ProductAttributeValue { OrderPriority = 1, Value = "S", ImageUrl = null },
                    new ProductAttributeValue { OrderPriority = 2, Value = "M", ImageUrl = null }
                }
            }
        };

        // Act
        var dto = ProductDetailDto.FromProduct(product);

        // Assert
        dto.Attributes.Should().HaveCount(2);

        // First attribute check
        dto.Attributes[0].AttributeId.Should().Be(1);
        dto.Attributes[0].Name.Should().Be("Color");
        dto.Attributes[0].OrderPriority.Should().Be(1);
        dto.Attributes[0].IsPrimary.Should().BeTrue();
        dto.Attributes[0].Values.Should().HaveCount(2);
        dto.Attributes[0].Values[0].Value.Should().Be("Red");
        dto.Attributes[0].Values[0].ImageUrl.Should().Be("https://example.com/red.jpg");
        dto.Attributes[0].Values[1].Value.Should().Be("Blue");

        // Second attribute check
        dto.Attributes[1].AttributeId.Should().Be(2);
        dto.Attributes[1].Name.Should().Be("Size");
        dto.Attributes[1].IsPrimary.Should().BeFalse();
        dto.Attributes[1].Values.Should().HaveCount(2);
        dto.Attributes[1].Values[0].Value.Should().Be("S");
        dto.Attributes[1].Values[0].ImageUrl.Should().BeNull();
    }

    [Fact]
    public void FromProduct_VariantsMapping_ShouldMapCorrectly()
    {
        // Arrange
        var product = CreateProductWithMetric();

        var variantMetric1 = new VariantMetric { Id = 1, Stock = 10 };
        var variantMetric2 = new VariantMetric { Id = 2, Stock = 20 };

        product.Variants = new List<Variant>
        {
            new Variant
            {
                ProductId = 1,
                Price = 500,
                Sku = "VAR-001",
                Metric = variantMetric1,
                VariantAttributes = new List<VariantAttribute>
                {
                    new VariantAttribute { AttributeId = 1, Value = "Red" },
                    new VariantAttribute { AttributeId = 2, Value = "S" }
                }
            },
            new Variant
            {
                ProductId = 1,
                Price = 550,
                Sku = "VAR-002",
                Metric = variantMetric2,
                VariantAttributes = new List<VariantAttribute>
                {
                    new VariantAttribute { AttributeId = 1, Value = "Blue" },
                    new VariantAttribute { AttributeId = 2, Value = "M" }
                }
            }
        };

        // Act
        var dto = ProductDetailDto.FromProduct(product);

        // Assert
        dto.Variants.Should().HaveCount(2);

        // First variant check
        dto.Variants[0].ProductId.Should().Be(1);
        dto.Variants[0].Price.Should().Be(500);
        dto.Variants[0].Sku.Should().Be("VAR-001");
        dto.Variants[0].Stock.Should().Be(10);
        dto.Variants[0].VariantAttributes.Should().HaveCount(2);
        dto.Variants[0].VariantAttributes[0].AttributeId.Should().Be(1);
        dto.Variants[0].VariantAttributes[0].Value.Should().Be("Red");
        dto.Variants[0].VariantAttributes[1].AttributeId.Should().Be(2);
        dto.Variants[0].VariantAttributes[1].Value.Should().Be("S");

        // Second variant check
        dto.Variants[1].ProductId.Should().Be(1);
        dto.Variants[1].Price.Should().Be(550);
        dto.Variants[1].Sku.Should().Be("VAR-002");
        dto.Variants[1].Stock.Should().Be(20);
    }

    [Fact]
    public void VariantDto_IsSameId_ReturnsTrueForMatchingVariants()
    {
        // Arrange
        var variantDto = new VariantDto
        {
            ProductId = 1,
            VariantAttributes = new List<VariantAttributeDto>
            {
                new VariantAttributeDto { AttributeId = 1, Value = "Red" },
                new VariantAttributeDto { AttributeId = 2, Value = "S" }
            }
        };

        var variant = new Variant
        {
            ProductId = 1,
            VariantAttributes = new List<VariantAttribute>
            {
                new VariantAttribute { AttributeId = 1, Value = "Red" },
                new VariantAttribute { AttributeId = 2, Value = "S" }
            }
        };

        // Act
        var result = variantDto.IsSameId(variant);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void VariantDto_IsSameId_ReturnsFalseForNonMatchingVariants()
    {
        // Arrange
        var variantDto = new VariantDto
        {
            ProductId = 1,
            VariantAttributes = new List<VariantAttributeDto>
            {
                new VariantAttributeDto { AttributeId = 1, Value = "Red" },
                new VariantAttributeDto { AttributeId = 2, Value = "S" }
            }
        };

        var variant = new Variant
        {
            ProductId = 1,
            VariantAttributes = new List<VariantAttribute>
            {
                new VariantAttribute { AttributeId = 1, Value = "Red" },
                new VariantAttribute { AttributeId = 2, Value = "M" }  // Different value
            }
        };

        // Act
        var result = variantDto.IsSameId(variant);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void VariantDto_IsSameId_ReturnsFalseForDifferentProductId()
    {
        // Arrange
        var variantDto = new VariantDto
        {
            ProductId = 1,
            VariantAttributes = new List<VariantAttributeDto>
            {
                new VariantAttributeDto { AttributeId = 1, Value = "Red" },
                new VariantAttributeDto { AttributeId = 2, Value = "S" }
            }
        };

        var variant = new Variant
        {
            ProductId = 2,  // Different ProductId
            VariantAttributes = new List<VariantAttribute>
            {
                new VariantAttribute { AttributeId = 1, Value = "Red" },
                new VariantAttribute { AttributeId = 2, Value = "S" }
            }
        };

        // Act
        var result = variantDto.IsSameId(variant);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void VariantDto_IsSameId_ReturnsFalseForDifferentAttributeCount()
    {
        // Arrange
        var variantDto = new VariantDto
        {
            ProductId = 1,
            VariantAttributes = new List<VariantAttributeDto>
            {
                new VariantAttributeDto { AttributeId = 1, Value = "Red" },
                new VariantAttributeDto { AttributeId = 2, Value = "S" }
            }
        };

        var variant = new Variant
        {
            ProductId = 1,
            VariantAttributes = new List<VariantAttribute>
            {
                new VariantAttribute { AttributeId = 1, Value = "Red" }
                // Missing one attribute
            }
        };

        // Act
        var result = variantDto.IsSameId(variant);

        // Assert
        result.Should().BeFalse();
    }

    private Product CreateProductWithMetric()
    {
        var metric = new ProductMetric
        {
            Id = 1,
            LowestPrice = 500,
            Stock = 100,
            Sold = 20,
            RatingAvg = 4.5f,
            RatingCount = 10,
            FeaturedPoint = 3
        };

        return new Product
        {
            Id = 1,
            Slug = "test-product",
            Name = "Test Product",
            Sku = "TP-001",
            Status = ProductStatus.Active,
            ImageUrl = "https://example.com/image.jpg",
            CategoryId = 1,
            Description = "Test product description",
            Metric = metric,
            Images = new List<ProductImage>(),
            Attributes = new List<ProductAttribute>(),
            Variants = new List<Variant>()
        };
    }
}

using System;
using Application.Common.Abstraction;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace UnitTests;

public class TestFixture : IDisposable
{
    public Mock<DbContextAbstract> MockContext { get; private set; }
    public Mock<IUser> MockUser { get; private set; }

    public DbContextOptions<TestDbContext> DbOptions { get; private set; }
    public TestDbContext DbContext { get; private set; }

    public TestFixture()
    {
        MockContext = new Mock<DbContextAbstract>();
        MockUser = new Mock<IUser>();

        // Set up in-memory database for tests
        DbOptions = new DbContextOptionsBuilder<TestDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        DbContext = new TestDbContext(DbOptions);

        // Set up mock user
        MockUser.Setup(u => u.Id).Returns("test-user-id");

        // Seed the database
        DbContext.SeedTestData();
    }

    public void Dispose()
    {
        DbContext.Dispose();
    }

    // Helper method to create a product with all related data for testing
    public Product CreateTestProduct()
    {
        var metric = new ProductMetric
        {
            Id = 100,
            LowestPrice = 500,
            Stock = 100,
            Sold = 20,
            RatingAvg = 4.5f,
            RatingCount = 10,
            FeaturedPoint = 3
        };

        var colorAttribute = new AttributeEntity { Id = 3, Name = "Color" };
        var sizeAttribute = new AttributeEntity { Id = 4, Name = "Size" };

        var product = new Product
        {
            Id = 100,
            Slug = "test-complete-product",
            Name = "Test Complete Product",
            Sku = "TCP-001",
            Status = ProductStatus.Active,
            ImageUrl = "https://example.com/default.jpg",
            CategoryId = 1,
            Description = "Complete test product description",
            Metric = metric,
            Images = new List<ProductImage>
            {
                new ProductImage { Id = 101, ProductId = 100, ImageUrl = "https://example.com/img1.jpg", OrderPriority = 1 },
                new ProductImage { Id = 102, ProductId = 100, ImageUrl = "https://example.com/img2.jpg", OrderPriority = 2 }
            },
            Attributes = new List<ProductAttribute>
            {
                new ProductAttribute
                {
                    AttributeId = 3,
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
                    AttributeId = 4,
                    Attribute = sizeAttribute,
                    OrderPriority = 2,
                    IsPrimary = false,
                    ProductAttributeValues = new List<ProductAttributeValue>
                    {
                        new ProductAttributeValue { OrderPriority = 1, Value = "S", ImageUrl = null },
                        new ProductAttributeValue { OrderPriority = 2, Value = "M", ImageUrl = null }
                    }
                }
            }
        };

        var variantMetric1 = new VariantMetric { Id = 103, Stock = 50 };
        var variantMetric2 = new VariantMetric { Id = 104, Stock = 25 };

        product.Variants = new List<Variant>
        {
            new Variant
            {
                ProductId = 100,
                Price = 500,
                Sku = "VAR-001",
                Metric = variantMetric1,
                VariantAttributes = new List<VariantAttribute>
                {
                    new VariantAttribute { AttributeId = 3, Value = "Red" },
                    new VariantAttribute { AttributeId = 4, Value = "S" }
                }
            },
            new Variant
            {
                ProductId = 100,
                Price = 550,
                Sku = "VAR-002",
                Metric = variantMetric2,
                VariantAttributes = new List<VariantAttribute>
                {
                    new VariantAttribute { AttributeId = 3, Value = "Blue" },
                    new VariantAttribute { AttributeId = 4, Value = "M" }
                }
            }
        };

        return product;
    }
}

// In-memory test database context
public class TestDbContext : DbContextAbstract
{
    public TestDbContext(DbContextOptions<TestDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure relationships and constraints here if needed
    }

    public void SeedTestData()
    {
        // Create a parent category
        var parentCategory = new Category
        {
            Id = 1,
            Name = "Electronics",
            Slug = "electronics",
            Status = CategoryStatus.Active
        };

        // Create a child category
        var childCategory = new Category
        {
            Id = 2,
            Name = "Laptops",
            Slug = "laptops",
            ParentId = 1,
            Parent = parentCategory,
            Status = CategoryStatus.Active
        };

        Categories.Add(parentCategory);
        Categories.Add(childCategory);

        // Create products with metrics
        for (int i = 1; i <= 20; i++)
        {
            var metric = new ProductMetric
            {
                Id = i,
                Stock = 10 * i,
                Sold = i,
                RatingAvg = (float)(4.0 + (i % 5) * 0.2),
                LowestPrice = 100 * i,
                FeaturedPoint = i % 5,
                RatingCount = i * 2
            };

            ProductMetrics.Add(metric);

            var product = new Product
            {
                Id = i,
                Name = $"Product {i}",
                Sku = $"SKU-{i:D4}",
                CategoryId = i % 2 == 0 ? 2 : 1,
                Category = i % 2 == 0 ? childCategory : parentCategory,
                Description = $"Description for Product {i}",
                Status = i % 5 == 0 ? ProductStatus.Inactive : ProductStatus.Active,
                Created = DateTime.Now.AddDays(-i),
                Metric = metric,
                ImageUrl = $"https://example.com/product{i}.jpg",
                Slug = $"product-{i}",
                Variants = new List<Variant>(),
                Attributes = new List<ProductAttribute>(),
                Images = new List<ProductImage>()
            };

            Products.Add(product);
        }

        // Create attributes
        var colorAttribute = new AttributeEntity { Id = 1, Name = "Color" };
        var sizeAttribute = new AttributeEntity { Id = 2, Name = "Size" };

        AttributeEntities.Add(colorAttribute);
        AttributeEntities.Add(sizeAttribute);

        SaveChanges();
    }
}

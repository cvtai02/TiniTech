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
    }

    public void Dispose()
    {
        DbContext.Dispose();
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
                FeaturedPoint = i % 5
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
                Variants = new List<Variant>(),
                Attributes = new List<ProductAttribute>()
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

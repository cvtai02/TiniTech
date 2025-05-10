using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Catalog.Application.Common.Abstraction;
using Catalog.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using SharedKernel.Enums;
using SharedKernel.Interfaces;

namespace Catalog.Tests.Products;

public class TestFixture : IDisposable
{
    public Mock<DbContextAbstract> MockContext { get; private set; }
    public Mock<IUser> MockUser { get; private set; }

    public static IServiceScopeFactory _scopeFactory = null!;

    // public Mock<ISender> SenderMock { get; }

    public Mock<IImageService> MockImageService;
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
        DbContext.Database.EnsureCreated();
        DbContext.SeedTestData();

        // Set up mock user
        MockUser.Setup(u => u.Id).Returns("test-user-id");

        // Set up mock image service
        MockImageService = new Mock<IImageService>();
        MockImageService.Setup(x => x.UploadImageAsync(It.IsAny<IFormFile>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync("test-url");
        MockImageService.Setup(x => x.RemoveImageAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(true);

        MockImageService.Setup(x => x.RemoveImageAsync(It.IsAny<string>()))
            .ReturnsAsync(true);

        MockImageService.Setup(x => x.UploadImageListAsync(It.IsAny<List<IFormFile>>(), It.IsAny<string>()))
            .ReturnsAsync((List<IFormFile> files, string container) =>
            {
                // Get the count of files
                int fileCount = files.Count;

                // Generate a list of URLs based on the count
                return Enumerable.Range(1, fileCount)
                    .Select(i => $"https://storage.example.com/{container}/image{i}.jpg")
                    .ToList();
            });
        MockImageService.Setup(x => x.AllowImageContentTypes)
            .Returns(new List<string> { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml", });



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
                Status = i % 5 == 0 ? ProductStatus.Draft : ProductStatus.Active,
                Created = DateTimeOffset.Now.AddDays(-i),
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
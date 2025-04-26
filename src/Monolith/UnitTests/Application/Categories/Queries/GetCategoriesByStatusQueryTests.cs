using Application.Categories.Queries;
using Application.Common.Abstraction;
using Domain.Entities;
using Domain.Enums;
using MockQueryable.Moq;

namespace UnitTests.Categories.Queries;

public class GetCategoriesByStatusQueryTests
{
    private readonly Mock<DbContextAbstract> _mockContext;
    private readonly List<Category> _testCategories;

    public GetCategoriesByStatusQueryTests()
    {
        _mockContext = new Mock<DbContextAbstract>();

        // Create test data
        _testCategories = new List<Category>
        {
            new Category { Id = 1, Name = "Electronics", Description = "Electronic devices", Slug = "electronics", Status = CategoryStatus.Active, ParentId = null },
            new Category { Id = 2, Name = "Laptops", Description = "Laptop computers", Slug = "laptops", Status = CategoryStatus.Active, ParentId = 1 },
            new Category { Id = 3, Name = "Phones", Description = "Mobile phones", Slug = "phones", Status = CategoryStatus.Active, ParentId = 1 },
            new Category { Id = 4, Name = "Gaming", Description = "Gaming devices", Slug = "gaming", Status = CategoryStatus.Inactive, ParentId = null },
            new Category { Id = 5, Name = "Consoles", Description = "Gaming consoles", Slug = "consoles", Status = CategoryStatus.Inactive, ParentId = 4 }
        };

        var mockDbSet = _testCategories.AsQueryable().BuildMockDbSet();
        _mockContext.Setup(c => c.Categories).Returns(mockDbSet.Object);
    }

    [Fact]
    public async Task Handle_WhenStatusIsNull_ShouldReturnAllRootCategories()
    {
        // Arrange
        var query = new GetCategoriesByStatusQuery { Status = null };
        var handler = new GetCategoriesByStatusQueryHandler(_mockContext.Object);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().HaveCount(2); // Only root categories (Electronics and Gaming)
        result.Value.Select(c => c.Id).Should().Contain(new[] { 1, 4 });
    }

    [Fact]
    public async Task Handle_WhenStatusIsActive_ShouldReturnOnlyActiveRootCategories()
    {
        // Arrange
        var query = new GetCategoriesByStatusQuery { Status = CategoryStatus.Active };
        var handler = new GetCategoriesByStatusQueryHandler(_mockContext.Object);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().HaveCount(1); // Only the active root category (Electronics)
        result.Value.First().Id.Should().Be(1);
    }

    [Fact]
    public async Task Handle_ShouldBuildCorrectCategoryHierarchy()
    {
        // Arrange
        var query = new GetCategoriesByStatusQuery { Status = null };
        var handler = new GetCategoriesByStatusQueryHandler(_mockContext.Object);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();

        var electronics = result.Value.FirstOrDefault(c => c.Id == 1);
        electronics.Should().NotBeNull();
        electronics!.Subcategories.Should().HaveCount(2);
        electronics.Subcategories.Select(c => c.Id).Should().Contain(new[] { 2, 3 });

        var gaming = result.Value.FirstOrDefault(c => c.Id == 4);
        gaming.Should().NotBeNull();
        gaming!.Subcategories.Should().HaveCount(1);
        gaming.Subcategories.First().Id.Should().Be(5);
    }
}

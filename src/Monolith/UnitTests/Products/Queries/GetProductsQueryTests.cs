using Application.Products.Queries.Enums;
using Application.Products.Queries.GetProducts;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace UnitTests.Products.Queries;

public class GetProductsQueryTests : IClassFixture<TestFixture>
{
    private readonly TestFixture _fixture;

    public GetProductsQueryTests(TestFixture fixture)
    {
        _fixture = fixture;

        // Ensure database is clean and seeded for each test
        _fixture.DbContext.Database.EnsureDeleted();
        _fixture.DbContext.Database.EnsureCreated();
        _fixture.DbContext.SeedTestData();
    }

    [Fact]
    public async Task Handle_WithDefaultQuery_ShouldReturnFirstPageOfTenProducts()
    {
        // Arrange
        var query = new GetProductsQuery();
        var handler = new GetProductsQueryHandler(_fixture.DbContext);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Items.Count.Should().Be(10);
        result.Value.TotalCount.Should().Be(20);
        result.Value.PageNumber.Should().Be(1);
        result.Value.TotalPages.Should().Be(2);

        // Verify ordering (default is by creation date descending)
        var firstProduct = result.Value.Items.First();
        firstProduct.Id.Should().Be(1);
    }

    [Fact]
    public async Task Handle_WithSearchParameter_ShouldFilterProducts()
    {
        // Arrange
        var query = new GetProductsQuery { Search = "Product 1" };
        var handler = new GetProductsQueryHandler(_fixture.DbContext);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Items.Should().AllSatisfy(p => p.Name.Should().Contain("Product 1"));
    }

    [Fact]
    public async Task Handle_WithCategoryFilter_ShouldReturnProductsInCategory()
    {
        // Arrange
        var query = new GetProductsQuery { CategorySlug = "laptops" };
        var handler = new GetProductsQueryHandler(_fixture.DbContext);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Items.Should().NotBeEmpty();
    }

    [Fact]
    public async Task Handle_WithStatusFilter_ShouldReturnProductsWithMatchingStatus()
    {
        // Arrange
        var query = new GetProductsQuery { Status = new List<ProductStatus> { ProductStatus.Inactive } };
        var handler = new GetProductsQueryHandler(_fixture.DbContext);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Items.Should().AllSatisfy(p => p.Status.Should().Be(ProductStatus.Inactive));
    }

    [Fact]
    public async Task Handle_WithPriceOrdering_ShouldOrderProductsByPrice()
    {
        // Arrange
        var query = new GetProductsQuery
        {
            OrderBy = OrderCriteria.Price,
            OrderDirection = OrderDirection.Ascending
        };
        var handler = new GetProductsQueryHandler(_fixture.DbContext);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Items.Should().BeInAscendingOrder(p => p.Price);
    }

    [Fact]
    public async Task Handle_WithPagination_ShouldReturnRequestedPage()
    {
        // Arrange
        var query = new GetProductsQuery
        {
            PageNumber = 2,
            PageSize = 5
        };
        var handler = new GetProductsQueryHandler(_fixture.DbContext);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Items.Count.Should().Be(5);
        result.Value.PageNumber.Should().Be(2);
        result.Value.TotalPages.Should().Be(4);
    }
}

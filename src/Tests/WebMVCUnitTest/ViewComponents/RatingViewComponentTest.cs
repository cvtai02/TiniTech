using Microsoft.AspNetCore.Mvc.ViewComponents;
using Microsoft.Extensions.Logging;
using Moq;
using SharedKernel.Models;
using WebMVC.Services.Abstractions;
using WebMVC.ViewComponents.Base;
using WebSharedModels.Dtos.Rating;

namespace WebMVC.ViewComponents;

public class RatingViewComponentTest
{
    private readonly Mock<IRatingService> _ratingServiceMock;
    private readonly Mock<ILogger<BaseViewComponent<ProductRatingQuery>>> _loggerMock;
    private readonly Rating _ratingViewComponent;

    public RatingViewComponentTest()
    {
        _ratingServiceMock = new Mock<IRatingService>();
        _loggerMock = new Mock<ILogger<BaseViewComponent<ProductRatingQuery>>>();
        _ratingViewComponent = new Rating(_ratingServiceMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task GetView_ReturnsViewWithRatings()
    {
        // Arrange
        var query = new ProductRatingQuery { ProductId = 1 };

        var userRatings = new List<UserRatingDto>()
        {

            new () {
                UserId = "abc",
                UserName = "John Doe",
                ProductId = 1,
                Rating = 5,
                Comment = "Excellent!",
                CreatedAt = DateTime.UtcNow
            },
            new () {
                UserId = "abc",
                UserName = "John Doe",
                ProductId = 1,
                Rating = 5,
                Comment = "Excellent!",
                CreatedAt = DateTime.UtcNow
            }
        };


        var ratings = new ProductRatingDto
        {
            new() { Ratings =new PaginatedList<UserRatingDto>(userRatings, 2,3,2)},
        };
        _ratingServiceMock.Setup(s => s.GetByProduct(query)).ReturnsAsync(ratings);

        // Act
        var result = await _ratingViewComponent.GetView(query);

        // Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(result);
        Assert.Equal(ratings, viewResult.ViewData.Model);
    }

    [Fact]
    public async Task InvokeAsync_HandlesExceptionAndReturnsErrorView()
    {
        // Arrange
        var query = new ProductRatingQuery { ProductId = 1 };
        _ratingServiceMock.Setup(s => s.GetByProduct(query)).ThrowsAsync(new System.Exception("Test exception"));

        // Act
        var result = await _ratingViewComponent.InvokeAsync(query);

        // Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(result);
        Assert.Equal("/Views/Shared/Components/Error/ErrorComponent.cshtml", viewResult.ViewName);
        Assert.NotNull(viewResult.ViewData.Model);
    }
}

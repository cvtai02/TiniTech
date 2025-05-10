using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Catalog.EndPoints.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SharedKernel.Exceptions;
using SharedKernel.Models;
using Xunit;
using Catalog.Application.Common.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Catalog.Tests.Endpoints.BaseApi;
public class ApiControllerTests
{
    private class TestApiController : ApiController
    {
        public TestApiController(ISender sender) : base(sender) { }

        public IActionResult TestHandleFailure<T>(Result<T> result)
        {
            return HandleFailure(result);
        }
    }

    [Fact]
    public void HandleFailure_ShouldThrowInvalidOperationException_WhenResultIsSuccess()
    {
        // Arrange
        var senderMock = new Mock<ISender>();
        var controller = new TestApiController(senderMock.Object);
        var result = new Result<string>("Success");

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => controller.TestHandleFailure(result));
    }

    [Fact]
    public void HandleFailure_ShouldReturnBadRequest_WhenFluentValidationExceptionOccurs()
    {
        // Arrange
        var senderMock = new Mock<ISender>();
        var controller = new TestApiController(senderMock.Object);
        var validationException = new FluentValidationException(new List<FluentValidation.Results.ValidationFailure>()
        {
            new FluentValidation.Results.ValidationFailure("PropertyName", "ErrorMessage")
        });
        var result = new Result<string>(validationException);

        // Act
        var response = controller.TestHandleFailure(result) as BadRequestObjectResult;

        // Assert
        Assert.NotNull(response);
        Assert.Equal(StatusCodes.Status400BadRequest, response.StatusCode);
    }

    [Fact]
    public void HandleFailure_ShouldReturnBadRequest_WhenAbstractExceptionOccurs()
    {
        // Arrange
        var senderMock = new Mock<ISender>();
        var controller = new TestApiController(senderMock.Object);
        var abstractException = new AbstractException("Title", 400, "Message");
        var result = new Result<string>(abstractException);

        // Act
        var response = controller.TestHandleFailure(result) as BadRequestObjectResult;

        // Assert
        Assert.NotNull(response);
        Assert.Equal(StatusCodes.Status400BadRequest, response.StatusCode);
    }

    [Fact]
    public void HandleFailure_ShouldReturnBadRequest_WhenUndefinedExceptionOccurs()
    {
        // Arrange
        var senderMock = new Mock<ISender>();
        var controller = new TestApiController(senderMock.Object);
        var genericException = new Exception("Generic error");
        var result = new Result<string>(genericException);

        // Act
        var response = controller.TestHandleFailure(result) as ObjectResult;

        // Assert
        Assert.NotNull(response);
        Assert.Equal(StatusCodes.Status500InternalServerError, response.StatusCode);
    }
}

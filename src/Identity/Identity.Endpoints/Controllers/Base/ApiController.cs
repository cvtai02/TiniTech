using Identity.Core.Application.Common.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SharedKernel.Models;

namespace Api.Controllers.Base;

[ApiController]
public abstract class ApiController : ControllerBase
{
    protected readonly ISender Sender;
    protected ApiController(ISender sender)
    {
        Sender = sender;
    }

    protected IActionResult HandleFailure<T>(Result<T> result)
    {

        if (result.Exception is FluentValidationException validationException)
        {
            return BadRequest(
                CreateProblemDetails(
                    "Validation Error", StatusCodes.Status400BadRequest,
                    validationException,
                    validationException.Errors));
        }

        if (result.IsSuccess)
        {
            throw new InvalidOperationException();
        }

        return BadRequest(
            CreateProblemDetails(
                "Bad Request",
                StatusCodes.Status400BadRequest,
                result.Exception));
    }

    private static ProblemDetails CreateProblemDetails(
            string title,
            int status,
            Exception error,
            IDictionary<string, string[]>? errors = null) =>
            new()
            {
                Title = title,
                // Type = error.Code,
                Detail = error.Message,
                Status = status,
                Extensions = { { nameof(errors), errors } }
            };

}

using Catalog.Application.Common.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.Endpoints;


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
        if (result.IsSuccess)
        {
            throw new InvalidOperationException("Result is not a failure.");
        }
        if (result.Exception is FluentValidationException validationException)
        {
            return BadRequest(
                CreateProblemDetails(
                    validationException.Errors.Values.First().First(), StatusCodes.Status400BadRequest,
                    validationException,
                    validationException.Errors));
        }

        if (result.Exception is AbstractException abstractException)
        {
            return BadRequest(
                CreateProblemDetails(
                    abstractException.Title,
                    abstractException.StatusCode,
                    abstractException));


        }

        return BadRequest(
            CreateProblemDetails(
                "Something went wrong",
                StatusCodes.Status500InternalServerError,
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
                Status = status,
                // Type = error.Code,
                Detail = error.Message,
                Extensions = { { nameof(errors), errors } }
            };

}

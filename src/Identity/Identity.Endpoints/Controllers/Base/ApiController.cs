using CrossCutting.Exceptions;
using Identity.Core.Application.Common.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SharedKernel.Models;

namespace Identity.Endpoints.Controllers;

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

        Console.WriteLine($"Handling failure for {typeof(T).Name}");
        if (result.Exception is FluentValidationException validationException)
        {
            return BadRequest(
                CreateProblemDetails(
                    "Validation Error", StatusCodes.Status400BadRequest,
                    validationException,
                    validationException.Errors));
        }

        if (result.Exception is EmailExistedException e)
        {
            return BadRequest(
                CreateProblemDetails(
                    e.Message, StatusCodes.Status409Conflict,
                    e));
        }

        if (result.Exception is InvalidPasswordException ipe)
        {
            return BadRequest(
                CreateProblemDetails(
                    "Wrong Password", StatusCodes.Status401Unauthorized,
                    ipe));
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

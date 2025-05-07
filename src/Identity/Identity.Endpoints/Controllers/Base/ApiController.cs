using CrossCutting.Exceptions;
using Identity.Core.Application.Common.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SharedKernel.Exceptions;
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
                    validationException.Errors.Values.First().First(), StatusCodes.Status400BadRequest,
                    validationException,
                    validationException.Errors));
        }

        if (result.Exception is EmailExistedException e)
        {
            return BadRequest(
                CreateProblemDetails(
                   "Email existed", StatusCodes.Status409Conflict));
        }

        if (result.Exception is InvalidPasswordException ipe)
        {
            return BadRequest(
                CreateProblemDetails(
                    "Wrong Password", StatusCodes.Status400BadRequest));
        }

        if (result.Exception is NotFoundException nfe)
        {
            return BadRequest(
                CreateProblemDetails(
                    nfe.Message, StatusCodes.Status400BadRequest,
                    nfe));
        }

        return BadRequest(
            CreateProblemDetails(
                "unexpected error",
                StatusCodes.Status400BadRequest,
                result.Exception));
    }

    private static ProblemDetails CreateProblemDetails(
            string title,
            int status,
            Exception? error = null,
            IDictionary<string, string[]>? errors = null) =>
            new()
            {
                Title = title,
                Detail = error?.Message,
                Status = status,
                Extensions = { { nameof(errors), errors } }
            };

}

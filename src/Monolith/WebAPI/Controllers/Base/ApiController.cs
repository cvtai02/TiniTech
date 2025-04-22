using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Exceptions;
using Application.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Base;


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
                    "Validation Error", StatusCodes.Status400BadRequest,
                    validationException,
                    validationException.Errors));
        }


        if (result.Exception is KeyNotFoundException keyNotFoundException)
        {
            return NotFound(
                CreateProblemDetails(
                    "Not Found",
                    StatusCodes.Status404NotFound,
                    keyNotFoundException));
        }

        if (result.Exception is RestrictDeleteException restrictDeleteException)
        {
            return NotFound(
                CreateProblemDetails(
                    restrictDeleteException.Message,
                    StatusCodes.Status400BadRequest,
                    restrictDeleteException));
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
                Status = status,
                // Type = error.Code,
                Detail = error.Message,
                Extensions = { { nameof(errors), errors } }
            };

}

using System.Diagnostics;
using CrossCutting.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.ExceptionHandlers;
public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger, IHostEnvironment environment) : IExceptionHandler
{
    private const bool IsLastStopInPipeline = true;

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext,
        Exception exception, CancellationToken cancellationToken)
    {
        var traceId = Activity.Current?.Id ?? httpContext.TraceIdentifier;
        logger.LogError(exception, "Could not process a request on machine {MachineName} with trace id {TraceId}",
            Environment.MachineName, traceId);

        (int statusCode, string title) = MapException(exception);

        var problemDetails = new ProblemDetails
        {
            Title = title,
            Status = statusCode,
            Extensions = { ["traceId"] = traceId },
            Instance = $"{httpContext.Request.Method} {httpContext.Request.Path}"
        };
        if (!environment.IsProduction())
        {
            problemDetails.Detail = exception.Message + "\n" + exception.InnerException?.Message;
        }

        httpContext.Response.StatusCode = statusCode;

        await httpContext.Response
            .WriteAsJsonAsync(problemDetails, cancellationToken);
        return IsLastStopInPipeline;
    }

    private static (int statusCode, string title) MapException(Exception exception)
    {
        return exception switch
        {
            NotFoundException => (StatusCodes.Status404NotFound, exception.Message),
            ValidationException => (StatusCodes.Status400BadRequest, exception.Message),
            UnauthorizedAccessException => (StatusCodes.Status403Forbidden, $"Forbidden: {exception.Message}"),
            InvalidOperationException e => (StatusCodes.Status400BadRequest, e.Message),
            ArgumentOutOfRangeException e => (StatusCodes.Status400BadRequest, $"{e.ParamName} is out of range"),
            ArgumentNullException e => (StatusCodes.Status400BadRequest, $"{e.ParamName} cannot be null"),
            ArgumentException e => (StatusCodes.Status400BadRequest, $"{e.ParamName}:  {exception.Message}"),
            DbUpdateException when exception.InnerException is SqlException sqlEx && (sqlEx.Number == 2627 || sqlEx.Number == 2601) =>
            (StatusCodes.Status409Conflict, "Unique Constraint Violation"),

            _ => (StatusCodes.Status500InternalServerError, "Unexpected Error")
        };
    }
}
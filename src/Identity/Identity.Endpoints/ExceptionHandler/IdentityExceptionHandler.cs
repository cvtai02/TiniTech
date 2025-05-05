using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using Identity.Core.Application.Common.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Identity.Endpoints.ExceptionHandler;
public class IdentityExceptionHandler(ILogger<IdentityExceptionHandler> logger, IHostEnvironment environment) : IExceptionHandler
{
    private const bool IsLastStopInPipeline = true;

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext,
        Exception exception, CancellationToken cancellationToken)
    {
        var traceId = Activity.Current?.Id ?? httpContext.TraceIdentifier;
        logger.LogError(exception, "Could not process a request on machine {MachineName} with trace id {TraceId}",
            Environment.MachineName, traceId);

        (int statusCode, string title) = MapException(exception);
        if (statusCode == 0)
        {
            return false; // Not handled here
        }

        var problemDetails = new ProblemDetails
        {
            Title = title,
            Status = statusCode,
            Extensions = { ["traceId"] = traceId },
            Instance = $"{httpContext.Request.Method} {httpContext.Request.Path}"
        };
        if (!environment.IsProduction())
        {
            problemDetails.Detail = exception.Message;
        }

        await httpContext.Response
            .WriteAsJsonAsync(problemDetails, cancellationToken);
        return IsLastStopInPipeline;
    }

    private static (int statusCode, string title) MapException(Exception exception)
    {
        return exception switch
        {
            EmailExistedException e => (409, e.Message),
            _ => (0, "") //signal that we don't want to handle this exception
        };
    }
}
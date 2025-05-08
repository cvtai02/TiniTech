using CrossCutting.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using WebMVC.Exceptions;
using WebMVC.Models;

namespace WebMVC.ExceptionFilters;

public class GlobalExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        var metadataProvider = new EmptyModelMetadataProvider();

        Console.WriteLine("GlobalExceptionFilter: " + context.Exception.ToString());

        // Set result for API controllers
        if (context.HttpContext.Request.Path.StartsWithSegments("/api"))
        {
            if (context.Exception is ApiError e)
            {
                context.Result = new JsonResult(new
                {
                    title = e.Response.Title,
                    detail = e.Response.Detail,
                    status = e.Response.Status
                })
                {
                    StatusCode = e.Response.Status
                };
            }
            else
            {
                context.Result = new JsonResult(new
                {
                    title = "Unkown error",
                    detail = context.Exception.Message
                })
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
        else // For MVC controllers
        {
            ErrorViewModel v = context.Exception switch
            {
                ApiError ex => new(ex.Response.Status, ex.Response.Title, ex.Response.Detail),
                NotFoundException => new(StatusCodes.Status404NotFound, "Not Found"),
                ValidationException => new(StatusCodes.Status400BadRequest, context.Exception.Message),
                ApiReachFailedException => new(StatusCodes.Status503ServiceUnavailable, "Something went wrong"),
                DeserializeException => new(StatusCodes.Status503ServiceUnavailable, "Something went wrong", context.Exception.Message),
                _ => new(StatusCodes.Status500InternalServerError, "Internal Server Error")
            };


            context.Result = new ViewResult
            {
                ViewName = "Error",
                ViewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), context.ModelState)
                {

                    Model = v,
                }
            };
        }

        context.ExceptionHandled = true;
    }
}
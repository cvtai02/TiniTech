using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CrossCutting.Exceptions;
using Microsoft.AspNetCore.Mvc;
using WebMVC.Exceptions;
using WebMVC.Models;

namespace WebMVC.ViewComponents.Base;

public abstract class BaseViewComponent<T> : ViewComponent
{
    protected readonly ILogger<BaseViewComponent<T>> _logger;
    public BaseViewComponent(ILogger<BaseViewComponent<T>> logger)
    {
        _logger = logger;
    }

    public virtual async Task<IViewComponentResult> InvokeAsync(T parameters)
    {
        try
        {
            return await GetView(parameters);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in ViewComponent: {ViewComponent}", GetType().Name);
            ErrorViewModel v = ex switch
            {
                NotFoundException => new(StatusCodes.Status404NotFound, "Not Found"),
                ValidationException => new(StatusCodes.Status400BadRequest, ex.Message),
                ApiReachFailedException => new(StatusCodes.Status503ServiceUnavailable, "Something went wrong", ex.Message),
                ApiError e => new(e.Response.Status, e.Response.Title, e.Response.Detail),
                _ => new(StatusCodes.Status500InternalServerError, "Internal Server Error", ex.Message)
            };

            return View("/Views/Shared/Components/Error/ErrorComponent.cshtml", v);
        }
    }

    public abstract Task<IViewComponentResult> GetView(T parameters);
}

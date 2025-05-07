using Catalog.Application.Categories.Commands;
using Catalog.Application.Categories.Commands.ActivateCategory;
using Catalog.Application.Categories.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SharedKernel.Enums;
using WebSharedModels.Dtos.Common;

namespace Catalog.EndPoints.Controllers;

[Route("api/categories")]
public class CategoryController : ApiController
{
    private readonly ILogger<CategoryController> _logger;

    public CategoryController(ILogger<CategoryController> logger, ISender sender) : base(sender)
    {
        _logger = logger;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateCategoryCommand cmd)
    {
        var result = await Sender.Send(cmd);

        return result.Match(
            r => CreatedAtAction(nameof(Get), new Response
            {
                Title = "Category Created",
                Status = 200,
                Detail = "Category Created",
                Data = r,
            }),
            e => HandleFailure<CreateCategoryCommand>(e)
        );
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update([FromBody] UpdateCategoryCommand cmd)
    {
        var result = await Sender.Send(cmd);

        return result.Match(
            r => Ok(new Response
            {
                Title = "Category Updated",
                Status = 200,
                Detail = "Category Updated",
                Data = r,
            }),
            e => HandleFailure<UpdateCategoryCommand>(e)
        );
    }

    public record PatchCategoryStatus(int Id, CategoryStatus Status);
    [HttpPatch("status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Del([FromBody] PatchCategoryStatus body)
    {
        Console.WriteLine(body.Status);
        if (body.Status == CategoryStatus.Deleted)
        {
            var result = await Sender.Send(new SoftDeleteCategoryCommand { Id = body.Id });

            return result.Match(
                r => Ok(new Response
                {
                    Title = "Category Deleted",
                    Status = 200,
                    Detail = "Category Status Changed to Deleted",
                    Data = r,
                }),
                e => HandleFailure<SoftDeleteCategoryCommand>(e)
            );
        }
        else if (body.Status == CategoryStatus.Active)
        {
            var result = await Sender.Send(new ActivateCategoryCommand { Id = body.Id });

            return result.Match(
                r => Ok(new Response
                {
                    Title = "Category Restored",
                    Status = 200,
                    Detail = "Category Status Changed to Active",
                    Data = r,
                }),
                e => HandleFailure<ActivateCategoryCommand>(e)
            );
        }
        else return BadRequest(new Response
        {
            Title = "Bad Request",
            Status = 200,
            Detail = "Invalid Category Status",
            Data = null,
        });
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] GetCategoriesByStatusQuery query)
    {
        var result = await Sender.Send(query);

        return result.Match(
            r => Ok(new Response
            {
                Title = "Ok",
                Status = 200,
                Detail = "Categories Retrieved",
                Data = r,
            }),
            e => HandleFailure<GetCategoriesByStatusQuery>(e)
        );
    }

}

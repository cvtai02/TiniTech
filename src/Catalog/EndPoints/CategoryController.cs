using Application.Categories.Queries;
using Catalog.Application.Categories.Commands;
using Catalog.Application.Categories.Commands.ActivateCategory;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebSharedModels.Dtos.Common;

namespace Catalog.Endpoints;

[Route("api/categories")]
public class CategoryController : ApiController
{
    private readonly ILogger<CategoryController> _logger;

    public CategoryController(ILogger<CategoryController> logger, ISender sender) : base(sender)
    {
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryCommand cmd)
    {
        var result = await Sender.Send(cmd);

        return result.Match(
            r => CreatedAtAction(nameof(Get), new Response
            {
                Title = "Category Created",
                Status = "Success",
                Detail = "Category Created",
                Data = r,
                Errors = null
            }),
            e => HandleFailure<CreateCategoryCommand>(e)
        );
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateCategoryCommand cmd)
    {
        var result = await Sender.Send(cmd);

        return result.Match(
            r => Ok(new Response
            {
                Title = "Category Updated",
                Status = "Success",
                Detail = "Category Updated",
                Data = r,
                Errors = null
            }),
            e => HandleFailure<UpdateCategoryCommand>(e)
        );
    }

    public record PatchCategoryStatus(int Id, CategoryStatus Status);
    [HttpPatch("status")]
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
                    Status = "Success",
                    Detail = "Category Status Changed to Deleted",
                    Data = r,
                    Errors = null
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
                    Status = "Success",
                    Detail = "Category Status Changed to Active",
                    Data = r,
                    Errors = null
                }),
                e => HandleFailure<ActivateCategoryCommand>(e)
            );
        }
        else return BadRequest(new Response
        {
            Title = "Bad Request",
            Status = "Error",
            Detail = "Invalid Category Status",
            Data = null,
            Errors = new[] { "Invalid Category Status" }
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
                Status = "Success",
                Detail = "Categories Retrieved",
                Data = r,
                Errors = null
            }),
            e => HandleFailure<GetCategoriesByStatusQuery>(e)
        );
    }

}

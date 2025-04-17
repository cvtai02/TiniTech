using Application.Categories.Commands;
using Application.Categories.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Controllers.Base;

namespace WebAPI.Controllers;

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

    [HttpDelete("{id}")]
    public async Task<IActionResult> Del(int id)
    {
        var result = await Sender.Send(new DeleteCategoryCommand { Id = id });

        return result.Match(
            r => Ok(new Response
            {
                Title = "Category Deleted",
                Status = "Success",
                Detail = "Category Deleted",
                Data = r,
                Errors = null
            }),
            e => HandleFailure<DeleteCategoryCommand>(e)
        );
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await Sender.Send(new GetAllCategoriesQuery());

        return result.Match(
            r => Ok(new Response
            {
                Title = "Ok",
                Status = "Success",
                Detail = "Categories Retrieved",
                Data = r,
                Errors = null
            }),
            e => HandleFailure<GetAllCategoriesQuery>(e)
        );
    }

}

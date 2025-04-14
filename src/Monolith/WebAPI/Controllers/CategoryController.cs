using Application.Categories.Commands.Create;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Controllers.Base;

namespace WebAPI.Controllers;

[Route("api/category")]
[Authorize]
public class CategoryController : ApiController
{
    private readonly ILogger<CategoryController> _logger;

    public CategoryController(ILogger<CategoryController> logger, ISender sender) : base(sender)
    {
        _logger = logger;
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateCategoryCommand cmd)
    {
        var result = await Sender.Send(cmd);

        return result.Match(
            r => Ok(new Response
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

}

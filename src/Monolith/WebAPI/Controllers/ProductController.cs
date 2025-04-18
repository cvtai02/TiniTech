using Application.Products.Commands.CreateProductCommand;
using Application.Products.Commands.DeleteProductCommand;
using Application.Products.Queries.GetDetailBySlug;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Controllers.Base;

namespace WebAPI.Controllers;

[Route("api/products")]
public class ProductController : ApiController
{
    private readonly ILogger<ProductController> _logger;

    public ProductController(ILogger<ProductController> logger, ISender sender) : base(sender)
    {
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductCommand cmd)
    {
        var result = await Sender.Send(cmd);

        return result.Match(
            r => CreatedAtAction(nameof(GetBySlug), new { id = r }, new Response
            {
                Title = "Product Created",
                Status = "Success",
                Detail = "Product Created Successfully",
                Data = r,
                Errors = null
            }),
            e => HandleFailure<CreateProductCommand>(e)
        );
    }

    // [HttpPut("{id}")]
    // public async Task<IActionResult> Update(int id, [FromBody] UpdateProductCommand cmd)
    // {
    //     if (id != cmd.Id)
    //     {
    //         return BadRequest(new Response
    //         {
    //             Title = "Bad Request",
    //             Status = "Error",
    //             Detail = "ID in URL must match ID in request body",
    //             Data = null,
    //             Errors = new[] { "ID mismatch" }
    //         });
    //     }

    //     var result = await Sender.Send(cmd);

    //     return result.Match(
    //         r => Ok(new Response
    //         {
    //             Title = "Product Updated",
    //             Status = "Success",
    //             Detail = "Product Updated Successfully",
    //             Data = r,
    //             Errors = null
    //         }),
    //         e => HandleFailure<UpdateProductCommand>(e)
    //     );
    // }

    [HttpDelete("{slug}")]
    public async Task<IActionResult> Delete(string slug)
    {
        var result = await Sender.Send(new DeleteProductCommand { Slug = slug });

        return result.Match(
            r => Ok(new Response
            {
                Title = "Product Deleted",
                Status = "Success",
                Detail = "Product Deleted Successfully",
                Data = r,
                Errors = null
            }),
            e => HandleFailure<DeleteProductCommand>(e)
        );
    }



    [HttpGet("{id}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var result = await Sender.Send(new GetProductDetailBySlug { Slug = slug });

        return result.Match(
            r => Ok(new Response
            {
                Title = "Ok",
                Status = "Success",
                Detail = "Product Retrieved Successfully",
                Data = r,
                Errors = null
            }),
            e => HandleFailure<GetProductDetailBySlug>(e)
        );
    }
}

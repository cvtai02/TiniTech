using Application.Products.Commands.ActivateProductCommand;
using Application.Products.Commands.CreateProductCommand;
using Application.Products.Commands.UpdateProductImages;
using Application.Products.Commands.UpdateProductInfo;
using Application.Products.Queries.GetDetailBySlug;
using Application.Products.Queries.GetProducts;
using Domain.Enums;
using MediatR;
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
    public async Task<IActionResult> Create([FromForm] CreateProductCommand cmd)
    {
        Console.WriteLine("CreateProductCommand: " + cmd.ToString());
        var result = await Sender.Send(cmd);

        return result.Match(
            r => CreatedAtAction(nameof(GetBySlug), new { slug = r }, new Response
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

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateProductInfoCommand cmd)
    {
        var result = await Sender.Send(cmd);

        return result.Match(
            r => Ok(new Response
            {
                Title = "Product Updated",
                Status = "Success",
                Detail = "Product Updated Successfully",
                Data = r,
                Errors = null
            }),
            e => HandleFailure<UpdateProductInfoCommand>(e)
        );
    }

    [HttpPatch("images")]
    public async Task<IActionResult> UpdateImages([FromForm] UpdateProductImagesCommand cmd)
    {
        var result = await Sender.Send(cmd);

        return result.Match(
            r => Ok(new Response
            {
                Title = "Product Images Updated",
                Status = "Success",
                Detail = "Product Images Updated Successfully",
                Data = r,
                Errors = null
            }),
            e => HandleFailure<UpdateProductImagesCommand>(e)
        );
    }

    [HttpPatch("status")]
    public async Task<IActionResult> UpdateStatus([FromBody] UpdateProductStatusCommand body)
    {

        var result = await Sender.Send(body);

        return result.Match(
            r => Ok(new Response
            {
                Title = "Product Status Updated",
                Status = "Success",
                Detail = "Product status changed to " + body.Status.ToString(),
                Data = r,
                Errors = null
            }),
            e => HandleFailure<UpdateProductStatusCommand>(e)
        );

    }

    [HttpGet("{slug}")]
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


    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] GetProductsQuery query)
    {
        var result = await Sender.Send(query);

        return result.Match(
            r => Ok(new Response
            {
                Title = "Ok",
                Status = "Success",
                Detail = "Search Products Retrieved Successfully",
                Data = r,
                Errors = null
            }),
            e => HandleFailure<GetProductsQuery>(e)
        );
    }
}

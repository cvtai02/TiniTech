using Catalog.Application.Products.Commands.ActivateProductCommand;
using Catalog.Application.Products.Commands.CreateProductCommand;
using Catalog.Application.Products.Commands.UpdateProductImages;
using Catalog.Application.Products.Commands.UpdateProductInfo;
using Catalog.Application.Products.Queries.GetBySku;
using Catalog.Application.Products.Queries.GetDetailBySlug;
using Catalog.Application.Products.Queries.GetProducts;
using Catalog.Application.Products.Queries.GetRelated;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebSharedModels.Dtos.Common;

namespace Catalog.EndPoints.Controllers;

[Route("api/products")]
public class ProductController : ApiController
{
    private readonly ILogger<ProductController> _logger;

    public ProductController(ILogger<ProductController> logger, ISender sender) : base(sender)
    {
        _logger = logger;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromForm] CreateProductCommand cmd)
    {
        Console.WriteLine("CreateProductCommand: " + cmd.ToString());
        var result = await Sender.Send(cmd);

        return result.Match(
            r => CreatedAtAction(nameof(GetBySlug), new { slug = r }, new Response<string>
            {
                Title = "Product Created",
                Status = 200,
                Detail = "Product Created Successfully",
                Data = r,
            }),
            e => HandleFailure<CreateProductCommand>(e)
        );
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update([FromBody] UpdateProductInfoCommand cmd)
    {
        var result = await Sender.Send(cmd);

        return result.Match(
            r => Ok(new Response
            {
                Title = "Product Updated",
                Status = 200,
                Detail = "Product Updated Successfully",
                Data = r,
            }),
            e => HandleFailure<UpdateProductInfoCommand>(e)
        );
    }

    [HttpPatch("images")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateImages([FromForm] UpdateProductImagesCommand cmd)
    {
        var result = await Sender.Send(cmd);

        return result.Match(
            r => Ok(new Response
            {
                Title = "Product Images Updated",
                Status = 200,
                Detail = "Product Images Updated Successfully",
                Data = r,
            }),
            e => HandleFailure<UpdateProductImagesCommand>(e)
        );
    }

    [HttpPatch("status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus([FromBody] UpdateProductStatusCommand body)
    {

        var result = await Sender.Send(body);

        return result.Match(
            r => Ok(new Response
            {
                Title = "Product Status Updated",
                Status = 200,
                Detail = "Product status changed to " + body.Status.ToString(),
                Data = r,
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
                Status = 200,
                Detail = "Product Retrieved Successfully",
                Data = r,
            }),
            e => HandleFailure<GetProductDetailBySlug>(e)
        );
    }

    [HttpGet("related")]
    public async Task<IActionResult> GetRelated([FromQuery] GetProductRelatedQuery query)
    {
        var result = await Sender.Send(query);

        return result.Match(
            r => Ok(new Response
            {
                Title = "Ok",
                Status = 200,
                Detail = "Related Products Retrieved Successfully",
                Data = r,
            }),
            e => HandleFailure<GetProductRelatedQuery>(e)
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
                Status = 200,
                Detail = "Search Products Retrieved Successfully",
                Data = r,
            }),
            e => HandleFailure<GetProductsQuery>(e)
        );
    }

    [HttpGet("sku-search")]
    public async Task<IActionResult> SearchBySku([FromQuery] string q)
    {
        var result = await Sender.Send(new GetListBySkuQuery() { Sku = q });

        return result.Match(
            r => Ok(new Response
            {
                Title = "Ok",
                Status = 200,
                Detail = "Search Products Retrieved Successfully",
                Data = r,
            }),
            e => HandleFailure<GetProductsQuery>(e)
        );
    }
}

using Catalog.Application.AttributeEntities.Commands.CreatAttribute;
using Catalog.Application.AttributeEntities.Commands.DeleteAttribute;
using Catalog.Application.AttributeEntities.Queries.GetAll;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebSharedModels.Dtos.Common;

namespace Catalog.EndPoints.Controllers;

[Route("api/attributes")]
public class AttributeController : ApiController
{
    private readonly ILogger<AttributeController> _logger;

    public AttributeController(ILogger<AttributeController> logger, ISender sender) : base(sender)
    {
        _logger = logger;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateAttributeCommand cmd)
    {
        var result = await Sender.Send(cmd);

        return result.Match(
            r => CreatedAtAction(nameof(Get), new Response
            {
                Title = "Attribute Created",
                Status = 201,
                Detail = "Attribute Created",
                Data = r,
            }),
            e => HandleFailure<CreateAttributeCommand>(e)
        );
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Del(int id)
    {
        var result = await Sender.Send(new DeleteAttributeCommand { Id = id });

        return result.Match(
            r => Ok(new Response
            {
                Title = "Attribute Deleted",
                Status = 200,
                Detail = "Attribute Deleted",
                Data = r,
            }),
            e => HandleFailure<DeleteAttributeCommand>(e)
        );
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await Sender.Send(new GetAllAttributesQuery());

        return result.Match(
            r => Ok(new Response
            {
                Title = "Ok",
                Status = 200,
                Detail = "Attributes Retrieved",
                Data = r,
            }),
            e => HandleFailure<GetAllAttributesQuery>(e)
        );
    }


}

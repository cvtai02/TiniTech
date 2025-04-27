using Application.AttributeEntities.Commands.CreatAttribute;
using Application.AttributeEntities.Commands.DeleteAttribute;
using Application.AttributeEntities.Queries.GetAll;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SharedViewModels.Common;
using WebAPI.Controllers.Base;

namespace WebAPI.Controllers;

[Route("api/attributes")]
public class AttributeController : ApiController
{
    private readonly ILogger<AttributeController> _logger;

    public AttributeController(ILogger<AttributeController> logger, ISender sender) : base(sender)
    {
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAttributeCommand cmd)
    {
        var result = await Sender.Send(cmd);

        return result.Match(
            r => CreatedAtAction(nameof(Get), new Response
            {
                Title = "Attribute Created",
                Status = "Success",
                Detail = "Attribute Created",
                Data = r,
                Errors = null
            }),
            e => HandleFailure<CreateAttributeCommand>(e)
        );
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Del(int id)
    {
        var result = await Sender.Send(new DeleteAttributeCommand { Id = id });

        return result.Match(
            r => Ok(new Response
            {
                Title = "Attribute Deleted",
                Status = "Success",
                Detail = "Attribute Deleted",
                Data = r,
                Errors = null
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
                Status = "Success",
                Detail = "Attributes Retrieved",
                Data = r,
                Errors = null
            }),
            e => HandleFailure<GetAllAttributesQuery>(e)
        );
    }


}

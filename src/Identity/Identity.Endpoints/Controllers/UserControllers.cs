using Api.Controllers.Base;
using Identity.Core.Application.Users.Queries.GetUsers;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebSharedModels.Dtos.Common;

namespace Identity.Endpoints.Controllers;

public class UserControllers : ApiController
{
    public UserControllers(ISender sender) : base(sender)
    {
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers([FromQuery] GetUsersQuery query)
    {
        var result = await Sender.Send(query);

        if (result.Count == 0)
        {
            return NotFound(new Response
            {
                Title = "No Users Found",
                Status = "Not Found",
                Detail = "No Users Found",
                Data = null,
                Errors = null
            });
        }

        return Ok(new Response
        {
            Title = "Users Found",
            Status = "Success",
            Detail = "Users Found",
            Data = result,
            Errors = null
        });
    }

}

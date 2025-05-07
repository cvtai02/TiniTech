using Identity.Core.Application.Users.Queries.GetUsers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebSharedModels.Dtos.Common;

namespace Identity.Endpoints.Controllers;

[Route("api/users")]
public class UserControllers : ApiController
{
    public UserControllers(ISender sender) : base(sender)
    {
    }

    [HttpGet()]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsers([FromQuery] GetUsersQuery query)
    {
        var result = await Sender.Send(query);

        if (result.TotalCount == 0)
        {
            return NotFound(new Response
            {
                Title = "No Users Found",
                Status = 404,
                Detail = "No Users Found",
                Data = null,
            });
        }

        return Ok(new Response
        {
            Title = "Users Found",
            Status = 200,
            Detail = "Users Found",
            Data = result,
        });
    }

}

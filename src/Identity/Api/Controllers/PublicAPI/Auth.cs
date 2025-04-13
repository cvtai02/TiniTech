using Api.Controllers.Base;
using Application.Auth.Commands.Register;
using Application.Auth.Queries.Login;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("api/auth")]
public class Auth : ApiController
{
    private readonly ILogger<Auth> _logger;

    public Auth(ILogger<Auth> logger, ISender sender) : base(sender)
    {
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginQuery req)
    {
        var result = await Sender.Send(req);

        return result.Match(
            r => Ok(new Response
            {
                Title = "Login Success",
                Status = "Success",
                Detail = "Login Success",
                Data = r,
                Errors = null
            }),
            e => HandleFailure<RegisterCommand>(e)
        );

    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand info)
    {
        var result = await Sender.Send(info);
        return result.Match(
            id => Created($"/{nameof(User)}/{id}", new Response
            {
                Title = "User Created",
                Status = "Created",
                Detail = "User Created Successfully",
                Data = new { id },
                Errors = null
            }),
            e => HandleFailure<RegisterCommand>(e)
        );
    }
}
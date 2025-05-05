using Identity.Core.Application.Auth.Commands.Register;
using Identity.Core.Application.Auth.Queries.Login;
using Identity.Core.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebSharedModels.Dtos.Common;
using WebSharedModels.Dtos.Identity;

namespace Identity.Endpoints.Controllers;

[Route("api/auth")]
public class Auth : ApiController
{
    private readonly ILogger<Auth> _logger;
    private readonly ITokenService _tokenService;

    public Auth(ILogger<Auth> logger, ISender sender, ITokenService tokenS) : base(sender)
    {
        _logger = logger;
        _tokenService = tokenS;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginForm req)
    {
        var result = await Sender.Send(new LoginQuery(req));

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
    public async Task<IActionResult> Register([FromBody] RegisterForm info)
    {
        var result = await Sender.Send(new RegisterCommand(info));
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

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        // get token from cookie or header
        var token = Request.Headers.Authorization.ToString().Replace("Bearer ", "");
        var result1 = 0;
        var result2 = 0;
        if (!string.IsNullOrEmpty(token))
        {
            result1 = await _tokenService.InvalidateToken(token);
        }

        token = Request.Cookies["access_token"];
        if (!string.IsNullOrEmpty(token))
        {
            result2 = await _tokenService.InvalidateToken(token);
        }

        if (result1 > 0 || result2 > 0)
        {
            return Ok(new Response
            {
                Title = "Logout Success",
                Status = "Success",
                Detail = "Logout Success",
                Data = null,
            });
        }
        else
        {
            return BadRequest(new Response
            {
                Title = "Logout Failed",
                Status = "Failed",
                Detail = "Token not found",
                Data = null,
            });
        }
    }
}
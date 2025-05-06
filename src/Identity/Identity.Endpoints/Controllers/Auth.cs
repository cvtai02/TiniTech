using Identity.Core.Application.Auth.Commands.Register;
using Identity.Core.Application.Auth.Queries.Login;
using Identity.Core.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
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

        // set cookie
        if (result.IsSuccess && result.Value != null)
        {
            var token = result.Value.AccessToken;
            var refreshToken = result.Value.RefreshToken;
            var accessExpiresTime = result.Value.AccessTokenExpiresTime;
            var refreshExpiresTime = result.Value.RefreshTokenExpiresTime;
            Response.Cookies.Append("access_token", token, new CookieOptions
            {
                HttpOnly = true,
                Expires = accessExpiresTime,
                Secure = true, // Set to true in production
                SameSite = SameSiteMode.Strict,
                Path = "/",
            });
            if (refreshToken != null)
            {
                Response.Cookies.Append("refresh_token", refreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Expires = refreshExpiresTime,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Path = "/",
                });
            }
        }

        return result.Match(
            r => Ok(new Response
            {
                Title = "Login Success",
                Status = "Success",
                Detail = "Login Success",
                Data = new LoginResponse
                {
                    IsAuthenticated = true,
                    AccessTokenExpiresTime = r.AccessTokenExpiresTime,
                    RefreshTokenExpiresTime = r.RefreshTokenExpiresTime,
                    User = r.User,
                },
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

        var token = Request.Cookies["access_token"];
        if (string.IsNullOrEmpty(token))
        {
            return BadRequest(new Response
            {
                Title = "Logout Failed",
                Status = "Not Found",
                Detail = "Token not found",
                Data = null,
            });
        }
        else
        {
            var result = await _tokenService.InvalidateToken(token);

            if (result == 0)
            {
                return BadRequest(new Response
                {
                    Title = "Logout Failed",
                    Status = "Failed",
                    Detail = "Logout Failed",
                    Data = null,
                });
            }

            Response.Cookies.Delete("access_token", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Path = "/",
            });


            return Ok(new Response
            {
                Title = "Logout Success",
                Status = "Success",
                Detail = "Logout Success",
                Data = null,
            });
        }
    }
}
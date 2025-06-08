using Microsoft.AspNetCore.Mvc;
using WebMVC.Services.Abstractions;
using WebSharedModels.Dtos.Common;
using WebSharedModels.Dtos.Identity;

namespace WebMVC.Controllers;

public class AccountController : Controller
{
    private readonly IAuthService _authService;

    public AccountController(IAuthService authService)
    {
        _authService = authService;

    }

    [HttpGet("/account/login")]
    public IActionResult Login()
    {
        return View();
    }

    [HttpPost("/api/account/login")]
    public async Task<IActionResult> PostLogin([FromBody] LoginForm model)
    {

        var response = await _authService.Login(model, default);
        if (response != null && response.Data != null && response.Data.IsAuthenticated)
        {
            // Set the authentication cookie or token here

            return Ok(response);
        }
        else
        {
            return BadRequest(response);
        }
    }

    [HttpGet("/account/register")]
    public IActionResult Register()
    {
        return View();
    }
    [HttpPost("/api/account/register")]
    public async Task<IActionResult> PostRegister([FromBody] RegisterForm model)
    {
        var response = await _authService.Register(model, default);
        if (response == null)
        {
            return BadRequest(new Response
            {
                Title = "Unknown Error",
                Status = 500,
                Detail = "Unknown Error",
                Data = null,
            });
        }
        if (response.Status == 201)
        {
            return Ok(response);
        }
        return BadRequest(response);
    }
    [HttpPost("/api/account/logout")]
    public IActionResult Logout()
    {
        var response = _authService.Logout(default).Result;
        if (response == null)
        {
            return StatusCode(500, "Something went wrong");
        }
        if (response.Status == 200)
        {
            return Ok(response);
        }
        return BadRequest(response);
    }


}




// [Route("api/account")]
// public class AccountApiController : ControllerBase
// {
//     private readonly IAuthService _authService;

//     public AccountApiController(IAuthService authService)
//     {
//         _authService = authService;
//     }

//     [HttpPost("login")]
//     public async Task<IActionResult> PostLogin([FromBody] LoginForm model)
//     {

//         var response = await _authService.Login(model, default);
//         if (response != null && response.Data != null && response.Data.IsAuthenticated)
//         {
//             // Set the authentication cookie or token here

//             return Ok(response);
//         }
//         else
//         {
//             return BadRequest(response);
//         }
//     }

//     [HttpPost("logout")]
//     public IActionResult Logout()
//     {
//         var response = _authService.Logout(default).Result;
//         if (response == null)
//         {
//             return StatusCode(500, "Something went wrong");
//         }
//         if (response.Status == 200)
//         {
//             return Ok(response);
//         }
//         return BadRequest(response);
//     }

//     [HttpPost("register")]
//     public IActionResult PostRegister([FromBody] RegisterForm model)
//     {
//         var response = _authService.Register(model, default).Result;
//         if (response == null)
//         {
//             return BadRequest(new Response
//             {
//                 Title = "Unknown Error",
//                 Status = 500,
//                 Detail = "Unknown Error",
//                 Data = null,
//                 Errors = null
//             });
//         }
//         if (response.Status == 201)
//         {
//             return Ok(response);
//         }
//         return BadRequest(response);
//     }
// }
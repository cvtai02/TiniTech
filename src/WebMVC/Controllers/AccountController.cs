using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebMVC.Services.Abstractions;
using WebSharedModels.Dtos.Common;
using WebSharedModels.Dtos.Identity;

namespace WebMVC.Controllers;

[Route("account")]
public class AccountController : Controller
{
    private readonly IAuthService _authService;

    public AccountController(IAuthService authService)
    {
        _authService = authService;

    }

    [HttpGet("login")]
    public IActionResult Login()
    {
        return View();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginForm model)
    {

        var response = await _authService.Login(model, default);
        if (response != null && response.Data != null && response.Data.IsAuthenticated)
        {
            return Ok(response);
        }
        else
        {
            return Unauthorized(response);
        }
    }

    [HttpGet("register")]
    public IActionResult Register()
    {
        return View();
    }
    [HttpPost("register")]
    public IActionResult Register(RegisterForm model)
    {
        var response = _authService.Register(model, default).Result;
        if (response == null)
        {
            return StatusCode(500, "Something went wrong");
        }
        if (response.Status == "Success")
        {
            return RedirectToAction("Login", "Account");
        }
        return BadRequest(response);
    }
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var response = _authService.Logout(default).Result;
        if (response == null)
        {
            return StatusCode(500, "Something went wrong");
        }
        if (response.Status == "Success")
        {
            return Ok(response);
        }
        return BadRequest(response);
    }


}

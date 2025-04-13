using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.AuthApi;

[Route("api/auth/test")]
public class Test : Controller
{
    private readonly ILogger<Test> _logger;

    public Test(ILogger<Test> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    [Route("index")]
    [Authorize]
    public IActionResult AuthorizeTest()
    {
        _logger.LogInformation("Test endpoint hit at {time}", DateTime.UtcNow);
        return Ok();
    }

}

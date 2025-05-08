using Microsoft.AspNetCore.Mvc;

namespace WebMVC.Controllers;

[Route("order")]
public class OrderController : Controller
{
    private readonly ILogger<OrderController> _logger;

    public OrderController(ILogger<OrderController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }


}

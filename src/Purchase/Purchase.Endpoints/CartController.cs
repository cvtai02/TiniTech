using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Purchase.Endpoint;

[Route("cart")]
public class CartController : Controller
{
    private readonly ILogger<CartController> _logger;

    public CartController(ILogger<CartController> logger)
    {
        _logger = logger;
    }
   
}

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebMVC.Services.Base;
using WebSharedModels.Dtos.Orders;

namespace WebMVC.Controllers;

public class CheckoutController : Controller
{
    private readonly ILogger<CheckoutController> _logger;
    private readonly ApiService _apiService;

    public CheckoutController(ILogger<CheckoutController> logger, ApiService apiService)
    {
        _apiService = apiService;
        _logger = logger;
    }

    [HttpPost("api/checkout")]
    public async Task<IActionResult> PlacedOrder([FromBody] CreateOrderDto data)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // TODO: Implement actual order creation logic with your service
            // This is a placeholder that returns a mock successful response
            var response = await _apiService.PostDataAsync<CreateOrderDto, int>("orders", data);

            return CreatedAtAction(nameof(PlacedOrder), new { id = response.Data }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error placing order");
            return StatusCode(500, new { title = "Failed to process order", error = ex.Message });
        }
    }
}

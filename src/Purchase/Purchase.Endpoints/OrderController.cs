using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Purchase.Core.Services.OrderServices;
using Purchase.Core.Services.OrderServices.CreateOrder;
using Purchase.Core.Services.OrderServices.Dtos;
using SharedKernel.Enums;
using WebSharedModels.Dtos.Orders;

namespace Purchase.Endpoints;

[Route("orders")]
public class OrderController : ControllerBase
{
    private readonly ILogger<OrderController> _logger;
    private readonly CreateOrder _createOrder;
    private readonly GetOrders _getOrders;
    private readonly UpdateOrderStatus _updateOrderStatus;
    private readonly GetUserOrders _getUserOrders;


    public OrderController(ILogger<OrderController> logger,
        CreateOrder createOrder,
        GetOrders getOrders,
        UpdateOrderStatus updateOrderStatus,
        GetUserOrders getUserOrders)
    {
        _logger = logger;
        _createOrder = createOrder;
        _getOrders = getOrders;
        _updateOrderStatus = updateOrderStatus;
        _getUserOrders = getUserOrders;
    }

    [HttpGet]
    public async Task<IActionResult> GetdProcessingOrders([FromQuery] GetOrdersQuery query)
    {
        var orders = await _getOrders.Handle(query);
        return Ok(orders);
    }


    [HttpPatch("fulfill/{orderId}")]
    public IActionResult FullfillOrder(int orderId)
    {
        var order = _updateOrderStatus.Handle(orderId, OrderStatus.Fulfilled);
        return Ok(order);
    }

    [HttpPatch("cancell/{orderId}")]
    public IActionResult CancellOrder(int orderId)
    {
        var order = _updateOrderStatus.Handle(orderId, OrderStatus.Cancelled);
        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto orderDto)
    {
        var orderId = await _createOrder.Handle(orderDto);
        return CreatedAtAction(nameof(GetdProcessingOrders), new { id = orderId }, orderId);
    }

}

using System.Text;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        // Ghi lại method và path
        _logger.LogInformation("Incoming request: {Method} {Path}", context.Request.Method, context.Request.Path);

        // Ghi lại headers
        foreach (var header in context.Request.Headers)
        {
            _logger.LogInformation("Header: {Key}: {Value}", header.Key, header.Value);
        }

        // Ghi lại body (nếu có)
        context.Request.EnableBuffering(); // Cho phép đọc nhiều lần

        if (context.Request.ContentLength > 0 && context.Request.Body.CanRead)
        {
            using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, detectEncodingFromByteOrderMarks: false, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            context.Request.Body.Position = 0; // Reset lại vị trí

            _logger.LogInformation("Body: {Body}", body);
        }

        // Tiếp tục request pipeline
        await _next(context);
    }
}

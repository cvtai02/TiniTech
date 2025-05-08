namespace WebMVC.Models;

public class ErrorViewModel
{
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;

    public ErrorViewModel(int statusCode, string message, string detail = "")
    {
        StatusCode = statusCode;
        Message = message;
        Detail = detail;
    }
}

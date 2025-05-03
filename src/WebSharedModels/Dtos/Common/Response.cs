namespace WebSharedModels.Dtos.Common;


public class Response
{
    public string Title { get; set; } = "Success";
    public string Status { get; set; } = "200 OK";
    public string Detail { get; set; } = "Request was successful.";
    public object? Data { get; set; }
    public object[]? Errors { get; set; } = null;
}


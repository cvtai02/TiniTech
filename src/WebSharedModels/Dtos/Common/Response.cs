namespace WebSharedModels.Dtos.Common;

public class Response
{
    public string Title { get; set; } = "";
    public int Status { get; set; }
    public string Detail { get; set; } = "";
    public object? Data { get; set; }
}

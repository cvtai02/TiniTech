namespace WebSharedModels.Dtos.Common;

public class Response<T>
{
    public string Title { get; set; } = "";
    public int Status { get; set; }
    public string Detail { get; set; } = "";
    public T? Data { get; set; } = default; // default(T) provides the default value for type T
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Controllers.Base;

public class Response
{
    public string Title { get; set; } = "Success";
    public string Status { get; set; } = "200 OK";
    public string Detail { get; set; } = "Request was successful.";
    public object? Data { get; set; } = null;
    public object[]? Errors { get; set; } = null;
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebSharedModels.Dtos.Common;

namespace WebMVC.Exceptions;

public class ApiError : Exception
{
    public Response Response { get; set; } = new Response();
    public ApiError(Response res)
    {
        Response = res;
    }


}

using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Exceptions.Base;

namespace Application.Common.Exceptions;

public class DbException : AbstractException
{
    public DbException(string detail) : base("Something went wrong.", 500, detail)
    {
    }
    public DbException(string tile, int statusCode, string detail) : base(tile, statusCode, detail)
    {
    }
}

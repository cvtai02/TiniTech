using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CrossCutting.Extensions;

public static class DateTimeOffsetExtension
{
    public static string ToYymmddhhmmss(this DateTimeOffset dateTime)
    {
        return dateTime.ToString("yyMMddHHmmss");
    }
}

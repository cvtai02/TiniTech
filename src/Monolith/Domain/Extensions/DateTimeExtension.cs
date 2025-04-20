using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Extensions;

public static class DateTimeExtension
{
    /// <summary>
    /// Formats the DateTime to "yymmddhhmmss" format
    /// </summary>
    /// <param name="dateTime">The DateTime to format</param>
    /// <returns>The formatted string in "yymmddhhmmss" format</returns>
    public static string ToYymmddhhmmss(this DateTime dateTime)
    {
        return dateTime.ToString("yyMMddHHmmss");
    }
}

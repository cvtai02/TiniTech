using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Extensions;

public static class CurrencyExtensions
{
    public static string FormatUSD(this decimal value)
    {
        return string.Format(new CultureInfo("en-US"), "${0:N2}", value);
    }

    public static string FormatVND(this decimal value)
    {
        // Format with thousands separator and no decimal places
        return string.Format(new CultureInfo("vi-VN"), "{0:N0}₫", value);
    }
}

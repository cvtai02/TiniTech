using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Views.Helpers;
public static class CurrencyHelper
{
    /// <summary>
    /// Formats a decimal value as USD currency
    /// </summary>
    /// <param name="value">The decimal value to format</param>
    /// <returns>Formatted USD string with $ symbol</returns>
    public static string FormatUSD(decimal value)
    {
        return string.Format(new CultureInfo("en-US"), "${0:N2}", value);
    }

    /// <summary>
    /// Formats a decimal value as VND currency
    /// </summary>
    /// <param name="value">The decimal value to format</param>
    /// <returns>Formatted VND string with ₫ symbol</returns>
    public static string FormatVND(decimal value)
    {
        // Format with thousands separator and no decimal places
        return string.Format(new CultureInfo("vi-VN"), "{0:N0}₫", value);
    }
}
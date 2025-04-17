using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Application.Extensions;

public static class StringExtensions
{
    /// <summary>
    /// Converts a Vietnamese string to a URL-friendly slug
    /// </summary>
    /// <param name="text">The Vietnamese text to convert</param>
    /// <param name="randomNumber">Maximum length of the slug (optional)</param>
    /// <returns>A URL-friendly slug</returns>
    public static string ToSlug(this string text, int? randomNumber = null)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        // Convert to lowercase
        var normalizedString = text.ToLowerInvariant();

        // Remove Vietnamese accents and diacritics
        normalizedString = RemoveVietnameseAccents(normalizedString);

        // Replace spaces with hyphens
        normalizedString = Regex.Replace(normalizedString, @"\s+", "-");

        // Remove non-alphanumeric characters except hyphens
        normalizedString = Regex.Replace(normalizedString, @"[^a-z0-9\-]", "");

        // Remove duplicate hyphens
        normalizedString = Regex.Replace(normalizedString, @"-+", "-");

        // Remove leading and trailing hyphens
        normalizedString = normalizedString.Trim('-');

        // Apply max length if specified
        if (randomNumber.HasValue)
            normalizedString = randomNumber.ToString() + '-' + normalizedString;

        return normalizedString;
    }

    /// <summary>
    /// Removes Vietnamese accents and diacritical marks
    /// </summary>
    private static string RemoveVietnameseAccents(string text)
    {
        var decomposed = text.Normalize(NormalizationForm.FormD);
        var result = new StringBuilder();

        // Special Vietnamese character replacements
        var vietnameseReplacements = new Dictionary<char, string>
        {
            {'đ', "d"}, {'Đ', "D"},
            {'ă', "a"}, {'Ă', "A"},
            {'â', "a"}, {'Â', "A"},
            {'ê', "e"}, {'Ê', "E"},
            {'ô', "o"}, {'Ô', "O"},
            {'ơ', "o"}, {'Ơ', "O"},
            {'ư', "u"}, {'Ư', "U"}
        };

        foreach (var c in decomposed)
        {
            if (vietnameseReplacements.TryGetValue(c, out string? replacement))
            {
                result.Append(replacement);
            }
            else if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
            {
                result.Append(c);
            }
        }

        return result.ToString().Normalize(NormalizationForm.FormC);
    }
}
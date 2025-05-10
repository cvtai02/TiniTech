using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Net.Http.Headers;
using WebMVC.Exceptions;
using WebSharedModels.Dtos.Common;

namespace WebMVC.Services.Base;

public class ApiService
{
    private readonly HttpClient _httpClient;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ApiService(HttpClient httpClient, IHttpContextAccessor httpContextAccessor)
    {
        _httpClient = httpClient;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Response<T>> GetDataAsync<T>(string endpoint, CancellationToken cancellationToken = default)
    {
        Console.WriteLine($"Getting data from {endpoint}");
        HttpResponseMessage response;
        try
        {
            response = await _httpClient.GetAsync(endpoint, cancellationToken);
        }
        catch (Exception ex)
        {
            throw new ApiReachFailedException("Internal Server Error", ex);
        }

        var result = await ValidateResponseAsync<T>(response);
        return result;
    }

    public async Task<Response<TResponse>> PostDataAsync<TRequest, TResponse>(string endpoint, TRequest data, CancellationToken cancellationToken = default)
    {
        //get access token from the httpContext cookies
        var accessToken = _httpContextAccessor.HttpContext?.Request.Cookies["access_token"];
        if (accessToken != null)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }
        else
        {
            _httpClient.DefaultRequestHeaders.Authorization = null;
        }

        HttpResponseMessage response;

        try
        {
            response = await _httpClient.PostAsJsonAsync(endpoint, data, cancellationToken);
        }
        catch (Exception ex)
        {
            throw new ApiReachFailedException("Can not connect to api server", ex);
        }


        var result = await ValidateResponseAsync<TResponse>(response);

        //set cookies from the auth response
        if (response.Headers.TryGetValues("Set-Cookie", out var rsCookies))
        {
            foreach (var rawCookie in rsCookies)
            {
                // Optional: parse cookie name and value for better control
                var cookieParts = SetCookieHeaderValue.ParseList(new List<string> { rawCookie });
                foreach (var cookie in cookieParts)
                {
                    if (cookie.Name.Value == null || cookie.Value.Value == null)
                    {
                        continue;
                    }
                    _httpContextAccessor.HttpContext?.Response.Cookies.Append(
                        cookie.Name.Value,
                        cookie.Value.Value,
                        new CookieOptions
                        {
                            Path = "/",
                            HttpOnly = cookie.HttpOnly,
                            Secure = cookie.Secure,
                            Expires = cookie.Expires?.UtcDateTime
                        }
                    );
                }
            }
        }

        return result;
    }

    /// <summary>
    /// deserialize and return data.    
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="response"></param>
    /// <returns></returns>
    /// <exception cref="DeserializeException"></exception>
    /// <exception cref="ApiError"></exception>
    private static async Task<Response<T>> ValidateResponseAsync<T>(HttpResponseMessage response)
    {

        if (response == null)
        {
            throw new ApiReachFailedException("Internal Server Error");
        }



        var jsonString = await response.Content.ReadAsStringAsync();
        Response<T>? responseDto;
        if (jsonString == null)
        {
            throw new DeserializeException("No body data is return.", new Exception(jsonString));
        }

        try
        {

            responseDto = JsonSerializer.Deserialize<Response<T>>(jsonString, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() },
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
            });
        }
        catch
        {
            if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                throw new ApiError(new Response()
                {
                    Status = (int)response.StatusCode,
                    Title = "Unauthorized",
                    Detail = "Unauthorized",
                });
            }

            if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            {
                throw new ApiError(new Response()
                {
                    Status = (int)response.StatusCode,
                    Title = "Forbidden",
                    Detail = "Forbidden",
                });
            }

            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                throw new ApiError(new Response()
                {
                    Status = (int)response.StatusCode,
                    Title = "Not Found",
                    Detail = "Not Found",
                });
            }

            throw new DeserializeException("Failed to deserialize response body.", new Exception(jsonString));
        }


        if (response.IsSuccessStatusCode)
        {
#pragma warning disable CS8603 // Possible null reference return.
            return responseDto;
#pragma warning restore CS8603 // Possible null reference return.
        }
        else
        {
            if (responseDto != null)
            {
                throw new ApiError(new Response()
                {
                    Status = (int)response.StatusCode,
                    Title = responseDto.Title,
                    Detail = responseDto.Detail,
                });
            }

            throw new ApiError(new Response()
            {
                Status = (int)response.StatusCode,
                Title = "Unknown error",
                Detail = "Unknown error",
            });
        }
    }

    public string BaseUrl
    {
        get => _httpClient.BaseAddress?.ToString() ?? string.Empty;
        set => _httpClient.BaseAddress = new Uri(value);
    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
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
        //get cookies from the request and set them in the httpClient
        var cookies = _httpContextAccessor.HttpContext?.Request.Cookies;
        if (cookies != null)
        {
            foreach (var cookie in cookies)
            {
                _httpClient.DefaultRequestHeaders.Add("Cookie", $"{cookie.Key}={cookie.Value}");
            }
        }
        HttpResponseMessage response;

        try
        {
            response = await _httpClient.PostAsJsonAsync(endpoint, data, cancellationToken);
        }
        catch (Exception ex)
        {
            throw new ApiReachFailedException("Internal Server Error", ex);
        }

        var result = await ValidateResponseAsync<TResponse>(response);
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
        var jsonString = await response.Content.ReadAsStringAsync();
        var responseDto = JsonSerializer.Deserialize<Response<T>>(jsonString, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() }
        }) ?? throw new DeserializeException("Failed to deserialize response body.", new Exception(jsonString));

        if (response.IsSuccessStatusCode)
        {
            return responseDto;
        }
        else
        {
            throw new ApiError(responseDto.Title, new Exception(responseDto.Detail));
        }

    }

    public string BaseUrl
    {
        get => _httpClient.BaseAddress?.ToString() ?? string.Empty;
        set => _httpClient.BaseAddress = new Uri(value);
    }
}

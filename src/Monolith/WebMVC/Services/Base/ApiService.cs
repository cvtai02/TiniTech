using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace WebMVC.Services.Base;

public class ApiService
{
    private readonly HttpClient _httpClient;

    public ApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<T> GetDataAsync<T>(string endpoint)
    {
        HttpResponseMessage response = await _httpClient.GetAsync(endpoint);
        if (response.IsSuccessStatusCode)
        {
            var jsonString = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(jsonString, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() }
            }) ?? throw new Exception("Failed to deserialize response body.");
        }
        else
        {
            throw new Exception($"API call failed: {response.StatusCode}");
        }
    }

    public async Task<TResponse> PostDataAsync<TRequest, TResponse>(string endpoint, TRequest data)
    {
        HttpResponseMessage response = await _httpClient.PostAsJsonAsync(endpoint, data);
        if (response.IsSuccessStatusCode)
        {
            var jsonString = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<TResponse>(jsonString, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? throw new Exception("Failed to deserialize response body.");
        }
        else
        {
            throw new Exception($"API call failed: {response.StatusCode}");
        }
    }
}

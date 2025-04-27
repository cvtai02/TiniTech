using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using WebMVC.Services.Abstractions;
using WebMVC.Services.Base;
using WebMVC.Services.Specifications;

namespace WebMVC.Services;

public static class DependencyInjection
{
    public static void AddDataServices(this IHostApplicationBuilder builder)
    {
        builder.Services.AddScoped<ICategoryService, CategoryService>();
        builder.Services.AddHttpClient<ApiService>(client =>
        {
            client.BaseAddress = new Uri(builder.Configuration["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException("BaseUrl"));
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        });

    }
}

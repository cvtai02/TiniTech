using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Rating.Core.Usecases.Queries;
using Rating.Core.UseCases.Commands;

namespace Rating.Core;

public static class DependencyInjection
{
    public static void AddRatingCore(this IHostApplicationBuilder builder)
    {
        builder.Services.AddScoped<GetProductRating>();
        builder.Services.AddScoped<SubmitRating>();
    }
}
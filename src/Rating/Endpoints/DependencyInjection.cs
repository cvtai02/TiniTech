using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Rating.Core;
using Rating.Infrastructure;

namespace Rating.Endpoints;

public static class DependencyInjection
{
    public static IHostApplicationBuilder AddRatingModule(this IHostApplicationBuilder builder)
    {
        builder.AddRatingCore();
        builder.AddRatingInfra();

        return builder;
    }
}

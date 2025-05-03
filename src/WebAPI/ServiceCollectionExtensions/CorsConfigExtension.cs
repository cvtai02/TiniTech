namespace WebAPI.ServiceCollectionExtensions;

public static class CorsConfigExtension
{
    public static void AddCorsPolicy(this IServiceCollection services, IConfiguration configuration, string policyName)
    {
        var allowedOrigins = configuration.GetSection("AllowedHosts").Get<string[]>();

        services.AddCors(options =>
        {
            options.AddPolicy(policyName, policy =>
                policy.WithOrigins(allowedOrigins ?? ["*"])
                      .AllowAnyMethod()
                      .AllowAnyHeader());
        });
    }
}
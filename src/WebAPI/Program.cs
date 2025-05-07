using Catalog.Endpoints;
using Identity.Endpoints;
using Infrastructure;
using Rating.Endpoints;
using SharedKernel;
using WebAPI.ServiceCollectionExtensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure();
builder
    .AddIdentityModule()
    .AddCatalogModule()
    .AddRatingModule()
    .AddWebServices();

// Define the CORS policy
var OriginsPolicy = "_OriginsPolicy";
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: OriginsPolicy,
        policy =>
        {
            policy.WithOrigins(allowedOrigins!)
                  .AllowCredentials()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger().UseSwaggerUI();
}
app.MapGet("/", () => Results.Redirect("/swagger/index.html", true));

app.UseHttpsRedirection()
    .UseCors(OriginsPolicy)
    .UseAuthentication()
    .UseAuthorization()
    .UseExceptionHandler();
// app.UseMiddleware<RequestLoggingMiddleware>();
app.MapControllers();

app.Run();
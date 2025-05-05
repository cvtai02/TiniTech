using Catalog.Endpoints;
using Identity.Endpoints;
using Infrastructure;
using WebAPI;
using WebAPI.ServiceCollectionExtensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure();
builder
.AddIdentityModule()
.AddCatalogModule()
.AddWebServices();

builder.Services.AddCorsPolicy(builder.Configuration, "CorsPolicy");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger().UseSwaggerUI();
}
app.MapGet("/", () => Results.Redirect("/swagger/index.html", true));

app.UseHttpsRedirection()
    .UseCors("CorsPolicy")
    .UseAuthentication()
    .UseAuthorization()
    .UseExceptionHandler();
// app.UseMiddleware<RequestLoggingMiddleware>();
app.MapControllers();

app.Run();
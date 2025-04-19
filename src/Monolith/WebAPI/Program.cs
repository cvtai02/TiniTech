using System.Text.Json.Serialization;
using Application;
using Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using WebAPI;
using WebAPI.Middlewares;
using WebAPI.ServiceCollectionExtensions;

var builder = WebApplication.CreateBuilder(args);


builder.AddApplicationServices();
builder.AddInfrastructureServices();
builder.AddWebServices();
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
app.MapControllers();

app.Run();
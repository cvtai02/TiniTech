using Api.Config;
using Api.Extensions;
using Api.Middlewares;
using Application;
using Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi().AddSwaggerGenWithAuth();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>()
    .AddProblemDetails()
    .AddControllers();
builder.AddCoreServices();
builder.AddInfrastructureServices();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer();
builder.Services.ConfigureOptions<JwtValidationConfig>();


var allowedOrigins = builder.Configuration.GetSection("AllowedHosts").Get<string[]>();
builder.Services.AddCorsPolicy(builder.Configuration, "CorsPolicy");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger().UseSwaggerUI();
}

app.MapControllers();
app.MapGet("/", () => Results.Redirect("/swagger/index.html", true));

app.UseHttpsRedirection()
    .UseCors("CorsPolicy")
    .UseAuthentication()
    .UseAuthorization()
    .UseExceptionHandler();

app.Run();
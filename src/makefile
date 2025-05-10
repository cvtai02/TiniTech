init-cross-cutting:
	dotnet new classlib -n CrossCutting
	powershell -Command "Remove-Item './CrossCutting/Class1.cs' -Force -ErrorAction SilentlyContinue"

init-domain:
	dotnet new classlib -n Domain
	powershell -Command "Remove-Item './Domain/Class1.cs' -Force -ErrorAction SilentlyContinue"
	mkdir .\Domain\Entities
	mkdir .\Domain\Enums
	mkdir .\Domain\Events
	mkdir .\Domain\ValueObjects
	mkdir .\Domain\Exceptions
	dotnet add Domain/Domain.csproj package MediatR

init-application:
	dotnet new classlib -n Application
	powershell -Command "Remove-Item './Application/Class1.cs' -Force -ErrorAction SilentlyContinue"
	mkdir .\Application\Common
	mkdir .\Application\Common\Behaviors
	dotnet add Application/Application.csproj package Microsoft.Extensions.Hosting
	dotnet add Application/Application.csproj package Microsoft.EntityFrameworkCore
	dotnet add Application/Application.csproj package FluentValidation.DependencyInjectionExtensions
	dotnet add Application/Application.csproj package Microsoft.AspNetCore.Http.Abstractions

init-infrastructure:
	dotnet new classlib -n Infrastructure
	powershell -Command "Remove-Item './Infrastructure/Class1.cs' -Force -ErrorAction SilentlyContinue"
	mkdir .\Infrastructure\Data
	dotnet add Infrastructure/Infrastructure.csproj package Npgsql.EntityFrameworkCore.PostgreSQL
	dotnet add Infrastructure/Infrastructure.csproj package Microsoft.EntityFrameworkCore.SqlServer

init-webapi:
	dotnet new webapi -n WebAPI
	mkdir .\WebAPI\Controllers
	mkdir .\WebAPI\Middlewares
	mkdir .\WebAPI\Configurations
	dotnet add WebAPI/WebAPI.csproj package Microsoft.AspNetCore.Authentication.JwtBearer
	dotnet add WebAPI/WebAPI.csproj package Swashbuckle.AspNetCore
	dotnet add WebAPI/WebAPI.csproj package Microsoft.EntityFrameworkCore.Design

init-shared-view-models:
	dotnet new classlib -n SharedViewModels
	powershell -Command "Remove-Item './SharedViewModels/Class1.cs' -Force -ErrorAction SilentlyContinue"
	mkdir .\SharedViewModels\ViewModels
	mkdir .\SharedViewModels\DTOs

init-webmvc:
	dotnet new mvc -n WebMVC
	mkdir .\WebMVC\Middlewares
	mkdir .\WebMVC\Configurations
	dotnet add WebMVC/WebMVC.csproj package Microsoft.AspNetCore.Authentication.JwtBearer
	dotnet add WebMVC/WebMVC.csproj package Swashbuckle.AspNetCore

init-unit-tests:
	dotnet new xunit -n UnitTests
	powershell -Command "Remove-Item './UnitTests/UnitTest1.cs' -Force -ErrorAction SilentlyContinue"

init-solution:
	@echo "Adding projects to solution..."
	dotnet new sln
	dotnet new gitignore
	dotnet sln add WebAPI\WebAPI.csproj
	dotnet sln add WebMVC\WebMVC.csproj
	dotnet sln add UnitTests\UnitTests.csproj
	dotnet sln add CrossCutting\CrossCutting.csproj
	dotnet sln add Domain\Domain.csproj
	dotnet sln add Application\Application.csproj
	dotnet sln add Infrastructure\Infrastructure.csproj
	dotnet sln add Background\Background.csproj
	dotnet sln add SharedViewModels\SharedViewModels.csproj
	
	@echo "Setting up project references..."
	dotnet add Domain\Domain.csproj reference CrossCutting\CrossCutting.csproj
	dotnet add Application\Application.csproj reference Domain\Domain.csproj
	dotnet add Infrastructure\Infrastructure.csproj reference Application\Application.csproj
	dotnet add WebAPI\WebAPI.csproj reference Application\Application.csproj
	dotnet add WebAPI\WebAPI.csproj reference Infrastructure\Infrastructure.csproj
	dotnet add WebMVC\WebMVC.csproj reference Application\Application.csproj
	dotnet add WebMVC\WebMVC.csproj reference Infrastructure\Infrastructure.csproj
	dotnet add Background\Background.csproj reference Application\Application.csproj
	dotnet add Background\Background.csproj reference Infrastructure\Infrastructure.csproj
	
	dotnet add WebMVC\WebMVC.csproj reference SharedViewModels\SharedViewModels.csproj
	dotnet add SharedViewModels\SharedViewModels.csproj reference Domain\Domain.csproj
	dotnet add Application\Application.csproj reference SharedViewModels\SharedViewModels.csproj

init-monolith:
	make init-cross-cutting
	make init-domain
	make init-application
	make init-infrastructure
	make init-webapi
	make init-webmvc
	make init-unit-tests
	make init-solution

run-api:
	dotnet run --project WebAPI/WebAPI.csproj 
run-admin:
	cd uis/admin && npm run dev
run-api-nobuild:
	dotnet run --project WebAPI/WebAPI.csproj --no-build
run-mvc:
	dotnet run --project WebMVC/WebMVC.csproj
watch-mvc:
	dotnet watch run --project WebMVC/WebMVC.csproj 
run-unit-tests:
	dotnet test --project UnitTests/UnitTests.csproj --no-build --verbosity normal --filter "Category=Unit"


name = $(shell basename $(shell pwd))
	
migration-catalog:
	dotnet ef migrations add $(name) --project Catalog/Catalog.Infrastructure/Catalog.Infrastructure.csproj -o Data/Migrations --context Catalog.Infrastructure.Data.ApplicationDbContext  --startup-project WebAPI
	dotnet ef database update --project Catalog/Catalog.Infrastructure/Catalog.Infrastructure.csproj --context Catalog.Infrastructure.Data.ApplicationDbContext --startup-project WebAPI
	
migration-identity:
	dotnet ef migrations add $(name) --project Identity/Identity.Infrastructure/Identity.Infrastructure.csproj -o Data/Migrations --context Identity.Infrastructure.Data.ApplicationDbContext  --startup-project WebAPI
	dotnet ef database update --project Identity/Identity.Infrastructure/Identity.Infrastructure.csproj --context Identity.Infrastructure.Data.ApplicationDbContext --startup-project WebAPI

migration-rating:
	dotnet ef migrations add $(name) --project Rating/Rating.csproj -o Infrastructure/Data/Migrations --context Rating.Infrastructure.Data.ApplicationDbContext  --startup-project WebAPI
	dotnet ef database update --project Rating/Rating.csproj --context Rating.Infrastructure.Data.ApplicationDbContext --startup-project WebAPI

migration-purchase:
	dotnet ef migrations add $(name) --project Purchase/Purchase.Infrastructure/Purchase.Infrastructure.csproj -o Data/Migrations --context Purchase.Infrastructure.Data.ApplicationDbContext  --startup-project WebAPI
	dotnet ef database update --project Purchase/Purchase.Infrastructure/Purchase.Infrastructure.csproj --context Purchase.Infrastructure.Data.ApplicationDbContext --startup-project WebAPI

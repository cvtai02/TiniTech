migration-add:
	dotnet ef migrations add Initial --project Infrastructure -o Data/Migrations --startup-project Api

migration-update:
	dotnet ef database update --project Infrastructure --startup-project Api

run:
	dotnet watch --project Api/Api.csproj
	
fist-run:
	dotnet ef migrations add Initial --project Infrastructure -o Data/Migrations --startup-project Api
	dotnet ef database update --project Infrastructure --startup-project Api
	dotnet watch --project Api/Api.csproj
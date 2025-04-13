FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
# http port
EXPOSE 8080
# https port 
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["../coreserver.sln", "./"]
COPY ["../Api/Api.csproj", "./Api/"]
COPY ["../Domain/Domain.csproj", "./Domain/"]
COPY ["../Application/Application.csproj", "./Application/"]
COPY ["../Infrastructure/Infrastructure.csproj", "./Infrastructure/"]
RUN dotnet restore
COPY . .
WORKDIR "/src/Api"
RUN dotnet build "Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "Api.dll"]

# SDK-базований Dockerfile для ASP.NET Core 8 API

# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY backend/CloneNetflixApi/CloneNetflixAPI.csproj backend/CloneNetflixApi/
COPY backend/NetflixClone.Application/NetflixClone.Application.csproj backend/NetflixClone.Application/
COPY backend/NetflixClone.Infrastructure/NetflixClone.Infrastructure.csproj backend/NetflixClone.Infrastructure/
COPY backend/NetflixClone.Domain/NetflixClone.Domain.csproj backend/NetflixClone.Domain/

# Restore dependencies
RUN dotnet restore backend/CloneNetflixApi/CloneNetflixAPI.csproj

# Copy everything else
COPY . .

# Build
RUN dotnet build backend/CloneNetflixApi/CloneNetflixAPI.csproj -c Release -o /app/build

# Stage 2: Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/build .

# Expose port 80 for Render
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80

# Set environment to Production
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "CloneNetflixAPI.dll"]

# =========================
# Build Stage
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Copy project files first
COPY backend/EmployeeManagement.Domain/EmployeeManagement.Domain.csproj backend/EmployeeManagement.Domain/
COPY backend/EmployeeManagement.Application/EmployeeManagement.Application.csproj backend/EmployeeManagement.Application/
COPY backend/EmployeeManagement.Infrastructure/EmployeeManagement.Infrastructure.csproj backend/EmployeeManagement.Infrastructure/
COPY backend/EmployeeManagement.API/EmployeeManagement.API.csproj backend/EmployeeManagement.API/

# Restore dependencies
RUN dotnet restore backend/EmployeeManagement.API/EmployeeManagement.API.csproj

# Copy complete backend source
COPY backend/ backend/

# Publish API
RUN dotnet publish backend/EmployeeManagement.API/EmployeeManagement.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore


# =========================
# Runtime Stage
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

# Railway provides PORT dynamically
ENV ASPNETCORE_URLS=http://+:${PORT}

ENTRYPOINT ["dotnet", "EmployeeManagement.API.dll"]
using System.Text;
using System.Text.Json.Serialization;
using EmployeeManagement.API.Middleware;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Application.Services;
using EmployeeManagement.Infrastructure.Data;
using EmployeeManagement.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MySqlConnector;

var builder = WebApplication.CreateBuilder(args);

// Add Services to DI container with string enum converter
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();

// Swagger with JWT Security Definition
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Employee Management System API",
        Version = "v1",
        Description = "ASP.NET Core Web API for Employee Management System with JWT Authentication"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT Bearer token format: Bearer {your token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Determine Database Provider: Try MySQL first, fallback to SQLite if MySQL is down
var mySqlConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var sqliteConnectionString = builder.Configuration.GetConnectionString("FallbackSqlite") ?? "Data Source=employeemanagement.db";

bool isMySqlAvailable = false;
if (!string.IsNullOrEmpty(mySqlConnectionString))
{
    try
    {
        var builderConnection = new MySqlConnectionStringBuilder(mySqlConnectionString)
        {
            ConnectionTimeout = 2
        };
        using var testConn = new MySqlConnection(builderConnection.ConnectionString);
        testConn.Open();
        isMySqlAvailable = true;
        testConn.Close();
    }
    catch
    {
        isMySqlAvailable = false;
    }
}

if (isMySqlAvailable)
{
    Console.WriteLine("[Database] Connected successfully to MySQL.");
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseMySql(mySqlConnectionString, ServerVersion.AutoDetect(mySqlConnectionString)));
}
else
{
    Console.WriteLine("[Database] MySQL server unavailable. Using local SQLite database (employeemanagement.db).");
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlite(sqliteConnectionString));
}

builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

// Register Application & Infrastructure Dependencies
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IExcelExportService, ExcelExportService>();
builder.Services.AddScoped<IPdfExportService, PdfExportService>();

// Configure JWT Authentication
var secretKey = builder.Configuration["Jwt:SecretKey"] ?? "SuperSecretKeyForEmployeeManagementSystemAssignment2026!";
var issuer = builder.Configuration["Jwt:Issuer"] ?? "EmployeeManagementAPI";
var audience = builder.Configuration["Jwt:Audience"] ?? "EmployeeManagementClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Global Exception Handler Middleware
app.UseMiddleware<GlobalExceptionMiddleware>();

// Configure HTTP Request Pipeline
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Employee Management API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed Database on startup
try
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        await SeedData.InitializeAsync(services);
        Console.WriteLine("[Database] Seeding completed successfully.");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"[Seeding Info] {ex.Message}");
}

app.Run();

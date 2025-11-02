using Mapster;
using Microsoft.EntityFrameworkCore;
using MyApp.API.Data;
using MyApp.API.Mapping;
using MyApp.API.Middleware;
using MyApp.API.Repositories.Implementations;
using MyApp.API.Repositories.Interfaces;
using MyApp.API.Services.Implementations;
using MyApp.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);
// Configure Database Context 
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// Configure Mapster
var config = TypeAdapterConfig.GlobalSettings;
config.Scan(typeof(MappingConfig).Assembly);
builder.Services.AddSingleton(config);
// Configure Dependency Injection for Repositories and Services
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS to allow all origins
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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS (must be before UseAuthorization)
app.UseCors("AllowAll");

app.UseMiddleware<AuthTokenMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();

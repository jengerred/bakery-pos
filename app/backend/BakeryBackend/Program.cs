using BakeryBackend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

/* ---------------------------------------------------------
   SERVICE CONFIGURATION
   ---------------------------------------------------------
   This section registers all backend services used by the
   bakery API, including:

     - Controllers (API endpoints)
     - JSON serialization settings
     - Database connection (PostgreSQL via EF Core)
     - CORS policy for frontend access
     - OpenAPI/Swagger for development
   --------------------------------------------------------- */

// Enable OpenAPI (Swagger UI in development)
builder.Services.AddOpenApi();

// Register controllers + JSON camelCase formatting
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Ensures JSON fields use camelCase (imageUrl, sortOrder, etc.)
        options.JsonSerializerOptions.PropertyNamingPolicy =
            System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Register EF Core + PostgreSQL connection
builder.Services.AddDbContext<BakeryContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// ---------------------------------------------------------
// CORS POLICY (Allows frontend apps to call this API)
// ---------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()   // Allow any domain (Shop, POS, Vercel, localhost)
            .AllowAnyMethod()   // GET, POST, PUT, DELETE
            .AllowAnyHeader();  // Custom headers
    });
});

var app = builder.Build();

/* ---------------------------------------------------------
   MIDDLEWARE PIPELINE
   ---------------------------------------------------------
   Defines how HTTP requests flow through the backend:

     - OpenAPI (dev only)
     - HTTPS redirection
     - CORS
     - Controller routing
   --------------------------------------------------------- */

// Enable Swagger UI only in development
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Redirect HTTP → HTTPS
app.UseHttpsRedirection();

// Apply CORS before routing
app.UseCors("AllowAll");

// Map controller endpoints (e.g., /api/products)
app.MapControllers();

// Start the application
app.Run();

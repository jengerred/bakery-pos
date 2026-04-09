using Microsoft.EntityFrameworkCore;
using BakeryBackend.Models;

namespace BakeryBackend.Data
{
    /* ---------------------------------------------------------
       BAKERY CONTEXT (Entity Framework Core)
       ---------------------------------------------------------
       This class represents the database session for the
       bakery backend. It defines:

         - Which tables exist (DbSet<T>)
         - How EF Core maps models to the database
         - Any custom configuration (via OnModelCreating)

       The BakeryContext is injected into controllers and
       services so they can perform CRUD operations on the DB.

       NOTE:
       - Add new DbSet<T> properties here as your system grows
         (Orders, Employees, Customers, Inventory, etc.)
       --------------------------------------------------------- */

    public class BakeryContext : DbContext
    {
        public BakeryContext(DbContextOptions<BakeryContext> options)
            : base(options) {}

        /* -----------------------------------------------------
           DATABASE TABLES
           -----------------------------------------------------
           Each DbSet<T> represents a table in the database.
           EF Core automatically maps the Product model to the
           "Products" table based on this property.
           ----------------------------------------------------- */
        public DbSet<Product> Products { get; set; }

        /* -----------------------------------------------------
           MODEL CONFIGURATION
           -----------------------------------------------------
           Override this method to configure:
             - Table names
             - Column mappings
             - Relationships (1-to-many, many-to-many)
             - Default values
             - Indexes
             - Constraints

           Currently empty, but ready for future expansion.
           ----------------------------------------------------- */
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Example for future:
            // modelBuilder.Entity<Product>()
            //     .Property(p => p.SortOrder)
            //     .HasDefaultValue(0);
        }
    }
}

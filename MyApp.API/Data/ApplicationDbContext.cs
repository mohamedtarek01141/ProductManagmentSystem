using Microsoft.EntityFrameworkCore;
using MyApp.API.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace MyApp.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }
        public DbSet<Product> Products { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>()
               .HasIndex(p => p.Sku)
               .IsUnique();
            modelBuilder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);
        }
    }
}

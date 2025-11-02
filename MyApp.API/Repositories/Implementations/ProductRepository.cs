using Microsoft.EntityFrameworkCore;
using MyApp.API.Data;
using MyApp.API.Models;
using MyApp.API.Repositories.Interfaces;

namespace MyApp.API.Repositories.Implementations
{
    public class ProductRepository: IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Product>> GetAllAsync(string? search, int page, int pageSize, bool includeDeleted)
        {
            var query = _context.Products.AsQueryable();
            if (includeDeleted)
            {
                query = query.IgnoreQueryFilters();
            }
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search) || p.Sku.Contains(search));
            }
            return await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();
        }
        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products.IgnoreQueryFilters().FirstOrDefaultAsync(p=>p.Id==id);
        }
        public async Task AddAsync(Product product)
        {
            await _context.Products.AddAsync(product);
        }
        public  Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            return Task.CompletedTask;
        }
        public async Task SoftDeleteAsync(int id)
        {
            var product = await GetByIdAsync(id);
            if (product != null)
            {
                product.IsDeleted = true;
                _context.Products.Update(product);
            }
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

    }
}

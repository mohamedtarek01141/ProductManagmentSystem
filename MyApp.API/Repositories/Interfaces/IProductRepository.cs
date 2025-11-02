using MyApp.API.Models;

namespace MyApp.API.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync(string? search, int page, int pageSize, bool includeDeleted);
        Task<Product?> GetByIdAsync(int id);
        Task AddAsync(Product product);
        Task UpdateAsync(Product product);
        Task SoftDeleteAsync(int id);
        Task SaveChangesAsync();

    }
}

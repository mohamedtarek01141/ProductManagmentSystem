using MyApp.API.Dtos;
using MyApp.API.Dtos.Product;

namespace MyApp.API.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductResponse>> GetAllAsync(string? search, int page, int pageSize, bool includeDeleted = false);
        Task<ProductResponse?> GetByIdAsync(int id);
        Task<ServiceResponse> CreateAsync(ProductRequest request);
        Task<ServiceResponse?> UpdateAsync(int id, ProductRequest request);
        Task<bool> SoftDeleteAsync(int id);
    }
}

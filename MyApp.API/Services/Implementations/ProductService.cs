using Mapster;
using MyApp.API.Dtos;
using MyApp.API.Dtos.Product;
using MyApp.API.Repositories.Interfaces;
using MyApp.API.Services.Interfaces;

namespace MyApp.API.Services.Implementations
{
    public class ProductService(IProductRepository _productRepository):IProductService
    {
        public async Task<IEnumerable<ProductResponse>> GetAllAsync(string? search, int page, int pageSize, bool includeDeleted = false)
        {
            var products = await _productRepository.GetAllAsync(search, page, pageSize, includeDeleted);
            return products.Adapt<IEnumerable<ProductResponse>>();
        }
        public async Task<ProductResponse?> GetByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            return product?.Adapt<ProductResponse>();
        }
        public async Task<ServiceResponse> CreateAsync(ProductRequest request)
        {
            var product = request.Adapt<Models.Product>();
            await _productRepository.AddAsync(product);
            await _productRepository.SaveChangesAsync();
            return new ServiceResponse { Success = true, Message = "Product created successfully." };
        }
        public async Task<ServiceResponse?> UpdateAsync(int id, ProductRequest request)
        {
            var existingProduct = await _productRepository.GetByIdAsync(id);
            if (existingProduct == null)
            {
                return null;
            }
            request.Adapt(existingProduct);
            existingProduct.UpdatedAtUtc = DateTime.UtcNow;
            await _productRepository.UpdateAsync(existingProduct);
            await _productRepository.SaveChangesAsync();
            return new ServiceResponse { Success = true, Message = "Product updated successfully." };
        }
        public async Task<bool> SoftDeleteAsync(int id)
        {
            var existingProduct = await _productRepository.GetByIdAsync(id);
            if (existingProduct == null)
            {
                return false;
            }
            await _productRepository.SoftDeleteAsync(id);
            await _productRepository.SaveChangesAsync();
            return true;
        }

    }
}

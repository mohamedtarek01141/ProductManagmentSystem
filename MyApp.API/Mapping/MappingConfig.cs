using Mapster;
using MyApp.API.Dtos.Product;
using MyApp.API.Models;

namespace MyApp.API.Mapping
{
    public class MappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Product, ProductResponse>();
            config.NewConfig<ProductRequest, Product>();
        }
    }
}

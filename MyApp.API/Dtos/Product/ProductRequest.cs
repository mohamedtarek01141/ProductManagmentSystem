using System.ComponentModel.DataAnnotations;

namespace MyApp.API.Dtos.Product
{
    public class ProductRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = default!;

        [Required]
        public string Sku { get; set; } = default!;

        public string? Description { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public decimal Price { get; set; }
    }
}

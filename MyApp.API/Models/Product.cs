using System.ComponentModel.DataAnnotations;

namespace MyApp.API.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = default!;

        [Required]
        public string Sku { get; set; } = default!;  // Unique

        public string? Description { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public decimal Price { get; set; }

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAtUtc { get; set; }

        public bool IsDeleted { get; set; } = false;
    }

}

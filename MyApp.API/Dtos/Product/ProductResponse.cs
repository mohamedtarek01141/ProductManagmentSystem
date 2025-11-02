namespace MyApp.API.Dtos.Product
{
    public class ProductResponse
    {
        public int Id { get; set; }
        public string Sku { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public DateTime? UpdatedAtUtc { get; set; }
        public bool IsDeleted { get; set; }
    }
}

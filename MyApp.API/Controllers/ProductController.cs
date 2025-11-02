using Microsoft.AspNetCore.Mvc;
using MyApp.API.Dtos;
using MyApp.API.Dtos.Product;
using MyApp.API.Services.Interfaces;

namespace MyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductsController(IProductService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(string? search = null,int page = 1,int pageSize = 10, bool includeDeleted = false)
        {
            var products = await _service.GetAllAsync(search, page, pageSize, includeDeleted);
            return Ok(products);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null)
                return NotFound(new { Message = "Product not found." });

            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _service.CreateAsync(request);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _service.UpdateAsync(id, request);
            return result!.Success ? Ok(result) : NotFound(result);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.SoftDeleteAsync(id);
            return result? Ok(result) : NotFound(result);
        }
    }
}

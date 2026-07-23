using Microsoft.AspNetCore.Mvc;
using PCZone.API.DTOs;
using PCZone.API.Services;

namespace PCZone.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SanPhamController : ControllerBase
{
    private readonly ISanPhamService _sanPhamService;

    public SanPhamController(ISanPhamService sanPhamService)
    {
        _sanPhamService = sanPhamService;
    }

    // GET: api/SanPham
    [HttpGet]
    public async Task<IActionResult> LayTatCa()
    {
        var data = await _sanPhamService.LayTatCaAsync();
        return Ok(data);
    }

    // GET: api/SanPham/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> LayTheoId(int id)
    {
        var data = await _sanPhamService.LayTheoIdAsync(id);

        if (data == null)
            return NotFound();

        return Ok(data);
    }

    // POST: api/SanPham
    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoSanPhamDto dto)
    {
        await _sanPhamService.TaoAsync(dto);
        return Ok(new { message = "Tạo sản phẩm thành công" });
    }

    // PUT: api/SanPham/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> CapNhat(int id, [FromBody] CapNhatSanPhamDto dto)
    {
        var result = await _sanPhamService.CapNhatAsync(id, dto);

        if (!result)
            return NotFound();

        return Ok(new { message = "Cập nhật thành công" });
    }

    // DELETE: api/SanPham/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Xoa(int id)
    {
        var result = await _sanPhamService.XoaAsync(id);

        if (!result)
            return NotFound();

        return Ok(new { message = "Xóa thành công" });
    }
}
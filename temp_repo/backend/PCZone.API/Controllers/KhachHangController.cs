using Microsoft.AspNetCore.Mvc;
using PCZone.API.DTOs;
using PCZone.API.Services;

namespace PCZone.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KhachHangController : ControllerBase
{
    private readonly IKhachHangService _khachHangService;

    public KhachHangController(IKhachHangService khachHangService)
    {
        _khachHangService = khachHangService;
    }

    // GET: api/KhachHang
    [HttpGet]
    public async Task<IActionResult> LayTatCa()
    {
        var data = await _khachHangService.LayTatCaAsync();
        return Ok(data);
    }

    // GET: api/KhachHang/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> LayTheoId(int id)
    {
        var data = await _khachHangService.LayTheoIdAsync(id);
        if (data == null)
            return NotFound();
        return Ok(data);
    }

    // POST: api/KhachHang/dang-ky
    [HttpPost("dang-ky")]
    public async Task<IActionResult> DangKy([FromBody] DangKyDto dto)
    {
        try
        {
            var data = await _khachHangService.DangKyAsync(dto);
            if (data == null)
                return BadRequest(new { message = "Đăng ký thất bại" });
            return CreatedAtAction(nameof(LayTheoId), new { id = data.Id }, data);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT: api/KhachHang/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> CapNhat(int id, [FromBody] CapNhatKhachHangDto dto)
    {
        var result = await _khachHangService.CapNhatAsync(id, dto);
        if (!result)
            return NotFound();
        return Ok(new { message = "Cập nhật thành công" });
    }

    // DELETE: api/KhachHang/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Xoa(int id)
    {
        var result = await _khachHangService.XoaAsync(id);
        if (!result)
            return NotFound();
        return Ok(new { message = "Xóa thành công" });
    }
}
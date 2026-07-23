using Microsoft.AspNetCore.Mvc;
using PCZone.API.DTOs;
using PCZone.API.Services;

namespace PCZone.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GioHangController : ControllerBase
{
    private readonly IGioHangService _gioHangService;

    public GioHangController(IGioHangService gioHangService)
    {
        _gioHangService = gioHangService;
    }

    // GET: api/GioHang/{khachHangId}
    [HttpGet("{khachHangId}")]
    public async Task<IActionResult> LayGioHang(int khachHangId)
    {
        var data = await _gioHangService.LayGioHangAsync(khachHangId);
        if (data == null)
            return NotFound(new { message = "Giỏ hàng trống" });
        return Ok(data);
    }

    // POST: api/GioHang/them
    [HttpPost("them")]
    public async Task<IActionResult> ThemSanPham([FromBody] ThemGioHangDto dto)
    {
        try
        {
            var data = await _gioHangService.ThemSanPhamAsync(dto);
            return Ok(new { message = "Thêm vào giỏ hàng thành công", data });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT: api/GioHang/cap-nhat/{chiTietId}
    [HttpPut("cap-nhat/{chiTietId}")]
    public async Task<IActionResult> CapNhatSoLuong(int chiTietId, [FromBody] CapNhatGioHangDto dto)
    {
        var result = await _gioHangService.CapNhatSoLuongAsync(chiTietId, dto);
        if (result == null)
            return NotFound(new { message = "Chi tiết giỏ hàng không tồn tại" });
        return Ok(new { message = "Cập nhật số lượng thành công", data = result });
    }

    // DELETE: api/GioHang/xoa/{chiTietId}
    [HttpDelete("xoa/{chiTietId}")]
    public async Task<IActionResult> XoaSanPham(int chiTietId)
    {
        var result = await _gioHangService.XoaSanPhamAsync(chiTietId);
        if (!result)
            return NotFound(new { message = "Chi tiết giỏ hàng không tồn tại" });
        return Ok(new { message = "Xóa sản phẩm khỏi giỏ hàng thành công" });
    }

    // GET: api/GioHang/tong-tien/{khachHangId}
    [HttpGet("tong-tien/{khachHangId}")]
    public async Task<IActionResult> TinhTongTien(int khachHangId)
    {
        var tongTien = await _gioHangService.TinhTongTienAsync(khachHangId);
        return Ok(new { tongTien });
    }

    // DELETE: api/GioHang/xoa-tat-ca/{khachHangId}
    [HttpDelete("xoa-tat-ca/{khachHangId}")]
    public async Task<IActionResult> XoaGioHang(int khachHangId)
    {
        var result = await _gioHangService.XoaGioHangAsync(khachHangId);
        if (!result)
            return NotFound(new { message = "Giỏ hàng không tồn tại" });
        return Ok(new { message = "Xóa toàn bộ giỏ hàng thành công" });
    }
}
using Microsoft.AspNetCore.Mvc;
using PCZone.API.DTOs;
using PCZone.API.Services;

namespace PCZone.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DanhGiaController : ControllerBase
{
    private readonly IDanhGiaService _danhGiaService;

    public DanhGiaController(IDanhGiaService danhGiaService)
    {
        _danhGiaService = danhGiaService;
    }

    // GET: api/DanhGia/san-pham/{sanPhamId}
    [HttpGet("san-pham/{sanPhamId}")]
    public async Task<IActionResult> LayTheoSanPham(int sanPhamId)
    {
        var data = await _danhGiaService.LayTheoSanPhamAsync(sanPhamId);
        return Ok(data);
    }

    // POST: api/DanhGia
    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoDanhGiaDto dto)
    {
        try
        {
            var data = await _danhGiaService.TaoAsync(dto);
            return Ok(new { message = "Thêm đánh giá thành công", data });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT: api/DanhGia/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> CapNhat(int id, [FromBody] CapNhatDanhGiaDto dto)
    {
        try
        {
            var result = await _danhGiaService.CapNhatAsync(id, dto);
            if (result == null)
                return NotFound();
            return Ok(new { message = "Cập nhật đánh giá thành công", data = result });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DELETE: api/DanhGia/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Xoa(int id)
    {
        var result = await _danhGiaService.XoaAsync(id);
        if (!result)
            return NotFound();
        return Ok(new { message = "Xóa đánh giá thành công" });
    }

    // GET: api/DanhGia/rating/{sanPhamId}
    [HttpGet("rating/{sanPhamId}")]
    public async Task<IActionResult> TinhRatingTrungBinh(int sanPhamId)
    {
        var rating = await _danhGiaService.TinhRatingTrungBinhAsync(sanPhamId);
        return Ok(new { sanPhamId, ratingTrungBinh = Math.Round(rating, 1) });
    }
}
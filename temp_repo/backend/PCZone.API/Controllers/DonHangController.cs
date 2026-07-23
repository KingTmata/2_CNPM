using Microsoft.AspNetCore.Mvc;
using PCZone.API.DTOs;
using PCZone.API.Services;

namespace PCZone.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DonHangController : ControllerBase
{
    private readonly IDonHangService _donHangService;

    public DonHangController(IDonHangService donHangService)
    {
        _donHangService = donHangService;
    }

    // GET: api/DonHang
    [HttpGet]
    public async Task<IActionResult> LayTatCa()
    {
        var data = await _donHangService.LayTatCaAsync();
        return Ok(data);
    }

    // GET: api/DonHang/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> LayTheoId(int id)
    {
        var data = await _donHangService.LayTheoIdAsync(id);
        if (data == null)
            return NotFound();
        return Ok(data);
    }

    // GET: api/DonHang/khach-hang/{khachHangId}
    [HttpGet("khach-hang/{khachHangId}")]
    public async Task<IActionResult> LayLichSuDon(int khachHangId)
    {
        var data = await _donHangService.LayLichSuDonAsync(khachHangId);
        return Ok(data);
    }

    // POST: api/DonHang
    [HttpPost]
    public async Task<IActionResult> TaoDon([FromBody] TaoDonHangDto dto)
    {
        try
        {
            var data = await _donHangService.TaoDonAsync(dto);
            return CreatedAtAction(nameof(LayTheoId), new { id = data.Id }, data);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT: api/DonHang/{id}/trang-thai
    [HttpPut("{id}/trang-thai")]
    public async Task<IActionResult> CapNhatTrangThai(int id, [FromBody] CapNhatTrangThaiDto dto)
    {
        var result = await _donHangService.CapNhatTrangThaiAsync(id, dto);
        if (result == null)
            return NotFound();
        return Ok(result);
    }

    // PUT: api/DonHang/{id}/huy
    [HttpPut("{id}/huy")]
    public async Task<IActionResult> HuyDon(int id)
    {
        try
        {
            var result = await _donHangService.HuyDonAsync(id);
            if (!result)
                return NotFound();
            return Ok(new { message = "Hủy đơn hàng thành công" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
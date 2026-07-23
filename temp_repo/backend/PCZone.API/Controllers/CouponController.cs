using Microsoft.AspNetCore.Mvc;
using PCZone.API.DTOs;
using PCZone.API.Services;

namespace PCZone.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CouponController : ControllerBase
{
    private readonly ICouponService _couponService;

    public CouponController(ICouponService couponService)
    {
        _couponService = couponService;
    }

    // GET: api/Coupon
    [HttpGet]
    public async Task<IActionResult> LayTatCa()
    {
        var data = await _couponService.LayTatCaAsync();
        return Ok(data);
    }

    // GET: api/Coupon/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> LayTheoId(int id)
    {
        var data = await _couponService.LayTheoIdAsync(id);
        if (data == null)
            return NotFound();
        return Ok(data);
    }

    // GET: api/Coupon/ma/{maCoupon}
    [HttpGet("ma/{maCoupon}")]
    public async Task<IActionResult> LayTheoMa(string maCoupon)
    {
        var data = await _couponService.LayTheoMaAsync(maCoupon);
        if (data == null)
            return NotFound(new { message = "Mã coupon không tồn tại" });
        return Ok(data);
    }

    // POST: api/Coupon
    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoCouponDto dto)
    {
        try
        {
            var data = await _couponService.TaoAsync(dto);
            return CreatedAtAction(nameof(LayTheoId), new { id = data.Id }, data);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT: api/Coupon/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> CapNhat(int id, [FromBody] CapNhatCouponDto dto)
    {
        var result = await _couponService.CapNhatAsync(id, dto);
        if (result == null)
            return NotFound();
        return Ok(result);
    }

    // DELETE: api/Coupon/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Xoa(int id)
    {
        var result = await _couponService.XoaAsync(id);
        if (!result)
            return NotFound();
        return Ok(new { message = "Xóa coupon thành công" });
    }
}
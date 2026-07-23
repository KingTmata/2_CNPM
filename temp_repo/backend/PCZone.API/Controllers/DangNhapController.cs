using Microsoft.AspNetCore.Mvc;
using PCZone.API.DTOs;
using PCZone.API.Services;

namespace PCZone.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DangNhapController : ControllerBase
{
    private readonly IDangNhapService _dangNhapService;

    public DangNhapController(IDangNhapService dangNhapService)
    {
        _dangNhapService = dangNhapService;
    }

    // POST: api/DangNhap
    [HttpPost]
    public async Task<IActionResult> DangNhap([FromBody] DangNhapDto dto)
    {
        try
        {
            var result = await _dangNhapService.DangNhapAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using PCZone.API.DTOs;
using PCZone.API.Services;

namespace PCZone.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BuildPCController : ControllerBase
{
    private readonly IBuildPCService _buildPCService;

    public BuildPCController(IBuildPCService buildPCService)
    {
        _buildPCService = buildPCService;
    }

    /// <summary>
    /// Kiểm tra tính tương thích của các linh kiện trong build
    /// </summary>
    [HttpPost("kiem-tra")]
    public async Task<IActionResult> KiemTraTuongThich([FromBody] KiemTraTuongThichDto dto)
    {
        var result = await _buildPCService.KiemTraTuongThichAsync(dto);
        return Ok(result);
    }

    /// <summary>
    /// Gợi ý cấu hình PC dựa trên ngân sách và mục đích
    /// </summary>
    [HttpPost("goi-y")]
    public async Task<IActionResult> GoiYBuild([FromBody] GoiYBuildDto dto)
    {
        var result = await _buildPCService.GoiYBuildAsync(dto);
        return Ok(result);
    }

    /// <summary>
    /// Lưu cấu hình build PC
    /// </summary>
    [HttpPost("luu")]
    public async Task<IActionResult> LuuCauHinh([FromBody] LuuCauHinhDto dto)
    {
        var result = await _buildPCService.LuuCauHinhAsync(dto);
        return Ok(new { message = "Lưu cấu hình thành công!", data = result });
    }

    /// <summary>
    /// Lấy lịch sử build PC (có thể lọc theo khách hàng)
    /// </summary>
    [HttpGet("lich-su")]
    public async Task<IActionResult> LayLichSu([FromQuery] int? khachHangId)
    {
        var result = await _buildPCService.LayLichSuAsync(khachHangId);
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết cấu hình theo ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> LayTheoId(int id)
    {
        var result = await _buildPCService.LayTheoIdAsync(id);
        if (result == null)
            return NotFound(new { message = "Không tìm thấy cấu hình." });
        return Ok(result);
    }

    /// <summary>
    /// Lấy cấu hình theo mã chia sẻ
    /// </summary>
    [HttpGet("chia-se/{maChiaSe}")]
    public async Task<IActionResult> LayTheoMaChiaSe(string maChiaSe)
    {
        var result = await _buildPCService.LayTheoMaChiaSeAsync(maChiaSe);
        if (result == null)
            return NotFound(new { message = "Không tìm thấy cấu hình." });
        return Ok(result);
    }

    /// <summary>
    /// Xóa cấu hình build PC
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> XoaCauHinh(int id)
    {
        var result = await _buildPCService.XoaCauHinhAsync(id);
        if (!result)
            return NotFound(new { message = "Không tìm thấy cấu hình." });
        return Ok(new { message = "Xóa cấu hình thành công." });
    }
}
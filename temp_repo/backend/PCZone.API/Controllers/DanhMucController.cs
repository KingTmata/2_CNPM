using Microsoft.AspNetCore.Mvc;
using PCZone.API.DTOs;
using PCZone.API.Services;

namespace PCZone.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DanhMucController : ControllerBase
{
    private readonly IDanhMucService _danhMucService;

    public DanhMucController(IDanhMucService danhMucService)
    {
        _danhMucService = danhMucService;
    }

    // GET: api/DanhMuc
    [HttpGet]
    public async Task<IActionResult> LayTatCa()
    {
        var data = await _danhMucService.LayTatCaAsync();
        return Ok(data);
    }

    // GET: api/DanhMuc/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> LayTheoId(int id)
    {
        var data = await _danhMucService.LayTheoIdAsync(id);
        if (data == null)
            return NotFound();
        return Ok(data);
    }

    // POST: api/DanhMuc
    [HttpPost]
    public async Task<IActionResult> Tao([FromBody] TaoDanhMucDto dto)
    {
        var data = await _danhMucService.TaoAsync(dto);
        return CreatedAtAction(nameof(LayTheoId), new { id = data.Id }, data);
    }

    // PUT: api/DanhMuc/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> CapNhat(int id, [FromBody] CapNhatDanhMucDto dto)
    {
        var result = await _danhMucService.CapNhatAsync(id, dto);
        if (result == null)
            return NotFound();
        return Ok(result);
    }

    // DELETE: api/DanhMuc/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Xoa(int id)
    {
        var result = await _danhMucService.XoaAsync(id);
        if (!result)
            return NotFound();
        return Ok(new { message = "Xóa danh mục thành công" });
    }
}
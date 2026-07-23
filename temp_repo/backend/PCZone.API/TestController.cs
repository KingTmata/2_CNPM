using Microsoft.AspNetCore.Mvc;

namespace PCZone.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult LayDuLieu()
    {
        return Ok(new
        {
            thongBao = "Backend PCZONE hoạt động",
            trangThai = true
        });
    }
}
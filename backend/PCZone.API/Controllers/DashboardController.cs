using Microsoft.AspNetCore.Mvc;
using PCZone.API.Services;

namespace PCZone.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    // GET: api/Dashboard
    [HttpGet]
    public async Task<IActionResult> LayThongKe()
    {
        var data = await _dashboardService.LayThongKeAsync();
        return Ok(data);
    }
}
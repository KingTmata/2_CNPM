using Microsoft.AspNetCore.Mvc;
using PCZone.API.Services;

namespace PCZone.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;

    public AIController(IAIService aiService)
    {
        _aiService = aiService;
    }

    /// <summary>
    /// POST: api/AI/chat - Chat tổng quát với AI
    /// </summary>
    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] AiRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
            return BadRequest(new { message = "Vui lòng nhập câu hỏi" });

        var result = await _aiService.ChatAsync(request.Message);
        return Ok(new { response = result });
    }

    /// <summary>
    /// POST: api/AI/tu-van-build - Tư vấn build PC
    /// </summary>
    [HttpPost("tu-van-build")]
    public async Task<IActionResult> TuVanBuild([FromBody] AiRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
            return BadRequest(new { message = "Vui lòng nhập yêu cầu build PC" });

        var result = await _aiService.TuVanBuildPcAsync(request.Message);
        return Ok(new { response = result });
    }

}

public class AiRequest
{
    public string Message { get; set; } = string.Empty;
}
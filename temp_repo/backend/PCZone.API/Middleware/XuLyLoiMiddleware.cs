using System.Net;
using System.Text.Json;

namespace PCZone.API.Middleware;

/// <summary>
/// Middleware xử lý lỗi toàn cục - bắt tất cả exception chưa được xử lý
/// và trả về JSON response chuẩn thay vì trang lỗi mặc định
/// </summary>
public class XuLyLoiMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<XuLyLoiMiddleware> _logger;

    public XuLyLoiMiddleware(RequestDelegate next, ILogger<XuLyLoiMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Không tìm thấy tài nguyên: {Message}", ex.Message);
            await HandleExceptionAsync(context, HttpStatusCode.NotFound, ex.Message);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Truy cập trái phép: {Message}", ex.Message);
            await HandleExceptionAsync(context, HttpStatusCode.Unauthorized, "Bạn không có quyền truy cập tài nguyên này");
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Dữ liệu không hợp lệ: {Message}", ex.Message);
            await HandleExceptionAsync(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Thao tác không hợp lệ: {Message}", ex.Message);
            await HandleExceptionAsync(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi máy chủ nội bộ: {Message}", ex.Message);
            await HandleExceptionAsync(context, HttpStatusCode.InternalServerError, "Đã xảy ra lỗi máy chủ, vui lòng thử lại sau");
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, HttpStatusCode statusCode, string message)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var response = new
        {
            success = false,
            statusCode = (int)statusCode,
            message = message
        };

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(jsonResponse);
    }
}
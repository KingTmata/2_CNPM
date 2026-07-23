using System.Diagnostics;

namespace PCZone.API.Middleware;

/// <summary>
/// Middleware ghi log request/response - ghi lại thông tin mỗi request,
/// bao gồm phương thức, đường dẫn, thời gian xử lý, status code
/// </summary>
public class GhiLogMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GhiLogMiddleware> _logger;

    public GhiLogMiddleware(RequestDelegate next, ILogger<GhiLogMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var method = context.Request.Method;
        var path = context.Request.Path;
        var queryString = context.Request.QueryString;

        _logger.LogInformation("➡️ Request: {Method} {Path}{QueryString}", method, path, queryString);

        try
        {
            await _next(context);

            stopwatch.Stop();
            var statusCode = context.Response.StatusCode;
            var elapsed = stopwatch.ElapsedMilliseconds;

            if (statusCode >= 500)
            {
                _logger.LogError("❌ Response: {StatusCode} - {Method} {Path} - {Elapsed}ms", statusCode, method, path, elapsed);
            }
            else if (statusCode >= 400)
            {
                _logger.LogWarning("⚠️ Response: {StatusCode} - {Method} {Path} - {Elapsed}ms", statusCode, method, path, elapsed);
            }
            else
            {
                _logger.LogInformation("✅ Response: {StatusCode} - {Method} {Path} - {Elapsed}ms", statusCode, method, path, elapsed);
            }
        }
        catch (Exception)
        {
            stopwatch.Stop();
            var elapsed = stopwatch.ElapsedMilliseconds;
            _logger.LogError("💥 Exception: {Method} {Path} - {Elapsed}ms", method, path, elapsed);
            throw; // Ném lại để XuLyLoiMiddleware xử lý
        }
    }
}
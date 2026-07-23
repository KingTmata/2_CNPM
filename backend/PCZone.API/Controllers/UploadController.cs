using Microsoft.AspNetCore.Mvc;

namespace PCZone.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<UploadController> _logger;

    // Các định dạng file được phép
    private static readonly string[] DinhDangChoPhep = { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg" };
    private const long KichThuocToiDa = 5 * 1024 * 1024; // 5MB

    public UploadController(IWebHostEnvironment env, ILogger<UploadController> logger)
    {
        _env = env;
        _logger = logger;
    }

    /// <summary>
    /// Upload một file ảnh
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Vui lòng chọn file để upload." });

        // Kiểm tra định dạng
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!DinhDangChoPhep.Contains(extension))
            return BadRequest(new { message = $"Định dạng file không được hỗ trợ. Chỉ chấp nhận: {string.Join(", ", DinhDangChoPhep)}" });

        // Kiểm tra kích thước
        if (file.Length > KichThuocToiDa)
            return BadRequest(new { message = $"Kích thước file tối đa là {KichThuocToiDa / 1024 / 1024}MB." });

        try
        {
            // Tạo tên file duy nhất
            var tenFile = $"{Guid.NewGuid():N}{extension}";
            
            // Đường dẫn thư mục uploads
            var thuMucUpload = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads");
            
            // Tạo thư mục nếu chưa tồn tại
            if (!Directory.Exists(thuMucUpload))
                Directory.CreateDirectory(thuMucUpload);

            // Đường dẫn đầy đủ của file
            var duongDanFile = Path.Combine(thuMucUpload, tenFile);

            // Lưu file
            using (var stream = new FileStream(duongDanFile, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Trả về URL
            var url = $"/uploads/{tenFile}";

            _logger.LogInformation("Upload file thành công: {TenFile}, kích thước: {KichThuoc} bytes", tenFile, file.Length);

            return Ok(new
            {
                message = "Upload thành công!",
                tenFile = tenFile,
                url = url,
                kichThuoc = file.Length
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi upload file: {TenFile}", file.FileName);
            return StatusCode(500, new { message = "Lỗi server khi upload file. Vui lòng thử lại." });
        }
    }

    /// <summary>
    /// Upload nhiều file cùng lúc
    /// </summary>
    [HttpPost("nhieu")]
    public async Task<IActionResult> UploadNhieu(List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
            return BadRequest(new { message = "Vui lòng chọn ít nhất một file." });

        var ketQua = new List<object>();
        var loi = new List<string>();

        foreach (var file in files)
        {
            if (file == null || file.Length == 0)
            {
                loi.Add($"File '{file?.FileName}' rỗng hoặc không hợp lệ.");
                continue;
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!DinhDangChoPhep.Contains(extension))
            {
                loi.Add($"File '{file.FileName}': định dạng không được hỗ trợ.");
                continue;
            }

            if (file.Length > KichThuocToiDa)
            {
                loi.Add($"File '{file.FileName}': kích thước vượt quá {KichThuocToiDa / 1024 / 1024}MB.");
                continue;
            }

            try
            {
                var tenFile = $"{Guid.NewGuid():N}{extension}";
                var thuMucUpload = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads");
                
                if (!Directory.Exists(thuMucUpload))
                    Directory.CreateDirectory(thuMucUpload);

                var duongDanFile = Path.Combine(thuMucUpload, tenFile);

                using (var stream = new FileStream(duongDanFile, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                ketQua.Add(new
                {
                    tenFile = tenFile,
                    url = $"/uploads/{tenFile}",
                    kichThuoc = file.Length
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi upload file: {TenFile}", file.FileName);
                loi.Add($"File '{file.FileName}': lỗi server.");
            }
        }

        return Ok(new
        {
            message = $"Upload thành công {ketQua.Count}/{files.Count} file.",
            thanhCong = ketQua,
            loi = loi
        });
    }

    /// <summary>
    /// Xóa file đã upload
    /// </summary>
    [HttpDelete("{tenFile}")]
    public IActionResult XoaFile(string tenFile)
    {
        if (string.IsNullOrWhiteSpace(tenFile))
            return BadRequest(new { message = "Tên file không hợp lệ." });

        try
        {
            var thuMucUpload = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads");
            var duongDanFile = Path.Combine(thuMucUpload, tenFile);

            if (!System.IO.File.Exists(duongDanFile))
                return NotFound(new { message = "File không tồn tại." });

            System.IO.File.Delete(duongDanFile);
            _logger.LogInformation("Xóa file thành công: {TenFile}", tenFile);

            return Ok(new { message = "Xóa file thành công." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi xóa file: {TenFile}", tenFile);
            return StatusCode(500, new { message = "Lỗi server khi xóa file." });
        }
    }
}
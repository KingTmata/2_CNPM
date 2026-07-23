using System.ComponentModel.DataAnnotations;

namespace PCZone.API.DTOs;

public class DangNhapDto
{
    [Required(ErrorMessage = "Email là bắt buộc")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
    public string MatKhau { get; set; } = string.Empty;
}

public class DangNhapResponse
{
    public int Id { get; set; }
    public string Ten { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string VaiTro { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
}
using System.ComponentModel.DataAnnotations;

namespace PCZone.API.DTOs;

public class DangKyDto
{
    [Required(ErrorMessage = "Tên là bắt buộc")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Tên phải từ 2-100 ký tự")]
    public string Ten { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email là bắt buộc")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    [StringLength(200, ErrorMessage = "Email không được quá 200 ký tự")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu phải từ 6-100 ký tự")]
    public string MatKhau { get; set; } = string.Empty;

    [StringLength(20, ErrorMessage = "Số điện thoại không được quá 20 ký tự")]
    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string SoDienThoai { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Địa chỉ không được quá 500 ký tự")]
    public string DiaChi { get; set; } = string.Empty;
}
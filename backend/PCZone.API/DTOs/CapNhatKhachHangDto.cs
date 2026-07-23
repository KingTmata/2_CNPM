using System.ComponentModel.DataAnnotations;

namespace PCZone.API.DTOs;

public class CapNhatKhachHangDto
{
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Tên phải từ 2-100 ký tự")]
    public string? Ten { get; set; }

    [StringLength(20, ErrorMessage = "Số điện thoại không được quá 20 ký tự")]
    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string? SoDienThoai { get; set; }

    [StringLength(500, ErrorMessage = "Địa chỉ không được quá 500 ký tự")]
    public string? DiaChi { get; set; }
}
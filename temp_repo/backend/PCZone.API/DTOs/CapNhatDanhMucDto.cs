using System.ComponentModel.DataAnnotations;

namespace PCZone.API.DTOs;

public class CapNhatDanhMucDto
{
    [Required(ErrorMessage = "Tên danh mục là bắt buộc")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Tên danh mục phải từ 2-100 ký tự")]
    public string Ten { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Mô tả không được quá 500 ký tự")]
    public string? MoTa { get; set; }

    [StringLength(500, ErrorMessage = "Đường dẫn ảnh không được quá 500 ký tự")]
    public string? HinhAnh { get; set; }
}
using System.ComponentModel.DataAnnotations;

namespace PCZone.API.DTOs;

public class CapNhatTrangThaiDto
{
    [Required(ErrorMessage = "Trạng thái là bắt buộc")]
    [StringLength(50, ErrorMessage = "Trạng thái không được quá 50 ký tự")]
    public string TrangThai { get; set; } = string.Empty;
}
using System.ComponentModel.DataAnnotations;

namespace PCZone.API.DTOs;

public class CapNhatSanPhamDto
{
    [Required(ErrorMessage = "Tên sản phẩm là bắt buộc")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Tên sản phẩm phải từ 2-200 ký tự")]
    public string Ten { get; set; } = string.Empty;

    [Required(ErrorMessage = "Giá sản phẩm là bắt buộc")]
    [Range(1000, double.MaxValue, ErrorMessage = "Giá sản phẩm phải lớn hơn 1.000đ")]
    public decimal Gia { get; set; }

    [StringLength(2000, ErrorMessage = "Mô tả không được quá 2000 ký tự")]
    public string MoTa { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Đường dẫn ảnh không được quá 500 ký tự")]
    public string HinhAnh { get; set; } = string.Empty;

    [Range(0, int.MaxValue, ErrorMessage = "Số lượng tồn không được âm")]
    public int SoLuongTon { get; set; }

    public bool DangKinhDoanh { get; set; }

    [Required(ErrorMessage = "Danh mục là bắt buộc")]
    public int DanhMucId { get; set; }
}
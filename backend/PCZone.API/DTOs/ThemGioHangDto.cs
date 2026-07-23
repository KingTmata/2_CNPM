using System.ComponentModel.DataAnnotations;

namespace PCZone.API.DTOs;

public class ThemGioHangDto
{
    [Required(ErrorMessage = "Mã khách hàng là bắt buộc")]
    public int KhachHangId { get; set; }

    [Required(ErrorMessage = "Mã sản phẩm là bắt buộc")]
    public int SanPhamId { get; set; }

    [Range(1, 100, ErrorMessage = "Số lượng phải từ 1 đến 100")]
    public int SoLuong { get; set; } = 1;
}
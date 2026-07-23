using System.ComponentModel.DataAnnotations;

namespace PCZone.API.DTOs;

public class TaoDanhGiaDto
{
    [Required(ErrorMessage = "Mã sản phẩm là bắt buộc")]
    public int SanPhamId { get; set; }

    [Required(ErrorMessage = "Mã khách hàng là bắt buộc")]
    public int KhachHangId { get; set; }

    [Range(1, 5, ErrorMessage = "Số sao phải từ 1 đến 5")]
    public int SoSao { get; set; } = 5;

    [Required(ErrorMessage = "Nội dung đánh giá là bắt buộc")]
    [StringLength(2000, MinimumLength = 2, ErrorMessage = "Nội dung đánh giá phải từ 2-2000 ký tự")]
    public string NoiDung { get; set; } = string.Empty;
}
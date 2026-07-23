using System.ComponentModel.DataAnnotations;

namespace PCZone.API.DTOs;

public class CapNhatCouponDto
{
    [Required(ErrorMessage = "Mã coupon là bắt buộc")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Mã coupon phải từ 3-50 ký tự")]
    public string MaCoupon { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Mô tả không được quá 500 ký tự")]
    public string? MoTa { get; set; }

    [Range(1, 100, ErrorMessage = "Phần trăm giảm phải từ 1 đến 100")]
    public int PhanTramGiam { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Số tiền giảm tối đa không được âm")]
    public decimal? SoTienGiamToiDa { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Điều kiện tối thiểu không được âm")]
    public decimal DieuKienToiThieu { get; set; }

    [Required(ErrorMessage = "Ngày bắt đầu là bắt buộc")]
    public DateTime NgayBatDau { get; set; }

    [Required(ErrorMessage = "Ngày hết hạn là bắt buộc")]
    public DateTime NgayHetHan { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0")]
    public int SoLuong { get; set; } = 100;

    public bool DangHoatDong { get; set; } = true;
}
using System.ComponentModel.DataAnnotations;

namespace PCZone.API.DTOs;

public class TaoDonHangDto
{
    [Required(ErrorMessage = "Mã khách hàng là bắt buộc")]
    public int KhachHangId { get; set; }

    [Required(ErrorMessage = "Địa chỉ giao hàng là bắt buộc")]
    [StringLength(500, MinimumLength = 5, ErrorMessage = "Địa chỉ giao hàng phải từ 5-500 ký tự")]
    public string DiaChiGiao { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phương thức thanh toán là bắt buộc")]
    [StringLength(50, ErrorMessage = "Phương thức thanh toán không được quá 50 ký tự")]
    public string PhuongThucThanhToan { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Ghi chú không được quá 500 ký tự")]
    public string? GhiChu { get; set; }

    [Required(ErrorMessage = "Danh sách sản phẩm là bắt buộc")]
    [MinLength(1, ErrorMessage = "Phải có ít nhất 1 sản phẩm")]
    public List<ChiTietDonHangInput> DanhSachSanPham { get; set; } = new();
}

public class ChiTietDonHangInput
{
    [Required(ErrorMessage = "Mã sản phẩm là bắt buộc")]
    public int SanPhamId { get; set; }

    [Range(1, 100, ErrorMessage = "Số lượng phải từ 1 đến 100")]
    public int SoLuong { get; set; } = 1;
}
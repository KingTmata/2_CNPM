namespace PCZone.API.Models;

public class DonHang
{
    public int Id { get; set; }
    public int KhachHangId { get; set; }
    public DateTime NgayDat { get; set; } = DateTime.Now;
    public string TrangThai { get; set; } = "Chờ xác nhận"; // Chờ xác nhận, Đã xác nhận, Đang giao, Hoàn thành, Đã hủy
    public decimal TongTien { get; set; }
    public string DiaChiGiao { get; set; } = string.Empty;
    public string PhuongThucThanhToan { get; set; } = string.Empty;
    public string? GhiChu { get; set; }

    // Navigation
    public KhachHang? KhachHang { get; set; }
    public ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; } = new List<ChiTietDonHang>();
}
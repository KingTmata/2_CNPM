namespace PCZone.API.Models;

public class KhachHang
{
    public int Id { get; set; }
    public string Ten { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string MatKhau { get; set; } = string.Empty;
    public string SoDienThoai { get; set; } = string.Empty;
    public string DiaChi { get; set; } = string.Empty;
    public string VaiTro { get; set; } = "Customer"; // "Admin" hoặc "Customer"
    public DateTime NgayTao { get; set; } = DateTime.Now;

    // Navigation
    public ICollection<DonHang> DonHangs { get; set; } = new List<DonHang>();
    public ICollection<DanhGia> DanhGias { get; set; } = new List<DanhGia>();
    public GioHang? GioHang { get; set; }
}
namespace PCZone.API.Models;

public class DanhGia
{
    public int Id { get; set; }
    public int SanPhamId { get; set; }
    public int KhachHangId { get; set; }
    public int SoSao { get; set; } = 5;
    public string NoiDung { get; set; } = string.Empty;
    public DateTime NgayTao { get; set; } = DateTime.Now;

    // Navigation
    public SanPham? SanPham { get; set; }
    public KhachHang? KhachHang { get; set; }
}
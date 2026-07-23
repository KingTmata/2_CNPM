namespace PCZone.API.Models;

public class ChiTietDonHang
{
    public int Id { get; set; }
    public int DonHangId { get; set; }
    public int SanPhamId { get; set; }
    public int SoLuong { get; set; } = 1;
    public decimal Gia { get; set; }

    // Navigation
    public DonHang? DonHang { get; set; }
    public SanPham? SanPham { get; set; }
}
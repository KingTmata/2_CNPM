namespace PCZone.API.Models;

public class ChiTietGioHang
{
    public int Id { get; set; }
    public int GioHangId { get; set; }
    public int SanPhamId { get; set; }
    public int SoLuong { get; set; } = 1;
    public decimal DonGia { get; set; }

    // Navigation
    public GioHang? GioHang { get; set; }
    public SanPham? SanPham { get; set; }
}
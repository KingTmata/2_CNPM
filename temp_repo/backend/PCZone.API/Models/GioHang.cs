namespace PCZone.API.Models;

public class GioHang
{
    public int Id { get; set; }
    public int KhachHangId { get; set; }
    public DateTime NgayTao { get; set; } = DateTime.Now;

    // Navigation
    public KhachHang? KhachHang { get; set; }
    public ICollection<ChiTietGioHang> ChiTietGioHangs { get; set; } = new List<ChiTietGioHang>();
}
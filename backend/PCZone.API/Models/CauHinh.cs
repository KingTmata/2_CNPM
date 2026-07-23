namespace PCZone.API.Models;

public class CauHinh
{
    public int Id { get; set; }
    public string Ten { get; set; } = string.Empty;
    public int? KhachHangId { get; set; }
    public KhachHang? KhachHang { get; set; }
    public decimal TongTien { get; set; }
    public string MucDich { get; set; } = string.Empty; // gaming, van-phong, do-hoa, stream
    public string GhiChu { get; set; } = string.Empty;
    public DateTime NgayTao { get; set; } = DateTime.Now;
    public string MaChiaSe { get; set; } = string.Empty; // để chia sẻ cấu hình

    // Navigation
    public ICollection<ChiTietCauHinh> ChiTietCauHinhs { get; set; } = new List<ChiTietCauHinh>();
}
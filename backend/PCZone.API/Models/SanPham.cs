namespace PCZone.API.Models;

public class SanPham
{
    public int Id { get; set; }
    public string Ten { get; set; } = string.Empty;
    public decimal Gia { get; set; }
    public decimal? GiaGoc { get; set; }
    public string MoTa { get; set; } = string.Empty;
    public string HinhAnh { get; set; } = string.Empty;
    public int SoLuongTon { get; set; }
    public bool DangKinhDoanh { get; set; } = true;
    public DateTime NgayTao { get; set; } = DateTime.Now;
    public string? Specs { get; set; }
    public string? Hang { get; set; }
    public string? Badge { get; set; }
    public string? FormFactor { get; set; }
    public double DiemCpu { get; set; }
    public double DiemGpu { get; set; }
    public double Rating { get; set; } = 4.9;
    public int LuotMua { get; set; }

    public int DanhMucId { get; set; }
    public DanhMuc? DanhMuc { get; set; }

    // Navigation
    public ICollection<ChiTietGioHang> ChiTietGioHangs { get; set; } = new List<ChiTietGioHang>();
    public ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; } = new List<ChiTietDonHang>();
    public ICollection<DanhGia> DanhGias { get; set; } = new List<DanhGia>();
}
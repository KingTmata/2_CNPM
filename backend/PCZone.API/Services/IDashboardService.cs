namespace PCZone.API.Services;

public class DashboardThongKe
{
    public int TongSanPham { get; set; }
    public int TongDonHang { get; set; }
    public int TongKhachHang { get; set; }
    public decimal TongDoanhThu { get; set; }
    public int DonHangChoXuLy { get; set; }
    public int SanPhamSapHet { get; set; }
    public List<DoanhThuThang> DoanhThuTheoThang { get; set; } = new();
    public List<DonHangGanDay> DonHangGanDay { get; set; } = new();
    public List<SanPhamBanChay> SanPhamBanChay { get; set; } = new();
}

public class DoanhThuThang
{
    public int Thang { get; set; }
    public decimal DoanhThu { get; set; }
    public int SoDon { get; set; }
}

public class DonHangGanDay
{
    public int Id { get; set; }
    public string KhachHang { get; set; } = string.Empty;
    public decimal TongTien { get; set; }
    public string TrangThai { get; set; } = string.Empty;
    public DateTime NgayDat { get; set; }
}

public class SanPhamBanChay
{
    public int Id { get; set; }
    public string Ten { get; set; } = string.Empty;
    public string DanhMuc { get; set; } = string.Empty;
    public decimal Gia { get; set; }
    public int SoLuongDaBan { get; set; }
}

public interface IDashboardService
{
    Task<DashboardThongKe> LayThongKeAsync();
}
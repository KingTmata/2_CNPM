namespace PCZone.API.DTOs;

public class KiemTraTuongThichDto
{
    public List<LinhKienTrongBuild> LinhKiens { get; set; } = new();
}

public class LinhKienTrongBuild
{
    public int SanPhamId { get; set; }
    public string Loai { get; set; } = string.Empty; // cpu, gpu, mainboard, ram, storage, psu, case, cooler, fans
    public int SoLuong { get; set; } = 1;
}

public class KetQuaTuongThich
{
    public bool TuongThich { get; set; }
    public List<string> CanhBao { get; set; } = new();
    public List<string> Loi { get; set; } = new();
    public ThongTinBuild? ThongTin { get; set; }
}

public class ThongTinBuild
{
    public decimal TongTien { get; set; }
    public int TongCongSuatW { get; set; }
    public int CongSuatDeXuatW { get; set; }
    public double DiemHieuNang { get; set; }
}

public class GoiYBuildDto
{
    public decimal NganSach { get; set; }
    public string MucDich { get; set; } = "gaming"; // gaming, van-phong, do-hoa, stream
    public string? GhiChu { get; set; }
}

public class GoiYBuildResult
{
    public List<GoiYLinhKien> LinhKiens { get; set; } = new();
    public decimal TongTien { get; set; }
    public string LoiKhuyen { get; set; } = string.Empty;
}

public class GoiYLinhKien
{
    public string Loai { get; set; } = string.Empty;
    public string TenLoai { get; set; } = string.Empty;
    public int? SanPhamId { get; set; }
    public string? TenSanPham { get; set; }
    public decimal? Gia { get; set; }
    public string? HinhAnh { get; set; }
    public string GhiChu { get; set; } = string.Empty;
}

public class LuuCauHinhDto
{
    public string Ten { get; set; } = string.Empty;
    public int? KhachHangId { get; set; }
    public string MucDich { get; set; } = "gaming";
    public string GhiChu { get; set; } = string.Empty;
    public List<LinhKienTrongBuild> LinhKiens { get; set; } = new();
}

public class CauHinhDto
{
    public int Id { get; set; }
    public string Ten { get; set; } = string.Empty;
    public int? KhachHangId { get; set; }
    public string? TenKhachHang { get; set; }
    public decimal TongTien { get; set; }
    public string MucDich { get; set; } = string.Empty;
    public string GhiChu { get; set; } = string.Empty;
    public DateTime NgayTao { get; set; }
    public string MaChiaSe { get; set; } = string.Empty;
    public List<ChiTietCauHinhDto> ChiTiets { get; set; } = new();
}

public class ChiTietCauHinhDto
{
    public int Id { get; set; }
    public int SanPhamId { get; set; }
    public string TenSanPham { get; set; } = string.Empty;
    public string HinhAnh { get; set; } = string.Empty;
    public decimal Gia { get; set; }
    public string LoaiLinhKien { get; set; } = string.Empty;
    public int SoLuong { get; set; } = 1;
}
namespace PCZone.API.Models;

public class ChiTietCauHinh
{
    public int Id { get; set; }
    public int CauHinhId { get; set; }
    public CauHinh? CauHinh { get; set; }
    public int SanPhamId { get; set; }
    public SanPham? SanPham { get; set; }
    public int SoLuong { get; set; } = 1;
    public string LoaiLinhKien { get; set; } = string.Empty; // cpu, gpu, ram, mainboard, storage, psu, case, cooler, fans, monitor, peripherals
}
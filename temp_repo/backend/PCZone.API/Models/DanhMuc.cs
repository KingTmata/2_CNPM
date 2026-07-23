namespace PCZone.API.Models;

public class DanhMuc
{
    public int Id { get; set; }
    public string Ten { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public string? HinhAnh { get; set; }

    // Navigation
    public ICollection<SanPham> SanPhams { get; set; } = new List<SanPham>();
}
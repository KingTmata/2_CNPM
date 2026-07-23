namespace PCZone.API.Models;

public class Coupon
{
    public int Id { get; set; }
    public string MaCoupon { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public int PhanTramGiam { get; set; }
    public decimal? SoTienGiamToiDa { get; set; }
    public decimal DieuKienToiThieu { get; set; }
    public DateTime NgayBatDau { get; set; }
    public DateTime NgayHetHan { get; set; }
    public int SoLuong { get; set; } = 100;
    public int DaSuDung { get; set; }
    public bool DangHoatDong { get; set; } = true;
}
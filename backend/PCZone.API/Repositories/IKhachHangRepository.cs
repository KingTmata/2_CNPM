using PCZone.API.Models;

namespace PCZone.API.Repositories;

public interface IKhachHangRepository
{
    Task<List<KhachHang>> LayTatCaAsync();
    Task<KhachHang?> LayTheoIdAsync(int id);
    Task<KhachHang?> LayTheoEmailAsync(string email);
    Task ThemAsync(KhachHang khachHang);
    Task CapNhatAsync(KhachHang khachHang);
    Task XoaAsync(KhachHang khachHang);
    Task LuuAsync();
}
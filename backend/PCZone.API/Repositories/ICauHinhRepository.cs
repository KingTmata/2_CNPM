using PCZone.API.Models;

namespace PCZone.API.Repositories;

public interface ICauHinhRepository
{
    Task<List<CauHinh>> LayTatCaAsync();
    Task<CauHinh?> LayTheoIdAsync(int id);
    Task<CauHinh?> LayTheoMaChiaSeAsync(string maChiaSe);
    Task<List<CauHinh>> LayTheoKhachHangAsync(int khachHangId);
    Task ThemAsync(CauHinh cauHinh);
    Task CapNhatAsync(CauHinh cauHinh);
    Task XoaAsync(CauHinh cauHinh);
    Task LuuAsync();
}
using PCZone.API.Models;

namespace PCZone.API.Repositories;

public interface ISanPhamRepository
{
    Task<List<SanPham>> LayTatCaAsync();

    Task<SanPham?> LayTheoIdAsync(int id);

    Task ThemAsync(SanPham sanPham);

    Task CapNhatAsync(SanPham sanPham);

    Task XoaAsync(SanPham sanPham);

    Task LuuAsync();
}
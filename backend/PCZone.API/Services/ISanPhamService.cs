using PCZone.API.DTOs;
using PCZone.API.Models;

namespace PCZone.API.Services;

public interface ISanPhamService
{
    Task<List<SanPham>> LayTatCaAsync();

    Task<SanPham?> LayTheoIdAsync(int id);

    Task TaoAsync(TaoSanPhamDto dto);

    Task<bool> CapNhatAsync(int id, CapNhatSanPhamDto dto);

    Task<bool> XoaAsync(int id);
}
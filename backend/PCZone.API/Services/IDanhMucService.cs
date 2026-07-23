using PCZone.API.DTOs;
using PCZone.API.Models;

namespace PCZone.API.Services;

public interface IDanhMucService
{
    Task<List<DanhMuc>> LayTatCaAsync();
    Task<DanhMuc?> LayTheoIdAsync(int id);
    Task<DanhMuc> TaoAsync(TaoDanhMucDto dto);
    Task<DanhMuc?> CapNhatAsync(int id, CapNhatDanhMucDto dto);
    Task<bool> XoaAsync(int id);
}
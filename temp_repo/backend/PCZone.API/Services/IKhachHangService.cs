using PCZone.API.DTOs;
using PCZone.API.Models;

namespace PCZone.API.Services;

public interface IKhachHangService
{
    Task<List<KhachHang>> LayTatCaAsync();
    Task<KhachHang?> LayTheoIdAsync(int id);
    Task<KhachHang?> DangKyAsync(DangKyDto dto);
    Task<bool> CapNhatAsync(int id, CapNhatKhachHangDto dto);
    Task<bool> XoaAsync(int id);
}
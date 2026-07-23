using PCZone.API.DTOs;
using PCZone.API.Models;

namespace PCZone.API.Services;

public interface IGioHangService
{
    Task<GioHang?> LayGioHangAsync(int khachHangId);
    Task<ChiTietGioHang> ThemSanPhamAsync(ThemGioHangDto dto);
    Task<ChiTietGioHang?> CapNhatSoLuongAsync(int chiTietId, CapNhatGioHangDto dto);
    Task<bool> XoaSanPhamAsync(int chiTietId);
    Task<decimal> TinhTongTienAsync(int khachHangId);
    Task<bool> XoaGioHangAsync(int khachHangId);
}
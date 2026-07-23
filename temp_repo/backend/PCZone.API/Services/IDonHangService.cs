using PCZone.API.DTOs;
using PCZone.API.Models;

namespace PCZone.API.Services;

public interface IDonHangService
{
    Task<List<DonHang>> LayTatCaAsync();
    Task<DonHang?> LayTheoIdAsync(int id);
    Task<List<DonHang>> LayLichSuDonAsync(int khachHangId);
    Task<DonHang> TaoDonAsync(TaoDonHangDto dto);
    Task<DonHang?> CapNhatTrangThaiAsync(int id, CapNhatTrangThaiDto dto);
    Task<bool> HuyDonAsync(int id);
}
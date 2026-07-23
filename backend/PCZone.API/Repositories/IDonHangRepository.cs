using PCZone.API.Models;

namespace PCZone.API.Repositories;

public interface IDonHangRepository
{
    Task<List<DonHang>> GetAllAsync();
    Task<DonHang?> GetByIdAsync(int id);
    Task<List<DonHang>> GetByKhachHangIdAsync(int khachHangId);
    Task<DonHang> AddAsync(DonHang donHang);
    Task<DonHang?> UpdateStatusAsync(int id, string trangThai);
    Task<bool> DeleteAsync(int id);
}
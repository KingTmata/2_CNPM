using PCZone.API.Models;

namespace PCZone.API.Repositories;

public interface IGioHangRepository
{
    Task<GioHang?> GetByKhachHangIdAsync(int khachHangId);
    Task<ChiTietGioHang?> GetChiTietByIdAsync(int chiTietId);
    Task<ChiTietGioHang> AddItemAsync(ChiTietGioHang chiTiet);
    Task<ChiTietGioHang?> UpdateQuantityAsync(int chiTietId, int soLuong);
    Task<bool> RemoveItemAsync(int chiTietId);
    Task<bool> ClearAsync(int khachHangId);
}
using PCZone.API.Models;

namespace PCZone.API.Repositories;

public interface IDanhGiaRepository
{
    Task<List<DanhGia>> GetBySanPhamIdAsync(int sanPhamId);
    Task<DanhGia?> GetByIdAsync(int id);
    Task<DanhGia> AddAsync(DanhGia danhGia);
    Task<DanhGia?> UpdateAsync(int id, DanhGia danhGia);
    Task<bool> DeleteAsync(int id);
    Task<double> GetAverageRatingAsync(int sanPhamId);
}
using PCZone.API.Models;

namespace PCZone.API.Repositories;

public interface IDanhMucRepository
{
    Task<List<DanhMuc>> GetAllAsync();
    Task<DanhMuc?> GetByIdAsync(int id);
    Task<DanhMuc> AddAsync(DanhMuc danhMuc);
    Task<DanhMuc?> UpdateAsync(int id, DanhMuc danhMuc);
    Task<bool> DeleteAsync(int id);
}
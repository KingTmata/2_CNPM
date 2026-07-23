using Microsoft.EntityFrameworkCore;
using PCZone.API.Data;
using PCZone.API.Models;

namespace PCZone.API.Repositories;

public class DanhGiaRepository : IDanhGiaRepository
{
    private readonly UngDungDbContext _db;

    public DanhGiaRepository(UngDungDbContext db)
    {
        _db = db;
    }

    public async Task<List<DanhGia>> GetBySanPhamIdAsync(int sanPhamId)
    {
        return await _db.DanhGias
            .Include(d => d.KhachHang)
            .Where(d => d.SanPhamId == sanPhamId)
            .OrderByDescending(d => d.NgayTao)
            .ToListAsync();
    }

    public async Task<DanhGia?> GetByIdAsync(int id)
    {
        return await _db.DanhGias
            .Include(d => d.KhachHang)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<DanhGia> AddAsync(DanhGia danhGia)
    {
        _db.DanhGias.Add(danhGia);
        await _db.SaveChangesAsync();
        return danhGia;
    }

    public async Task<DanhGia?> UpdateAsync(int id, DanhGia danhGia)
    {
        var existing = await _db.DanhGias.FindAsync(id);
        if (existing == null) return null;

        existing.SoSao = danhGia.SoSao;
        existing.NoiDung = danhGia.NoiDung;
        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.DanhGias.FindAsync(id);
        if (existing == null) return false;

        _db.DanhGias.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<double> GetAverageRatingAsync(int sanPhamId)
    {
        if (!await _db.DanhGias.AnyAsync(d => d.SanPhamId == sanPhamId))
            return 0;

        return await _db.DanhGias
            .Where(d => d.SanPhamId == sanPhamId)
            .AverageAsync(d => (double)d.SoSao);
    }
}
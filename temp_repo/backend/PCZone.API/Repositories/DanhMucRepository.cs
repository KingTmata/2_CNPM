using Microsoft.EntityFrameworkCore;
using PCZone.API.Data;
using PCZone.API.Models;

namespace PCZone.API.Repositories;

public class DanhMucRepository : IDanhMucRepository
{
    private readonly UngDungDbContext _db;

    public DanhMucRepository(UngDungDbContext db)
    {
        _db = db;
    }

    public async Task<List<DanhMuc>> GetAllAsync()
    {
        return await _db.DanhMucs.ToListAsync();
    }

    public async Task<DanhMuc?> GetByIdAsync(int id)
    {
        return await _db.DanhMucs.FindAsync(id);
    }

    public async Task<DanhMuc> AddAsync(DanhMuc danhMuc)
    {
        _db.DanhMucs.Add(danhMuc);
        await _db.SaveChangesAsync();
        return danhMuc;
    }

    public async Task<DanhMuc?> UpdateAsync(int id, DanhMuc danhMuc)
    {
        var existing = await _db.DanhMucs.FindAsync(id);
        if (existing == null) return null;

        existing.Ten = danhMuc.Ten;
        existing.MoTa = danhMuc.MoTa;
        existing.HinhAnh = danhMuc.HinhAnh;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.DanhMucs.FindAsync(id);
        if (existing == null) return false;

        _db.DanhMucs.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }
}
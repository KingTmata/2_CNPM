using Microsoft.EntityFrameworkCore;
using PCZone.API.Data;
using PCZone.API.Models;

namespace PCZone.API.Repositories;

public class DonHangRepository : IDonHangRepository
{
    private readonly UngDungDbContext _db;

    public DonHangRepository(UngDungDbContext db)
    {
        _db = db;
    }

    public async Task<List<DonHang>> GetAllAsync()
    {
        return await _db.DonHangs
            .Include(d => d.ChiTietDonHangs)
                .ThenInclude(ct => ct.SanPham)
            .OrderByDescending(d => d.NgayDat)
            .ToListAsync();
    }

    public async Task<DonHang?> GetByIdAsync(int id)
    {
        return await _db.DonHangs
            .Include(d => d.ChiTietDonHangs)
                .ThenInclude(ct => ct.SanPham)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<List<DonHang>> GetByKhachHangIdAsync(int khachHangId)
    {
        return await _db.DonHangs
            .Include(d => d.ChiTietDonHangs)
                .ThenInclude(ct => ct.SanPham)
            .Where(d => d.KhachHangId == khachHangId)
            .OrderByDescending(d => d.NgayDat)
            .ToListAsync();
    }

    public async Task<DonHang> AddAsync(DonHang donHang)
    {
        _db.DonHangs.Add(donHang);
        await _db.SaveChangesAsync();
        return donHang;
    }

    public async Task<DonHang?> UpdateStatusAsync(int id, string trangThai)
    {
        var donHang = await _db.DonHangs.FindAsync(id);
        if (donHang == null) return null;

        donHang.TrangThai = trangThai;
        await _db.SaveChangesAsync();
        return donHang;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var donHang = await _db.DonHangs.FindAsync(id);
        if (donHang == null) return false;

        _db.DonHangs.Remove(donHang);
        await _db.SaveChangesAsync();
        return true;
    }
}
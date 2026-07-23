using Microsoft.EntityFrameworkCore;
using PCZone.API.Data;
using PCZone.API.Models;

namespace PCZone.API.Repositories;

public class CauHinhRepository : ICauHinhRepository
{
    private readonly UngDungDbContext _context;

    public CauHinhRepository(UngDungDbContext context)
    {
        _context = context;
    }

    public async Task<List<CauHinh>> LayTatCaAsync()
    {
        return await _context.Set<CauHinh>()
            .Include(c => c.ChiTietCauHinhs)
                .ThenInclude(ct => ct.SanPham)
            .Include(c => c.KhachHang)
            .OrderByDescending(c => c.NgayTao)
            .ToListAsync();
    }

    public async Task<CauHinh?> LayTheoIdAsync(int id)
    {
        return await _context.Set<CauHinh>()
            .Include(c => c.ChiTietCauHinhs)
                .ThenInclude(ct => ct.SanPham)
            .Include(c => c.KhachHang)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<CauHinh?> LayTheoMaChiaSeAsync(string maChiaSe)
    {
        return await _context.Set<CauHinh>()
            .Include(c => c.ChiTietCauHinhs)
                .ThenInclude(ct => ct.SanPham)
            .Include(c => c.KhachHang)
            .FirstOrDefaultAsync(c => c.MaChiaSe == maChiaSe);
    }

    public async Task<List<CauHinh>> LayTheoKhachHangAsync(int khachHangId)
    {
        return await _context.Set<CauHinh>()
            .Include(c => c.ChiTietCauHinhs)
                .ThenInclude(ct => ct.SanPham)
            .Where(c => c.KhachHangId == khachHangId)
            .OrderByDescending(c => c.NgayTao)
            .ToListAsync();
    }

    public async Task ThemAsync(CauHinh cauHinh)
    {
        await _context.Set<CauHinh>().AddAsync(cauHinh);
    }

    public Task CapNhatAsync(CauHinh cauHinh)
    {
        _context.Set<CauHinh>().Update(cauHinh);
        return Task.CompletedTask;
    }

    public Task XoaAsync(CauHinh cauHinh)
    {
        _context.Set<CauHinh>().Remove(cauHinh);
        return Task.CompletedTask;
    }

    public async Task LuuAsync()
    {
        await _context.SaveChangesAsync();
    }
}
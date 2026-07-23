using Microsoft.EntityFrameworkCore;
using PCZone.API.Data;
using PCZone.API.Models;

namespace PCZone.API.Repositories;

public class SanPhamRepository : ISanPhamRepository
{
    private readonly UngDungDbContext _context;

    public SanPhamRepository(UngDungDbContext context)
    {
        _context = context;
    }

    public async Task<List<SanPham>> LayTatCaAsync()
    {
        return await _context.SanPhams.Include(s => s.DanhMuc).ToListAsync();
    }

    public async Task<SanPham?> LayTheoIdAsync(int id)
    {
        return await _context.SanPhams.Include(s => s.DanhMuc).FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task ThemAsync(SanPham sanPham)
    {
        await _context.SanPhams.AddAsync(sanPham);
    }

    public Task CapNhatAsync(SanPham sanPham)
    {
        _context.SanPhams.Update(sanPham);
        return Task.CompletedTask;
    }

    public Task XoaAsync(SanPham sanPham)
    {
        _context.SanPhams.Remove(sanPham);
        return Task.CompletedTask;
    }

    public async Task LuuAsync()
    {
        await _context.SaveChangesAsync();
    }
}
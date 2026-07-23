using Microsoft.EntityFrameworkCore;
using PCZone.API.Data;
using PCZone.API.Models;

namespace PCZone.API.Repositories;

public class KhachHangRepository : IKhachHangRepository
{
    private readonly UngDungDbContext _context;

    public KhachHangRepository(UngDungDbContext context)
    {
        _context = context;
    }

    public async Task<List<KhachHang>> LayTatCaAsync()
    {
        return await _context.KhachHangs.ToListAsync();
    }

    public async Task<KhachHang?> LayTheoIdAsync(int id)
    {
        return await _context.KhachHangs.FindAsync(id);
    }

    public async Task<KhachHang?> LayTheoEmailAsync(string email)
    {
        return await _context.KhachHangs.FirstOrDefaultAsync(k => k.Email == email);
    }

    public async Task ThemAsync(KhachHang khachHang)
    {
        await _context.KhachHangs.AddAsync(khachHang);
    }

    public Task CapNhatAsync(KhachHang khachHang)
    {
        _context.KhachHangs.Update(khachHang);
        return Task.CompletedTask;
    }

    public Task XoaAsync(KhachHang khachHang)
    {
        _context.KhachHangs.Remove(khachHang);
        return Task.CompletedTask;
    }

    public async Task LuuAsync()
    {
        await _context.SaveChangesAsync();
    }
}
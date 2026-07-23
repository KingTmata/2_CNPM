using Microsoft.EntityFrameworkCore;
using PCZone.API.Data;
using PCZone.API.Models;

namespace PCZone.API.Repositories;

public class GioHangRepository : IGioHangRepository
{
    private readonly UngDungDbContext _db;

    public GioHangRepository(UngDungDbContext db)
    {
        _db = db;
    }

    public async Task<GioHang?> GetByKhachHangIdAsync(int khachHangId)
    {
        // Tìm giỏ hàng của khách, nếu chưa có thì tạo mới
        var gioHang = await _db.GioHangs
            .Include(g => g.ChiTietGioHangs)
                .ThenInclude(ct => ct.SanPham)
            .FirstOrDefaultAsync(g => g.KhachHangId == khachHangId);

        if (gioHang == null)
        {
            gioHang = new GioHang
            {
                KhachHangId = khachHangId,
                NgayTao = DateTime.Now
            };
            _db.GioHangs.Add(gioHang);
            await _db.SaveChangesAsync();
        }

        return gioHang;
    }

    public async Task<ChiTietGioHang?> GetChiTietByIdAsync(int chiTietId)
    {
        return await _db.ChiTietGioHangs
            .Include(ct => ct.SanPham)
            .FirstOrDefaultAsync(ct => ct.Id == chiTietId);
    }

    public async Task<ChiTietGioHang> AddItemAsync(ChiTietGioHang chiTiet)
    {
        // Kiểm tra sản phẩm đã có trong giỏ chưa
        var existing = await _db.ChiTietGioHangs
            .FirstOrDefaultAsync(ct => ct.GioHangId == chiTiet.GioHangId && ct.SanPhamId == chiTiet.SanPhamId);

        if (existing != null)
        {
            // Nếu có rồi thì tăng số lượng
            existing.SoLuong += chiTiet.SoLuong;
            await _db.SaveChangesAsync();
            return existing;
        }

        _db.ChiTietGioHangs.Add(chiTiet);
        await _db.SaveChangesAsync();
        return chiTiet;
    }

    public async Task<ChiTietGioHang?> UpdateQuantityAsync(int chiTietId, int soLuong)
    {
        var chiTiet = await _db.ChiTietGioHangs.FindAsync(chiTietId);
        if (chiTiet == null) return null;

        if (soLuong <= 0)
        {
            _db.ChiTietGioHangs.Remove(chiTiet);
        }
        else
        {
            chiTiet.SoLuong = soLuong;
        }

        await _db.SaveChangesAsync();
        return chiTiet;
    }

    public async Task<bool> RemoveItemAsync(int chiTietId)
    {
        var chiTiet = await _db.ChiTietGioHangs.FindAsync(chiTietId);
        if (chiTiet == null) return false;

        _db.ChiTietGioHangs.Remove(chiTiet);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ClearAsync(int khachHangId)
    {
        var gioHang = await _db.GioHangs
            .Include(g => g.ChiTietGioHangs)
            .FirstOrDefaultAsync(g => g.KhachHangId == khachHangId);

        if (gioHang == null) return false;

        _db.ChiTietGioHangs.RemoveRange(gioHang.ChiTietGioHangs);
        await _db.SaveChangesAsync();
        return true;
    }
}
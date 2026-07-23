using Microsoft.EntityFrameworkCore;
using PCZone.API.Data;
using PCZone.API.Models;

namespace PCZone.API.Repositories;

public class CouponRepository : ICouponRepository
{
    private readonly UngDungDbContext _db;

    public CouponRepository(UngDungDbContext db)
    {
        _db = db;
    }

    public async Task<List<Coupon>> GetAllAsync()
    {
        return await _db.Coupons.ToListAsync();
    }

    public async Task<Coupon?> GetByIdAsync(int id)
    {
        return await _db.Coupons.FindAsync(id);
    }

    public async Task<Coupon?> GetByMaAsync(string maCoupon)
    {
        return await _db.Coupons.FirstOrDefaultAsync(c => c.MaCoupon == maCoupon);
    }

    public async Task<Coupon> AddAsync(Coupon coupon)
    {
        _db.Coupons.Add(coupon);
        await _db.SaveChangesAsync();
        return coupon;
    }

    public async Task<Coupon?> UpdateAsync(int id, Coupon coupon)
    {
        var existing = await _db.Coupons.FindAsync(id);
        if (existing == null) return null;

        existing.MaCoupon = coupon.MaCoupon;
        existing.MoTa = coupon.MoTa;
        existing.PhanTramGiam = coupon.PhanTramGiam;
        existing.SoTienGiamToiDa = coupon.SoTienGiamToiDa;
        existing.DieuKienToiThieu = coupon.DieuKienToiThieu;
        existing.NgayBatDau = coupon.NgayBatDau;
        existing.NgayHetHan = coupon.NgayHetHan;
        existing.SoLuong = coupon.SoLuong;
        existing.DangHoatDong = coupon.DangHoatDong;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.Coupons.FindAsync(id);
        if (existing == null) return false;

        _db.Coupons.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }
}
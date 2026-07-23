using PCZone.API.DTOs;
using PCZone.API.Models;

namespace PCZone.API.Services;

public interface ICouponService
{
    Task<List<Coupon>> LayTatCaAsync();
    Task<Coupon?> LayTheoIdAsync(int id);
    Task<Coupon?> LayTheoMaAsync(string maCoupon);
    Task<Coupon> TaoAsync(TaoCouponDto dto);
    Task<Coupon?> CapNhatAsync(int id, CapNhatCouponDto dto);
    Task<bool> XoaAsync(int id);
}
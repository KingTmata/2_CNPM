using PCZone.API.Models;

namespace PCZone.API.Repositories;

public interface ICouponRepository
{
    Task<List<Coupon>> GetAllAsync();
    Task<Coupon?> GetByIdAsync(int id);
    Task<Coupon?> GetByMaAsync(string maCoupon);
    Task<Coupon> AddAsync(Coupon coupon);
    Task<Coupon?> UpdateAsync(int id, Coupon coupon);
    Task<bool> DeleteAsync(int id);
}
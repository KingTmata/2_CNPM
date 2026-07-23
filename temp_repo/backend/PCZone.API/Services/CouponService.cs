using PCZone.API.DTOs;
using PCZone.API.Models;
using PCZone.API.Repositories;

namespace PCZone.API.Services;

public class CouponService : ICouponService
{
    private readonly ICouponRepository _couponRepository;

    public CouponService(ICouponRepository couponRepository)
    {
        _couponRepository = couponRepository;
    }

    public async Task<List<Coupon>> LayTatCaAsync()
    {
        return await _couponRepository.GetAllAsync();
    }

    public async Task<Coupon?> LayTheoIdAsync(int id)
    {
        return await _couponRepository.GetByIdAsync(id);
    }

    public async Task<Coupon?> LayTheoMaAsync(string maCoupon)
    {
        return await _couponRepository.GetByMaAsync(maCoupon);
    }

    public async Task<Coupon> TaoAsync(TaoCouponDto dto)
    {
        // Kiểm tra mã coupon đã tồn tại
        var existing = await _couponRepository.GetByMaAsync(dto.MaCoupon);
        if (existing != null)
            throw new Exception("Mã coupon đã tồn tại");

        var coupon = new Coupon
        {
            MaCoupon = dto.MaCoupon,
            MoTa = dto.MoTa,
            PhanTramGiam = dto.PhanTramGiam,
            SoTienGiamToiDa = dto.SoTienGiamToiDa,
            DieuKienToiThieu = dto.DieuKienToiThieu,
            NgayBatDau = dto.NgayBatDau,
            NgayHetHan = dto.NgayHetHan,
            SoLuong = dto.SoLuong,
            DaSuDung = 0,
            DangHoatDong = true
        };

        return await _couponRepository.AddAsync(coupon);
    }

    public async Task<Coupon?> CapNhatAsync(int id, CapNhatCouponDto dto)
    {
        var coupon = new Coupon
        {
            MaCoupon = dto.MaCoupon,
            MoTa = dto.MoTa,
            PhanTramGiam = dto.PhanTramGiam,
            SoTienGiamToiDa = dto.SoTienGiamToiDa,
            DieuKienToiThieu = dto.DieuKienToiThieu,
            NgayBatDau = dto.NgayBatDau,
            NgayHetHan = dto.NgayHetHan,
            SoLuong = dto.SoLuong,
            DangHoatDong = dto.DangHoatDong
        };

        return await _couponRepository.UpdateAsync(id, coupon);
    }

    public async Task<bool> XoaAsync(int id)
    {
        return await _couponRepository.DeleteAsync(id);
    }
}
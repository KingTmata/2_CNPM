using PCZone.API.DTOs;
using PCZone.API.Models;
using PCZone.API.Repositories;

namespace PCZone.API.Services;

public class GioHangService : IGioHangService
{
    private readonly IGioHangRepository _gioHangRepository;
    private readonly ISanPhamRepository _sanPhamRepository;

    public GioHangService(IGioHangRepository gioHangRepository, ISanPhamRepository sanPhamRepository)
    {
        _gioHangRepository = gioHangRepository;
        _sanPhamRepository = sanPhamRepository;
    }

    public async Task<GioHang?> LayGioHangAsync(int khachHangId)
    {
        return await _gioHangRepository.GetByKhachHangIdAsync(khachHangId);
    }

    public async Task<ChiTietGioHang> ThemSanPhamAsync(ThemGioHangDto dto)
    {
        // Lấy hoặc tạo giỏ hàng
        var gioHang = await _gioHangRepository.GetByKhachHangIdAsync(dto.KhachHangId);
        if (gioHang == null)
            throw new Exception("Không thể tạo giỏ hàng");

        // Lấy thông tin sản phẩm để lấy giá
        var sanPham = await _sanPhamRepository.LayTheoIdAsync(dto.SanPhamId);
        if (sanPham == null)
            throw new Exception("Sản phẩm không tồn tại");

        var chiTiet = new ChiTietGioHang
        {
            GioHangId = gioHang.Id,
            SanPhamId = dto.SanPhamId,
            SoLuong = dto.SoLuong,
            DonGia = sanPham.Gia
        };

        return await _gioHangRepository.AddItemAsync(chiTiet);
    }

    public async Task<ChiTietGioHang?> CapNhatSoLuongAsync(int chiTietId, CapNhatGioHangDto dto)
    {
        return await _gioHangRepository.UpdateQuantityAsync(chiTietId, dto.SoLuong);
    }

    public async Task<bool> XoaSanPhamAsync(int chiTietId)
    {
        return await _gioHangRepository.RemoveItemAsync(chiTietId);
    }

    public async Task<decimal> TinhTongTienAsync(int khachHangId)
    {
        var gioHang = await _gioHangRepository.GetByKhachHangIdAsync(khachHangId);
        if (gioHang == null || gioHang.ChiTietGioHangs == null || !gioHang.ChiTietGioHangs.Any())
            return 0;

        return gioHang.ChiTietGioHangs.Sum(ct => ct.SoLuong * ct.DonGia);
    }

    public async Task<bool> XoaGioHangAsync(int khachHangId)
    {
        return await _gioHangRepository.ClearAsync(khachHangId);
    }
}
using PCZone.API.DTOs;
using PCZone.API.Mapping;
using PCZone.API.Models;
using PCZone.API.Repositories;

namespace PCZone.API.Services;

public class DonHangService : IDonHangService
{
    private readonly IDonHangRepository _donHangRepository;
    private readonly ISanPhamRepository _sanPhamRepository;

    public DonHangService(IDonHangRepository donHangRepository, ISanPhamRepository sanPhamRepository)
    {
        _donHangRepository = donHangRepository;
        _sanPhamRepository = sanPhamRepository;
    }

    public async Task<List<DonHang>> LayTatCaAsync()
    {
        return await _donHangRepository.GetAllAsync();
    }

    public async Task<DonHang?> LayTheoIdAsync(int id)
    {
        return await _donHangRepository.GetByIdAsync(id);
    }

    public async Task<List<DonHang>> LayLichSuDonAsync(int khachHangId)
    {
        return await _donHangRepository.GetByKhachHangIdAsync(khachHangId);
    }

    public async Task<DonHang> TaoDonAsync(TaoDonHangDto dto)
    {
        if (dto.DanhSachSanPham == null || !dto.DanhSachSanPham.Any())
            throw new Exception("Đơn hàng phải có ít nhất 1 sản phẩm");

        decimal tongTien = 0;
        var chiTietDonHangs = new List<ChiTietDonHang>();

        foreach (var item in dto.DanhSachSanPham)
        {
            var sanPham = await _sanPhamRepository.LayTheoIdAsync(item.SanPhamId);
            if (sanPham == null)
                throw new Exception($"Sản phẩm ID {item.SanPhamId} không tồn tại");

            if (sanPham.SoLuongTon < item.SoLuong)
                throw new Exception($"Sản phẩm '{sanPham.Ten}' không đủ số lượng tồn kho");

            var thanhTien = sanPham.Gia * item.SoLuong;
            tongTien += thanhTien;

            chiTietDonHangs.Add(MapHelper.ToChiTietDonHang(item.SanPhamId, item.SoLuong, sanPham.Gia));

            // Giảm số lượng tồn kho
            sanPham.SoLuongTon -= item.SoLuong;
        }

        var donHang = dto.ToDonHang(tongTien, chiTietDonHangs);

        return await _donHangRepository.AddAsync(donHang);
    }

    public async Task<DonHang?> CapNhatTrangThaiAsync(int id, CapNhatTrangThaiDto dto)
    {
        return await _donHangRepository.UpdateStatusAsync(id, dto.TrangThai);
    }

    public async Task<bool> HuyDonAsync(int id)
    {
        var donHang = await _donHangRepository.GetByIdAsync(id);
        if (donHang == null) return false;

        if (donHang.TrangThai == "Đã hủy" || donHang.TrangThai == "Hoàn thành")
            throw new Exception("Không thể hủy đơn hàng đã hoàn thành hoặc đã hủy");

        // Hoàn lại số lượng tồn kho
        foreach (var chiTiet in donHang.ChiTietDonHangs)
        {
            var sanPham = await _sanPhamRepository.LayTheoIdAsync(chiTiet.SanPhamId);
            if (sanPham != null)
            {
                sanPham.SoLuongTon += chiTiet.SoLuong;
            }
        }

        await _donHangRepository.UpdateStatusAsync(id, "Đã hủy");
        return true;
    }
}
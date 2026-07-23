using PCZone.API.DTOs;
using PCZone.API.Models;

namespace PCZone.API.Mapping;

/// <summary>
/// Lớp Mapping tập trung — chuyển đổi giữa DTO và Model
/// Tất cả mapping thủ công được dồn về đây, Service chỉ việc gọi
/// </summary>
public static class MapHelper
{
    // ==================== SAN PHAM ====================

    public static SanPham ToSanPham(this TaoSanPhamDto dto)
    {
        return new SanPham
        {
            Ten = dto.Ten,
            Gia = dto.Gia,
            MoTa = dto.MoTa,
            HinhAnh = dto.HinhAnh,
            SoLuongTon = dto.SoLuongTon,
            DanhMucId = dto.DanhMucId,
            DangKinhDoanh = true,
            NgayTao = DateTime.Now
        };
    }

    public static void MapToSanPham(this CapNhatSanPhamDto dto, SanPham sanPham)
    {
        sanPham.Ten = dto.Ten;
        sanPham.Gia = dto.Gia;
        sanPham.MoTa = dto.MoTa;
        sanPham.HinhAnh = dto.HinhAnh;
        sanPham.SoLuongTon = dto.SoLuongTon;
        sanPham.DangKinhDoanh = dto.DangKinhDoanh;
        sanPham.DanhMucId = dto.DanhMucId;
    }

    // ==================== DANH MUC ====================

    public static DanhMuc ToDanhMuc(this TaoDanhMucDto dto)
    {
        return new DanhMuc
        {
            Ten = dto.Ten,
            MoTa = dto.MoTa,
            HinhAnh = dto.HinhAnh
        };
    }

    public static DanhMuc ToDanhMuc(this CapNhatDanhMucDto dto)
    {
        return new DanhMuc
        {
            Ten = dto.Ten,
            MoTa = dto.MoTa,
            HinhAnh = dto.HinhAnh
        };
    }

    // ==================== KHACH HANG ====================

    public static KhachHang ToKhachHang(this DangKyDto dto)
    {
        return new KhachHang
        {
            Ten = dto.Ten,
            Email = dto.Email,
            MatKhau = dto.MatKhau,
            SoDienThoai = dto.SoDienThoai,
            DiaChi = dto.DiaChi,
            VaiTro = "Customer",
            NgayTao = DateTime.Now
        };
    }

    public static void MapToKhachHang(this CapNhatKhachHangDto dto, KhachHang khachHang)
    {
        if (dto.Ten != null) khachHang.Ten = dto.Ten;
        if (dto.SoDienThoai != null) khachHang.SoDienThoai = dto.SoDienThoai;
        if (dto.DiaChi != null) khachHang.DiaChi = dto.DiaChi;
    }

    // ==================== DON HANG ====================

    public static ChiTietDonHang ToChiTietDonHang(int sanPhamId, int soLuong, decimal gia)
    {
        return new ChiTietDonHang
        {
            SanPhamId = sanPhamId,
            SoLuong = soLuong,
            Gia = gia
        };
    }

    public static DonHang ToDonHang(this TaoDonHangDto dto, decimal tongTien, List<ChiTietDonHang> chiTiets)
    {
        return new DonHang
        {
            KhachHangId = dto.KhachHangId,
            NgayDat = DateTime.Now,
            TrangThai = "Chờ xác nhận",
            TongTien = tongTien,
            DiaChiGiao = dto.DiaChiGiao,
            PhuongThucThanhToan = dto.PhuongThucThanhToan,
            GhiChu = dto.GhiChu,
            ChiTietDonHangs = chiTiets
        };
    }
}
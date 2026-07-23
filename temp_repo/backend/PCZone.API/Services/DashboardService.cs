using Microsoft.EntityFrameworkCore;
using PCZone.API.Data;

namespace PCZone.API.Services;

public class DashboardService : IDashboardService
{
    private readonly UngDungDbContext _context;

    public DashboardService(UngDungDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardThongKe> LayThongKeAsync()
    {
        var now = DateTime.Now;
        var thongKe = new DashboardThongKe();

        // Tổng số
        thongKe.TongSanPham = await _context.SanPhams.CountAsync();
        thongKe.TongDonHang = await _context.DonHangs.CountAsync();
        thongKe.TongKhachHang = await _context.KhachHangs.CountAsync();
        thongKe.TongDoanhThu = await _context.DonHangs
            .Where(d => d.TrangThai == "Hoàn thành")
            .SumAsync(d => d.TongTien);
        thongKe.DonHangChoXuLy = await _context.DonHangs
            .CountAsync(d => d.TrangThai == "Chờ xác nhận");
        thongKe.SanPhamSapHet = await _context.SanPhams
            .CountAsync(s => s.SoLuongTon > 0 && s.SoLuongTon <= 5);

        // Doanh thu theo tháng (12 tháng gần nhất)
        thongKe.DoanhThuTheoThang = await _context.DonHangs
            .Where(d => d.TrangThai == "Hoàn thành" && d.NgayDat.Year == now.Year)
            .GroupBy(d => d.NgayDat.Month)
            .Select(g => new DoanhThuThang
            {
                Thang = g.Key,
                DoanhThu = g.Sum(d => d.TongTien),
                SoDon = g.Count()
            })
            .OrderBy(d => d.Thang)
            .ToListAsync();

        // Đơn hàng gần đây (5 đơn mới nhất)
        thongKe.DonHangGanDay = await _context.DonHangs
            .OrderByDescending(d => d.NgayDat)
            .Take(5)
            .Select(d => new DonHangGanDay
            {
                Id = d.Id,
                KhachHang = d.KhachHang!.Ten,
                TongTien = d.TongTien,
                TrangThai = d.TrangThai,
                NgayDat = d.NgayDat
            })
            .ToListAsync();

        // Sản phẩm bán chạy (top 5)
        thongKe.SanPhamBanChay = await _context.ChiTietDonHangs
            .Include(c => c.SanPham!)
            .ThenInclude(s => s.DanhMuc!)
            .GroupBy(c => new { c.SanPhamId, c.SanPham!.Ten, c.SanPham.Gia, DanhMucTen = c.SanPham.DanhMuc!.Ten })
            .Select(g => new SanPhamBanChay
            {
                Id = g.Key.SanPhamId,
                Ten = g.Key.Ten,
                DanhMuc = g.Key.DanhMucTen,
                Gia = g.Key.Gia,
                SoLuongDaBan = g.Sum(c => c.SoLuong)
            })
            .OrderByDescending(s => s.SoLuongDaBan)
            .Take(5)
            .ToListAsync();

        return thongKe;
    }
}
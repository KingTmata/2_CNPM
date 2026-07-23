using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PCZone.API.Data;
using PCZone.API.DTOs;
using PCZone.API.Repositories;

namespace PCZone.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly UngDungDbContext _context;
    private readonly IDonHangRepository _donHangRepo;
    private readonly IKhachHangRepository _khachHangRepo;

    public AdminController(
        UngDungDbContext context,
        IDonHangRepository donHangRepo,
        IKhachHangRepository khachHangRepo)
    {
        _context = context;
        _donHangRepo = donHangRepo;
        _khachHangRepo = khachHangRepo;
    }

    /// <summary>
    /// Lấy tất cả đơn hàng (admin)
    /// </summary>
    [HttpGet("orders")]
    public async Task<IActionResult> LayTatCaDonHang()
    {
        var donHangs = await _context.DonHangs
            .Include(d => d.KhachHang)
            .Include(d => d.ChiTietDonHangs)
                .ThenInclude(ct => ct.SanPham)
            .OrderByDescending(d => d.NgayDat)
            .ToListAsync();

        return Ok(donHangs);
    }

    /// <summary>
    /// Cập nhật trạng thái đơn hàng
    /// </summary>
    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> CapNhatTrangThaiDonHang(int id, [FromBody] CapNhatTrangThaiDto dto)
    {
        var donHang = await _donHangRepo.UpdateStatusAsync(id, dto.TrangThai);
        if (donHang == null)
            return NotFound(new { message = "Không tìm thấy đơn hàng." });

        return Ok(new { message = $"Đã cập nhật trạng thái đơn hàng thành: {dto.TrangThai}" });
    }

    /// <summary>
    /// Dashboard thống kê cho admin
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var tongDonHang = await _context.DonHangs.CountAsync();
        var tongDoanhThu = await _context.DonHangs
            .Where(d => d.TrangThai == "Đã giao" || d.TrangThai == "Đã thanh toán")
            .SumAsync(d => d.TongTien);
        var tongSanPham = await _context.SanPhams.CountAsync();
        var tongKhachHang = await _context.KhachHangs.CountAsync();
        var donHangMoi = await _context.DonHangs
            .Where(d => d.TrangThai == "Chờ xác nhận")
            .CountAsync();

        return Ok(new
        {
            tongDonHang,
            tongDoanhThu,
            tongSanPham,
            tongKhachHang,
            donHangMoi
        });
    }
}
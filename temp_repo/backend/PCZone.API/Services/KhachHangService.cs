using PCZone.API.DTOs;
using PCZone.API.Mapping;
using PCZone.API.Models;
using PCZone.API.Repositories;

namespace PCZone.API.Services;

public class KhachHangService : IKhachHangService
{
    private readonly IKhachHangRepository _repository;

    public KhachHangService(IKhachHangRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<KhachHang>> LayTatCaAsync()
    {
        return await _repository.LayTatCaAsync();
    }

    public async Task<KhachHang?> LayTheoIdAsync(int id)
    {
        return await _repository.LayTheoIdAsync(id);
    }

    public async Task<KhachHang?> DangKyAsync(DangKyDto dto)
    {
        // Kiểm tra email đã tồn tại
        var existing = await _repository.LayTheoEmailAsync(dto.Email);
        if (existing != null)
            throw new Exception("Email đã được đăng ký");

        var khachHang = dto.ToKhachHang();

        await _repository.ThemAsync(khachHang);
        await _repository.LuuAsync();

        return khachHang;
    }

    public async Task<bool> CapNhatAsync(int id, CapNhatKhachHangDto dto)
    {
        var khachHang = await _repository.LayTheoIdAsync(id);
        if (khachHang == null) return false;

        dto.MapToKhachHang(khachHang);

        await _repository.CapNhatAsync(khachHang);
        await _repository.LuuAsync();
        return true;
    }

    public async Task<bool> XoaAsync(int id)
    {
        var khachHang = await _repository.LayTheoIdAsync(id);
        if (khachHang == null) return false;

        await _repository.XoaAsync(khachHang);
        await _repository.LuuAsync();
        return true;
    }
}
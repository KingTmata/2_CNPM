using PCZone.API.DTOs;
using PCZone.API.Mapping;
using PCZone.API.Models;
using PCZone.API.Repositories;

namespace PCZone.API.Services;

public class SanPhamService : ISanPhamService
{
    private readonly ISanPhamRepository _sanPhamRepository;

    public SanPhamService(ISanPhamRepository sanPhamRepository)
    {
        _sanPhamRepository = sanPhamRepository;
    }

    public async Task<List<SanPham>> LayTatCaAsync()
    {
        return await _sanPhamRepository.LayTatCaAsync();
    }

    public async Task<SanPham?> LayTheoIdAsync(int id)
    {
        return await _sanPhamRepository.LayTheoIdAsync(id);
    }

    public async Task TaoAsync(TaoSanPhamDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Ten))
            throw new Exception("Tên sản phẩm không được để trống.");

        if (dto.Gia <= 0)
            throw new Exception("Giá sản phẩm phải lớn hơn 0.");

        if (dto.SoLuongTon < 0)
            throw new Exception("Số lượng tồn không hợp lệ.");

        var sanPham = dto.ToSanPham();

        await _sanPhamRepository.ThemAsync(sanPham);
        await _sanPhamRepository.LuuAsync();
    }

    public async Task<bool> CapNhatAsync(int id, CapNhatSanPhamDto dto)
    {
        var sanPham = await _sanPhamRepository.LayTheoIdAsync(id);

        if (sanPham == null)
            return false;

        if (string.IsNullOrWhiteSpace(dto.Ten))
            throw new Exception("Tên sản phẩm không được để trống.");

        if (dto.Gia <= 0)
            throw new Exception("Giá sản phẩm phải lớn hơn 0.");

        dto.MapToSanPham(sanPham);

        await _sanPhamRepository.CapNhatAsync(sanPham);
        await _sanPhamRepository.LuuAsync();

        return true;
    }

    public async Task<bool> XoaAsync(int id)
    {
        var sanPham = await _sanPhamRepository.LayTheoIdAsync(id);

        if (sanPham == null)
            return false;

        await _sanPhamRepository.XoaAsync(sanPham);
        await _sanPhamRepository.LuuAsync();

        return true;
    }
}
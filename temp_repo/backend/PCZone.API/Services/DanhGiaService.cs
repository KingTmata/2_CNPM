using PCZone.API.DTOs;
using PCZone.API.Models;
using PCZone.API.Repositories;

namespace PCZone.API.Services;

public class DanhGiaService : IDanhGiaService
{
    private readonly IDanhGiaRepository _danhGiaRepository;

    public DanhGiaService(IDanhGiaRepository danhGiaRepository)
    {
        _danhGiaRepository = danhGiaRepository;
    }

    public async Task<List<DanhGia>> LayTheoSanPhamAsync(int sanPhamId)
    {
        return await _danhGiaRepository.GetBySanPhamIdAsync(sanPhamId);
    }

    public async Task<DanhGia> TaoAsync(TaoDanhGiaDto dto)
    {
        if (dto.SoSao < 1 || dto.SoSao > 5)
            throw new Exception("Số sao phải từ 1 đến 5");

        var danhGia = new DanhGia
        {
            SanPhamId = dto.SanPhamId,
            KhachHangId = dto.KhachHangId,
            SoSao = dto.SoSao,
            NoiDung = dto.NoiDung,
            NgayTao = DateTime.Now
        };

        return await _danhGiaRepository.AddAsync(danhGia);
    }

    public async Task<DanhGia?> CapNhatAsync(int id, CapNhatDanhGiaDto dto)
    {
        if (dto.SoSao < 1 || dto.SoSao > 5)
            throw new Exception("Số sao phải từ 1 đến 5");

        var danhGia = new DanhGia
        {
            SoSao = dto.SoSao,
            NoiDung = dto.NoiDung
        };

        return await _danhGiaRepository.UpdateAsync(id, danhGia);
    }

    public async Task<bool> XoaAsync(int id)
    {
        return await _danhGiaRepository.DeleteAsync(id);
    }

    public async Task<double> TinhRatingTrungBinhAsync(int sanPhamId)
    {
        return await _danhGiaRepository.GetAverageRatingAsync(sanPhamId);
    }
}
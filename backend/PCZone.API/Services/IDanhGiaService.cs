using PCZone.API.DTOs;
using PCZone.API.Models;

namespace PCZone.API.Services;

public interface IDanhGiaService
{
    Task<List<DanhGia>> LayTheoSanPhamAsync(int sanPhamId);
    Task<DanhGia> TaoAsync(TaoDanhGiaDto dto);
    Task<DanhGia?> CapNhatAsync(int id, CapNhatDanhGiaDto dto);
    Task<bool> XoaAsync(int id);
    Task<double> TinhRatingTrungBinhAsync(int sanPhamId);
}
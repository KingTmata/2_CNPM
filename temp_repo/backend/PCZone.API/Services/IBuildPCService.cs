using PCZone.API.DTOs;

namespace PCZone.API.Services;

public interface IBuildPCService
{
    Task<KetQuaTuongThich> KiemTraTuongThichAsync(KiemTraTuongThichDto dto);
    Task<GoiYBuildResult> GoiYBuildAsync(GoiYBuildDto dto);
    Task<CauHinhDto> LuuCauHinhAsync(LuuCauHinhDto dto);
    Task<List<CauHinhDto>> LayLichSuAsync(int? khachHangId);
    Task<CauHinhDto?> LayTheoIdAsync(int id);
    Task<CauHinhDto?> LayTheoMaChiaSeAsync(string maChiaSe);
    Task<bool> XoaCauHinhAsync(int id);
}
using PCZone.API.DTOs;

namespace PCZone.API.Services;

public interface IDangNhapService
{
    Task<DangNhapResponse> DangNhapAsync(DangNhapDto dto);
}
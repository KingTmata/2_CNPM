using PCZone.API.DTOs;
using PCZone.API.Mapping;
using PCZone.API.Models;
using PCZone.API.Repositories;

namespace PCZone.API.Services;

public class DanhMucService : IDanhMucService
{
    private readonly IDanhMucRepository _danhMucRepository;

    public DanhMucService(IDanhMucRepository danhMucRepository)
    {
        _danhMucRepository = danhMucRepository;
    }

    public async Task<List<DanhMuc>> LayTatCaAsync()
    {
        return await _danhMucRepository.GetAllAsync();
    }

    public async Task<DanhMuc?> LayTheoIdAsync(int id)
    {
        return await _danhMucRepository.GetByIdAsync(id);
    }

    public async Task<DanhMuc> TaoAsync(TaoDanhMucDto dto)
    {
        var danhMuc = dto.ToDanhMuc();
        return await _danhMucRepository.AddAsync(danhMuc);
    }

    public async Task<DanhMuc?> CapNhatAsync(int id, CapNhatDanhMucDto dto)
    {
        var danhMuc = dto.ToDanhMuc();
        return await _danhMucRepository.UpdateAsync(id, danhMuc);
    }

    public async Task<bool> XoaAsync(int id)
    {
        return await _danhMucRepository.DeleteAsync(id);
    }
}
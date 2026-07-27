using Moq;
using PCZone.API.DTOs;
using PCZone.API.Models;
using PCZone.API.Repositories;
using PCZone.API.Services;

namespace PCZone.Tests;

public class BuildPCServiceTests
{
    private readonly Mock<ICauHinhRepository> _mockCauHinhRepo;
    private readonly Mock<ISanPhamRepository> _mockSanPhamRepo;
    private readonly BuildPCService _service;

    public BuildPCServiceTests()
    {
        _mockCauHinhRepo = new Mock<ICauHinhRepository>();
        _mockSanPhamRepo = new Mock<ISanPhamRepository>();
        _service = new BuildPCService(_mockCauHinhRepo.Object, _mockSanPhamRepo.Object);
    }

    [Fact]
    public async Task KiemTraTuongThichAsync_EmptyComponents_ReturnsNotCompatible()
    {
        // Arrange
        var dto = new KiemTraTuongThichDto
        {
            LinhKiens = new List<LinhKienTrongBuild>()
        };

        // Act
        var result = await _service.KiemTraTuongThichAsync(dto);

        // Assert
        Assert.False(result.TuongThich);
        Assert.Contains("Không có linh kiện nào để kiểm tra.", result.Loi);
    }

    [Fact]
    public async Task KiemTraTuongThichAsync_CompatibleCpuAndMainboard_ReturnsCompatible()
    {
        // Arrange
        var dto = new KiemTraTuongThichDto
        {
            LinhKiens = new List<LinhKienTrongBuild>
            {
                new() { SanPhamId = 1, Loai = "cpu", SoLuong = 1 },
                new() { SanPhamId = 2, Loai = "mainboard", SoLuong = 1 }
            }
        };

        var cpuSp = new SanPham { Id = 1, Ten = "CPU Intel i5", Gia = 5000000, Specs = "lga1700" };
        var mbSp = new SanPham { Id = 2, Ten = "Mainboard Z790", Gia = 3000000, Specs = "z790" };

        _mockSanPhamRepo.Setup(r => r.LayTheoIdAsync(1)).ReturnsAsync(cpuSp);
        _mockSanPhamRepo.Setup(r => r.LayTheoIdAsync(2)).ReturnsAsync(mbSp);

        // Act
        var result = await _service.KiemTraTuongThichAsync(dto);

        // Assert
        Assert.True(result.TuongThich);
        Assert.Empty(result.Loi);
    }

    [Fact]
    public async Task KiemTraTuongThichAsync_IncompatibleCpuAndMainboard_ReturnsError()
    {
        // Arrange
        var dto = new KiemTraTuongThichDto
        {
            LinhKiens = new List<LinhKienTrongBuild>
            {
                new() { SanPhamId = 1, Loai = "cpu", SoLuong = 1 },
                new() { SanPhamId = 2, Loai = "mainboard", SoLuong = 1 }
            }
        };

        var cpuSp = new SanPham { Id = 1, Ten = "CPU AMD Ryzen", Gia = 5000000, Specs = "am5" };
        var mbSp = new SanPham { Id = 2, Ten = "Mainboard Z790", Gia = 3000000, Specs = "lga1700" };

        _mockSanPhamRepo.Setup(r => r.LayTheoIdAsync(1)).ReturnsAsync(cpuSp);
        _mockSanPhamRepo.Setup(r => r.LayTheoIdAsync(2)).ReturnsAsync(mbSp);

        // Act
        var result = await _service.KiemTraTuongThichAsync(dto);

        // Assert
        Assert.False(result.TuongThich);
        Assert.Contains(result.Loi, l => l.Contains("CPU") && l.Contains("Mainboard"));
    }
}
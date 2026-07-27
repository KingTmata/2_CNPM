using Moq;
using PCZone.API.DTOs;
using PCZone.API.Models;
using PCZone.API.Repositories;
using PCZone.API.Services;

namespace PCZone.Tests;

public class GioHangServiceTests
{
    private readonly Mock<IGioHangRepository> _mockGioHangRepo;
    private readonly Mock<ISanPhamRepository> _mockSanPhamRepo;
    private readonly GioHangService _service;

    public GioHangServiceTests()
    {
        _mockGioHangRepo = new Mock<IGioHangRepository>();
        _mockSanPhamRepo = new Mock<ISanPhamRepository>();
        _service = new GioHangService(_mockGioHangRepo.Object, _mockSanPhamRepo.Object);
    }

    [Fact]
    public async Task TinhTongTienAsync_EmptyCart_ReturnsZero()
    {
        // Arrange
        _mockGioHangRepo.Setup(r => r.GetByKhachHangIdAsync(It.IsAny<int>()))
            .ReturnsAsync((GioHang?)null);

        // Act
        var result = await _service.TinhTongTienAsync(1);

        // Assert
        Assert.Equal(0, result);
    }

    [Fact]
    public async Task TinhTongTienAsync_ValidCart_ReturnsTotalPrice()
    {
        // Arrange
        var gioHang = new GioHang
        {
            Id = 1,
            KhachHangId = 1,
            ChiTietGioHangs = new List<ChiTietGioHang>
            {
                new() { Id = 1, SanPhamId = 1, SoLuong = 2, DonGia = 5000000 },
                new() { Id = 2, SanPhamId = 2, SoLuong = 1, DonGia = 3000000 }
            }
        };

        _mockGioHangRepo.Setup(r => r.GetByKhachHangIdAsync(1)).ReturnsAsync(gioHang);

        // Act
        var result = await _service.TinhTongTienAsync(1);

        // Assert
        Assert.Equal(13000000, result); // 2*5tr + 1*3tr = 13tr
    }

    [Fact]
    public async Task ThemSanPhamAsync_ProductNotFound_ThrowsException()
    {
        // Arrange
        var dto = new ThemGioHangDto
        {
            KhachHangId = 1,
            SanPhamId = 999,
            SoLuong = 1
        };

        _mockGioHangRepo.Setup(r => r.GetByKhachHangIdAsync(1))
            .ReturnsAsync(new GioHang { Id = 1, KhachHangId = 1 });

        _mockSanPhamRepo.Setup(r => r.LayTheoIdAsync(999)).ReturnsAsync((SanPham?)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _service.ThemSanPhamAsync(dto));
        Assert.Equal("Sản phẩm không tồn tại", exception.Message);
    }
}
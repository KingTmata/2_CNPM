using Moq;
using PCZone.API.DTOs;
using PCZone.API.Models;
using PCZone.API.Repositories;
using PCZone.API.Services;

namespace PCZone.Tests;

public class SanPhamServiceTests
{
    private readonly Mock<ISanPhamRepository> _mockRepo;
    private readonly SanPhamService _service;

    public SanPhamServiceTests()
    {
        _mockRepo = new Mock<ISanPhamRepository>();
        _service = new SanPhamService(_mockRepo.Object);
    }

    [Fact]
    public async Task LayTatCaAsync_ReturnsListOfProducts()
    {
        // Arrange
        var expected = new List<SanPham>
        {
            new() { Id = 1, Ten = "CPU i5", Gia = 5000000 },
            new() { Id = 2, Ten = "RAM 16GB", Gia = 1500000 }
        };
        _mockRepo.Setup(r => r.LayTatCaAsync()).ReturnsAsync(expected);

        // Act
        var result = await _service.LayTatCaAsync();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal("CPU i5", result[0].Ten);
    }

    [Fact]
    public async Task LayTheoIdAsync_ProductNotFound_ReturnsNull()
    {
        // Arrange
        _mockRepo.Setup(r => r.LayTheoIdAsync(It.IsAny<int>())).ReturnsAsync((SanPham?)null);

        // Act
        var result = await _service.LayTheoIdAsync(999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task TaoAsync_EmptyTen_ThrowsException()
    {
        // Arrange
        var dto = new TaoSanPhamDto
        {
            Ten = "",
            Gia = 1000000,
            SoLuongTon = 10,
            DanhMucId = 1
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _service.TaoAsync(dto));
        Assert.Equal("Tên sản phẩm không được để trống.", exception.Message);
    }

    [Fact]
    public async Task TaoAsync_InvalidPrice_ThrowsException()
    {
        // Arrange
        var dto = new TaoSanPhamDto
        {
            Ten = "Product",
            Gia = 0,
            SoLuongTon = 10,
            DanhMucId = 1
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _service.TaoAsync(dto));
        Assert.Equal("Giá sản phẩm phải lớn hơn 0.", exception.Message);
    }

    [Fact]
    public async Task TaoAsync_ValidDto_CallsRepository()
    {
        // Arrange
        var dto = new TaoSanPhamDto
        {
            Ten = "CPU i7",
            Gia = 7000000,
            SoLuongTon = 5,
            DanhMucId = 2
        };

        // Act
        await _service.TaoAsync(dto);

        // Assert
        _mockRepo.Verify(r => r.ThemAsync(It.Is<SanPham>(s => s.Ten == "CPU i7")), Times.Once);
        _mockRepo.Verify(r => r.LuuAsync(), Times.Once);
    }
}
using Moq;
using Microsoft.Extensions.Configuration;
using PCZone.API.DTOs;
using PCZone.API.Models;
using PCZone.API.Repositories;
using PCZone.API.Services;

namespace PCZone.Tests;

public class DangNhapServiceTests
{
    private readonly Mock<IKhachHangRepository> _mockRepo;
    private readonly Mock<IConfiguration> _mockConfig;
    private readonly DangNhapService _service;

    public DangNhapServiceTests()
    {
        _mockRepo = new Mock<IKhachHangRepository>();
        _mockConfig = new Mock<IConfiguration>();

        // Setup JWT config mock
        var jwtSection = new Mock<IConfigurationSection>();
        jwtSection.Setup(s => s["Key"]).Returns("ThisIsASecretKeyForTest1234567890!");
        jwtSection.Setup(s => s["Issuer"]).Returns("PCZone");
        jwtSection.Setup(s => s["Audience"]).Returns("PCZoneUsers");
        _mockConfig.Setup(c => c.GetSection("Jwt")).Returns(jwtSection.Object);

        _service = new DangNhapService(_mockRepo.Object, _mockConfig.Object);
    }

    [Fact]
    public async Task DangNhapAsync_ValidCredentials_ReturnsResponse()
    {
        // Arrange
        var dto = new DangNhapDto
        {
            Email = "test@example.com",
            MatKhau = "password123"
        };

        var khachHang = new KhachHang
        {
            Id = 1,
            Ten = "Test User",
            Email = "test@example.com",
            MatKhau = BCrypt.Net.BCrypt.HashPassword("password123"),
            VaiTro = "Customer"
        };

        _mockRepo.Setup(r => r.LayTheoEmailAsync(dto.Email)).ReturnsAsync(khachHang);

        // Act
        var result = await _service.DangNhapAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test User", result.Ten);
        Assert.Equal("test@example.com", result.Email);
        Assert.Equal("Customer", result.VaiTro);
        Assert.NotNull(result.Token);
        Assert.NotEmpty(result.Token);
    }

    [Fact]
    public async Task DangNhapAsync_WrongPassword_ThrowsException()
    {
        // Arrange
        var dto = new DangNhapDto
        {
            Email = "test@example.com",
            MatKhau = "wrongpassword"
        };

        var khachHang = new KhachHang
        {
            Id = 1,
            Ten = "Test User",
            Email = "test@example.com",
            MatKhau = BCrypt.Net.BCrypt.HashPassword("correctpassword"),
            VaiTro = "Customer"
        };

        _mockRepo.Setup(r => r.LayTheoEmailAsync(dto.Email)).ReturnsAsync(khachHang);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _service.DangNhapAsync(dto));
        Assert.Equal("Email hoặc mật khẩu không đúng", exception.Message);
    }

    [Fact]
    public async Task DangNhapAsync_EmailNotFound_ThrowsException()
    {
        // Arrange
        var dto = new DangNhapDto
        {
            Email = "notfound@example.com",
            MatKhau = "password123"
        };

        _mockRepo.Setup(r => r.LayTheoEmailAsync(dto.Email)).ReturnsAsync((KhachHang?)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _service.DangNhapAsync(dto));
        Assert.Equal("Email hoặc mật khẩu không đúng", exception.Message);
    }
}
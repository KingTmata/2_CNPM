using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PCZone.API.DTOs;
using PCZone.API.Repositories;

namespace PCZone.API.Services;

public class DangNhapService : IDangNhapService
{
    private readonly IKhachHangRepository _khachHangRepository;
    private readonly IConfiguration _configuration;

    public DangNhapService(IKhachHangRepository khachHangRepository, IConfiguration configuration)
    {
        _khachHangRepository = khachHangRepository;
        _configuration = configuration;
    }

    public async Task<DangNhapResponse> DangNhapAsync(DangNhapDto dto)
    {
        var khachHang = await _khachHangRepository.LayTheoEmailAsync(dto.Email);
        if (khachHang == null || khachHang.MatKhau != dto.MatKhau)
            throw new Exception("Email hoặc mật khẩu không đúng");

        var token = TaoToken(khachHang);

        return new DangNhapResponse
        {
            Id = khachHang.Id,
            Ten = khachHang.Ten,
            Email = khachHang.Email,
            VaiTro = khachHang.VaiTro,
            Token = token
        };
    }

    private string TaoToken(Models.KhachHang khachHang)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, khachHang.Id.ToString()),
            new Claim(ClaimTypes.Email, khachHang.Email),
            new Claim(ClaimTypes.Name, khachHang.Ten),
            new Claim(ClaimTypes.Role, khachHang.VaiTro)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
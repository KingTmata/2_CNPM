using System.ComponentModel.DataAnnotations;

namespace PCZone.API.DTOs;

public class CapNhatGioHangDto
{
    [Range(1, 100, ErrorMessage = "Số lượng phải từ 1 đến 100")]
    public int SoLuong { get; set; } = 1;
}
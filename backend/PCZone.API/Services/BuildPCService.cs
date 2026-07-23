using PCZone.API.DTOs;
using PCZone.API.Models;
using PCZone.API.Repositories;

namespace PCZone.API.Services;

public class BuildPCService : IBuildPCService
{
    private readonly ICauHinhRepository _cauHinhRepo;
    private readonly ISanPhamRepository _sanPhamRepo;

    // TDP (W) mặc định theo loại linh kiện
    private static readonly Dictionary<string, int> TdpMacDinh = new()
    {
        { "cpu", 125 }, { "gpu", 250 }, { "cooler", 10 }, { "mainboard", 25 },
        { "ram", 8 }, { "storage", 6 }, { "case", 5 }, { "psu", 15 },
        { "fans", 10 }, { "monitor", 30 }, { "peripherals", 5 }
    };

    // Socket tương thích CPU - Mainboard
    private static readonly Dictionary<string, List<string>> SocketTuongThich = new()
    {
        { "intel-lga1700", new List<string> { "lga1700", "z790", "b760", "h610" } },
        { "intel-lga1200", new List<string> { "lga1200", "z590", "b560", "h510" } },
        { "amd-am5", new List<string> { "am5", "x670", "b650", "a620" } },
        { "amd-am4", new List<string> { "am4", "x570", "b550", "a520", "b450", "x470" } }
    };

    // Form factor tương thích Case - Mainboard
    private static readonly Dictionary<string, List<string>> FormFactorTuongThich = new()
    {
        { "full-tower", new List<string> { "e-atx", "atx", "micro-atx", "mini-itx" } },
        { "mid-tower", new List<string> { "atx", "micro-atx", "mini-itx" } },
        { "mini-tower", new List<string> { "micro-atx", "mini-itx" } },
        { "small-form-factor", new List<string> { "mini-itx" } }
    };

    public BuildPCService(ICauHinhRepository cauHinhRepo, ISanPhamRepository sanPhamRepo)
    {
        _cauHinhRepo = cauHinhRepo;
        _sanPhamRepo = sanPhamRepo;
    }

    public async Task<KetQuaTuongThich> KiemTraTuongThichAsync(KiemTraTuongThichDto dto)
    {
        var result = new KetQuaTuongThich
        {
            TuongThich = true,
            CanhBao = new List<string>(),
            Loi = new List<string>()
        };

        if (dto.LinhKiens == null || dto.LinhKiens.Count == 0)
        {
            result.Loi.Add("Không có linh kiện nào để kiểm tra.");
            result.TuongThich = false;
            return result;
        }

        // Lấy thông tin sản phẩm từ DB
        var sanPhamIds = dto.LinhKiens.Select(l => l.SanPhamId).Distinct().ToList();
        var sanPhams = new List<SanPham>();
        foreach (var id in sanPhamIds)
        {
            var sp = await _sanPhamRepo.LayTheoIdAsync(id);
            if (sp != null) sanPhams.Add(sp);
        }

        var spDict = sanPhams.ToDictionary(s => s.Id, s => s);

        // 1. Kiểm tra CPU + Mainboard socket
        var cpu = dto.LinhKiens.FirstOrDefault(l => l.Loai == "cpu");
        var mainboard = dto.LinhKiens.FirstOrDefault(l => l.Loai == "mainboard");

        if (cpu != null && mainboard != null)
        {
            var cpuSp = spDict.GetValueOrDefault(cpu.SanPhamId);
            var mbSp = spDict.GetValueOrDefault(mainboard.SanPhamId);

            if (cpuSp != null && mbSp != null)
            {
                var cpuSocket = (cpuSp.Specs ?? "").ToLower();
                var mbSocket = (mbSp.Specs ?? "").ToLower();

                if (!string.IsNullOrEmpty(cpuSocket) && !string.IsNullOrEmpty(mbSocket))
                {
                    bool socketOk = false;
                    foreach (var kvp in SocketTuongThich)
                    {
                        if (cpuSocket.Contains(kvp.Key) || kvp.Key.Contains(cpuSocket))
                        {
                            if (kvp.Value.Any(s => mbSocket.Contains(s)))
                            {
                                socketOk = true;
                                break;
                            }
                        }
                    }

                    if (!socketOk)
                        result.Loi.Add($"CPU ({cpuSp.Ten}) không tương thích socket với Mainboard ({mbSp.Ten}).");
                }
                else
                {
                    result.CanhBao.Add("Không thể xác định socket CPU/Mainboard do thiếu thông tin Specs.");
                }
            }
        }

        // 2. Kiểm tra Case + Mainboard form factor
        var caseLk = dto.LinhKiens.FirstOrDefault(l => l.Loai == "case");
        if (caseLk != null && mainboard != null)
        {
            var caseSp = spDict.GetValueOrDefault(caseLk.SanPhamId);
            var mbSp = spDict.GetValueOrDefault(mainboard.SanPhamId);

            if (caseSp != null && mbSp != null)
            {
                var caseFF = (caseSp.FormFactor ?? "").ToLower();
                var mbFF = (mbSp.FormFactor ?? "").ToLower();

                if (!string.IsNullOrEmpty(caseFF) && !string.IsNullOrEmpty(mbFF))
                {
                    bool ffOk = false;
                    foreach (var kvp in FormFactorTuongThich)
                    {
                        if (caseFF.Contains(kvp.Key) || kvp.Key.Contains(caseFF))
                        {
                            if (kvp.Value.Any(f => mbFF.Contains(f)))
                            {
                                ffOk = true;
                                break;
                            }
                        }
                    }

                    if (!ffOk)
                        result.CanhBao.Add($"Case ({caseSp.Ten}) có thể không vừa Mainboard ({mbSp.Ten}). Kiểm tra form factor.");
                }
            }
        }

        // 3. Kiểm tra công suất PSU
        var psu = dto.LinhKiens.FirstOrDefault(l => l.Loai == "psu");
        if (psu != null)
        {
            var psuSp = spDict.GetValueOrDefault(psu.SanPhamId);
            int tongTdp = 0;

            foreach (var lk in dto.LinhKiens.Where(l => l.Loai != "psu"))
            {
                var sp = spDict.GetValueOrDefault(lk.SanPhamId);
                if (sp != null)
                {
                    // Ưu tiên lấy TDP từ Specs nếu có
                    int tdp = TdpMacDinh.GetValueOrDefault(lk.Loai, 0);
                    if (!string.IsNullOrEmpty(sp.Specs))
                    {
                        var tdpMatch = System.Text.RegularExpressions.Regex.Match(sp.Specs, @"(\d+)\s*W");
                        if (tdpMatch.Success)
                            tdp = int.Parse(tdpMatch.Groups[1].Value);
                    }
                    tongTdp += tdp * lk.SoLuong;
                }
            }

            // PSU thường có công suất ghi trong tên hoặc Specs
            int congSuatPSU = 0;
            if (psuSp != null && !string.IsNullOrEmpty(psuSp.Specs))
            {
                var psuMatch = System.Text.RegularExpressions.Regex.Match(psuSp.Specs, @"(\d+)\s*W");
                if (psuMatch.Success)
                    congSuatPSU = int.Parse(psuMatch.Groups[1].Value);
            }

            if (congSuatPSU > 0 && tongTdp > congSuatPSU)
            {
                result.Loi.Add($"Tổng TDP ({tongTdp}W) vượt quá công suất PSU ({congSuatPSU}W). Cần PSU tối thiểu {tongTdp + 50}W.");
            }
            else if (congSuatPSU > 0 && tongTdp > congSuatPSU * 0.8)
            {
                result.CanhBao.Add($"Tổng TDP ({tongTdp}W) gần sát công suất PSU ({congSuatPSU}W). Nên dùng PSU cao hơn.");
            }
        }

        // 4. Kiểm tra RAM - số khe (cảnh báo nếu dùng nhiều thanh)
        var rams = dto.LinhKiens.Where(l => l.Loai == "ram").ToList();
        if (rams.Count > 1)
        {
            result.CanhBao.Add($"Bạn đang chọn {rams.Sum(r => r.SoLuong)} thanh RAM. Đảm bảo Mainboard có đủ khe cắm.");
        }

        // 5. Tính tổng tiền và thông tin build
        decimal tongTien = 0;
        foreach (var lk in dto.LinhKiens)
        {
            var sp = spDict.GetValueOrDefault(lk.SanPhamId);
            if (sp != null)
                tongTien += sp.Gia * lk.SoLuong;
        }

        int tongCongSuat = dto.LinhKiens
            .Where(l => l.Loai != "psu")
            .Sum(l => TdpMacDinh.GetValueOrDefault(l.Loai, 0) * l.SoLuong);

        result.ThongTin = new ThongTinBuild
        {
            TongTien = tongTien,
            TongCongSuatW = tongCongSuat,
            CongSuatDeXuatW = tongCongSuat + 50,
            DiemHieuNang = TinhDiemHieuNang(dto.LinhKiens, spDict)
        };

        result.TuongThich = result.Loi.Count == 0;
        return result;
    }

    public async Task<GoiYBuildResult> GoiYBuildAsync(GoiYBuildDto dto)
    {
        var result = new GoiYBuildResult
        {
            LinhKiens = new List<GoiYLinhKien>(),
            LoiKhuyen = ""
        };

        var allProducts = await _sanPhamRepo.LayTatCaAsync();
        decimal nganSach = dto.NganSach;

        // Danh sách loại linh kiện cần
        var loaiLinhKien = new List<(string loai, string tenLoai, decimal phanTram)>
        {
            ("cpu", "CPU", 0.25m),
            ("mainboard", "Bo mạch chủ", 0.10m),
            ("ram", "RAM", 0.08m),
            ("storage", "Ổ cứng SSD", 0.07m),
            ("psu", "Nguồn", 0.07m),
            ("case", "Case", 0.06m)
        };

        // Thêm GPU nếu là gaming/do-hoa
        if (dto.MucDich == "gaming" || dto.MucDich == "do-hoa")
        {
            loaiLinhKien.Add(("gpu", "Card màn hình", 0.35m));
        }

        decimal tongDaPhanBo = loaiLinhKien.Sum(l => l.phanTram);
        foreach (var (loai, tenLoai, phanTram) in loaiLinhKien)
        {
            var spCungLoai = allProducts
                .Where(s => (s.DanhMuc?.Ten ?? "").ToLower() == loai || 
                            (s.Hang ?? "").ToLower() == loai)
                .OrderByDescending(s => s.LuotMua)
                .ToList();

            // Nếu không tìm theo danh mục, tìm theo tên sản phẩm
            if (spCungLoai.Count == 0)
            {
                spCungLoai = allProducts
                    .Where(s => s.Ten.ToLower().Contains(loai))
                    .OrderByDescending(s => s.LuotMua)
                    .ToList();
            }

            decimal nganSachChoLoai = nganSach > 0 ? nganSach * phanTram / tongDaPhanBo : 0;
            var spPhuHop = spCungLoai
                .Where(s => nganSach <= 0 || s.Gia <= nganSachChoLoai * 1.2m)
                .OrderByDescending(s => s.LuotMua)
                .FirstOrDefault();

            var goiY = new GoiYLinhKien
            {
                Loai = loai,
                TenLoai = tenLoai,
                SanPhamId = spPhuHop?.Id,
                TenSanPham = spPhuHop?.Ten,
                Gia = spPhuHop?.Gia,
                HinhAnh = spPhuHop?.HinhAnh,
                GhiChu = spPhuHop == null 
                    ? $"Không tìm thấy {tenLoai} phù hợp trong ngân sách {(nganSachChoLoai > 0 ? nganSachChoLoai.ToString("N0") + "đ" : "hiện tại")}."
                    : $"Phù hợp ngân sách ~{nganSachChoLoai:N0}đ"
            };

            result.LinhKiens.Add(goiY);
            if (spPhuHop != null)
                result.TongTien += spPhuHop.Gia;
        }

        // Lời khuyên
        if (dto.MucDich == "gaming")
            result.LoiKhuyen = "Ưu tiên GPU mạnh nhất có thể. CPU tầm trung là đủ cho gaming.";
        else if (dto.MucDich == "van-phong")
            result.LoiKhuyen = "Ưu tiên CPU có đồ họa tích hợp (Intel non-F) để tiết kiệm. RAM 16GB là đủ.";
        else if (dto.MucDich == "do-hoa")
            result.LoiKhuyen = "Ưu tiên CPU nhiều nhân + GPU có VRAM lớn. RAM tối thiểu 32GB.";
        else if (dto.MucDich == "stream")
            result.LoiKhuyen = "Cần CPU mạnh (Intel i7/AMD Ryzen 7) + GPU NVIDIA (NVENC). RAM 32GB.";

        return result;
    }

    public async Task<CauHinhDto> LuuCauHinhAsync(LuuCauHinhDto dto)
    {
        var cauHinh = new CauHinh
        {
            Ten = dto.Ten,
            KhachHangId = dto.KhachHangId,
            MucDich = dto.MucDich,
            GhiChu = dto.GhiChu,
            NgayTao = DateTime.Now,
            MaChiaSe = Guid.NewGuid().ToString("N")[..8].ToUpper(),
            ChiTietCauHinhs = new List<ChiTietCauHinh>()
        };

        decimal tongTien = 0;
        foreach (var lk in dto.LinhKiens)
        {
            var sp = await _sanPhamRepo.LayTheoIdAsync(lk.SanPhamId);
            if (sp != null)
            {
                cauHinh.ChiTietCauHinhs.Add(new ChiTietCauHinh
                {
                    SanPhamId = lk.SanPhamId,
                    SoLuong = lk.SoLuong,
                    LoaiLinhKien = lk.Loai
                });
                tongTien += sp.Gia * lk.SoLuong;
            }
        }

        cauHinh.TongTien = tongTien;

        await _cauHinhRepo.ThemAsync(cauHinh);
        await _cauHinhRepo.LuuAsync();

        return MapToDto(cauHinh);
    }

    public async Task<List<CauHinhDto>> LayLichSuAsync(int? khachHangId)
    {
        List<CauHinh> danhSach;
        if (khachHangId.HasValue)
            danhSach = await _cauHinhRepo.LayTheoKhachHangAsync(khachHangId.Value);
        else
            danhSach = await _cauHinhRepo.LayTatCaAsync();

        return danhSach.Select(MapToDto).ToList();
    }

    public async Task<CauHinhDto?> LayTheoIdAsync(int id)
    {
        var cauHinh = await _cauHinhRepo.LayTheoIdAsync(id);
        return cauHinh == null ? null : MapToDto(cauHinh);
    }

    public async Task<CauHinhDto?> LayTheoMaChiaSeAsync(string maChiaSe)
    {
        var cauHinh = await _cauHinhRepo.LayTheoMaChiaSeAsync(maChiaSe);
        return cauHinh == null ? null : MapToDto(cauHinh);
    }

    public async Task<bool> XoaCauHinhAsync(int id)
    {
        var cauHinh = await _cauHinhRepo.LayTheoIdAsync(id);
        if (cauHinh == null) return false;

        await _cauHinhRepo.XoaAsync(cauHinh);
        await _cauHinhRepo.LuuAsync();
        return true;
    }

    private double TinhDiemHieuNang(List<LinhKienTrongBuild> linhKiens, Dictionary<int, SanPham> spDict)
    {
        var cpu = linhKiens.FirstOrDefault(l => l.Loai == "cpu");
        var gpu = linhKiens.FirstOrDefault(l => l.Loai == "gpu");

        double diemCpu = 0, diemGpu = 0;

        if (cpu != null && spDict.TryGetValue(cpu.SanPhamId, out var cpuSp))
            diemCpu = (double)cpuSp.DiemCpu;

        if (gpu != null && spDict.TryGetValue(gpu.SanPhamId, out var gpuSp))
            diemGpu = (double)gpuSp.DiemGpu;

        if (diemCpu == 0 && diemGpu == 0) return 0;

        return Math.Round(diemGpu * 0.75 + diemCpu * 0.2);
    }

    private static CauHinhDto MapToDto(CauHinh c)
    {
        return new CauHinhDto
        {
            Id = c.Id,
            Ten = c.Ten,
            KhachHangId = c.KhachHangId,
            TenKhachHang = c.KhachHang?.Ten ?? "",
            TongTien = c.TongTien,
            MucDich = c.MucDich,
            GhiChu = c.GhiChu,
            NgayTao = c.NgayTao,
            MaChiaSe = c.MaChiaSe,
            ChiTiets = c.ChiTietCauHinhs?.Select(ct => new ChiTietCauHinhDto
            {
                Id = ct.Id,
                SanPhamId = ct.SanPhamId,
                TenSanPham = ct.SanPham?.Ten ?? "",
                HinhAnh = ct.SanPham?.HinhAnh ?? "",
                Gia = ct.SanPham?.Gia ?? 0,
                LoaiLinhKien = ct.LoaiLinhKien,
                SoLuong = ct.SoLuong
            }).ToList() ?? new List<ChiTietCauHinhDto>()
        };
    }
}
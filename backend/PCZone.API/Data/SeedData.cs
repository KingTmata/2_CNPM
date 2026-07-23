using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using PCZone.API.Models;

namespace PCZone.API.Data;

public static class SeedData
{
    private static readonly string SeedFolder;
    
    static SeedData()
    {
        // Local dev: bin/Debug/net9.0/ -> project root -> Data/SeedData
        var localPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "Data", "SeedData");
        // Docker/production: /app/Data/SeedData
        var dockerPath = Path.Combine(AppContext.BaseDirectory, "Data", "SeedData");
        
        SeedFolder = Directory.Exists(dockerPath) ? dockerPath : 
                     Directory.Exists(localPath) ? localPath : 
                     dockerPath; // fallback
    }

    public static void KhoiTao(UngDungDbContext db)
    {
        // Seed DanhMuc
        if (!db.DanhMucs.Any())
        {
            var danhMucs = DocJson<List<DanhMuc>>("danh-muc.json");
            if (danhMucs != null)
            {
                db.DanhMucs.AddRange(danhMucs);
                db.SaveChanges();
            }
        }

        // Seed KhachHang
        if (!db.KhachHangs.Any())
        {
            var khachHangs = DocJson<List<KhachHang>>("khach-hang.json");
            if (khachHangs != null)
            {
                db.KhachHangs.AddRange(khachHangs);
                db.SaveChanges();
            }
        }

        // Seed SanPham
        if (!db.SanPhams.Any())
        {
            var sanPhams = DocJson<List<SanPham>>("san-pham.json");
            if (sanPhams != null)
            {
                db.SanPhams.AddRange(sanPhams);
                db.SaveChanges();
            }
        }

        // Seed DonHang
        if (!db.DonHangs.Any())
        {
            var donHangs = DocJson<List<DonHang>>("don-hang.json");
            if (donHangs != null)
            {
                db.DonHangs.AddRange(donHangs);
                db.SaveChanges();
            }
        }

        // Seed ChiTietDonHang
        if (!db.ChiTietDonHangs.Any())
        {
            var chiTietDonHangs = DocJson<List<ChiTietDonHang>>("chi-tiet-don-hang.json");
            if (chiTietDonHangs != null)
            {
                db.ChiTietDonHangs.AddRange(chiTietDonHangs);
                db.SaveChanges();
            }
        }

        // Seed DanhGia
        if (!db.DanhGias.Any())
        {
            var danhGias = DocJson<List<DanhGia>>("danh-gia.json");
            if (danhGias != null)
            {
                db.DanhGias.AddRange(danhGias);
                db.SaveChanges();
            }
        }

        // Seed Coupon
        if (!db.Coupons.Any())
        {
            var coupons = DocJson<List<Coupon>>("coupon.json");
            if (coupons != null)
            {
                db.Coupons.AddRange(coupons);
                db.SaveChanges();
            }
        }
    }

    private static T? DocJson<T>(string fileName)
    {
        var path = Path.Combine(SeedFolder, fileName);
        if (!File.Exists(path))
        {
            Console.WriteLine($"[SeedData] Không tìm thấy file: {path}");
            return default;
        }

        var json = File.ReadAllText(path);
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        return JsonSerializer.Deserialize<T>(json, options);
    }
}
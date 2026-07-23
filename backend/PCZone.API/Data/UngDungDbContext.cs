using Microsoft.EntityFrameworkCore;
using PCZone.API.Models;

namespace PCZone.API.Data;

public class UngDungDbContext : DbContext
{
    public UngDungDbContext(DbContextOptions<UngDungDbContext> options)
        : base(options)
    {

    }

    public DbSet<SanPham> SanPhams => Set<SanPham>();
    public DbSet<DanhMuc> DanhMucs => Set<DanhMuc>();
    public DbSet<KhachHang> KhachHangs => Set<KhachHang>();
    public DbSet<DonHang> DonHangs => Set<DonHang>();
    public DbSet<ChiTietDonHang> ChiTietDonHangs => Set<ChiTietDonHang>();
    public DbSet<GioHang> GioHangs => Set<GioHang>();
    public DbSet<ChiTietGioHang> ChiTietGioHangs => Set<ChiTietGioHang>();
    public DbSet<DanhGia> DanhGias => Set<DanhGia>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<CauHinh> CauHinhs => Set<CauHinh>();
    public DbSet<ChiTietCauHinh> ChiTietCauHinhs => Set<ChiTietCauHinh>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Cấu hình precision cho decimal
        modelBuilder.Entity<SanPham>(entity =>
        {
            entity.Property(e => e.Gia).HasPrecision(18, 2);
            entity.Property(e => e.GiaGoc).HasPrecision(18, 2);
        });

        modelBuilder.Entity<ChiTietGioHang>(entity =>
        {
            entity.Property(e => e.DonGia).HasPrecision(18, 2);
        });

        modelBuilder.Entity<DonHang>(entity =>
        {
            entity.Property(e => e.TongTien).HasPrecision(18, 2);
        });

        modelBuilder.Entity<ChiTietDonHang>(entity =>
        {
            entity.Property(e => e.Gia).HasPrecision(18, 2);
        });

        modelBuilder.Entity<Coupon>(entity =>
        {
            entity.Property(e => e.SoTienGiamToiDa).HasPrecision(18, 2);
            entity.Property(e => e.DieuKienToiThieu).HasPrecision(18, 2);
        });

        // Cấu hình quan hệ
        modelBuilder.Entity<SanPham>()
            .HasOne(s => s.DanhMuc)
            .WithMany(d => d.SanPhams)
            .HasForeignKey(s => s.DanhMucId);

        modelBuilder.Entity<GioHang>()
            .HasOne(g => g.KhachHang)
            .WithOne(k => k.GioHang)
            .HasForeignKey<GioHang>(g => g.KhachHangId);

        modelBuilder.Entity<ChiTietGioHang>()
            .HasOne(c => c.GioHang)
            .WithMany(g => g.ChiTietGioHangs)
            .HasForeignKey(c => c.GioHangId);

        modelBuilder.Entity<ChiTietGioHang>()
            .HasOne(c => c.SanPham)
            .WithMany(s => s.ChiTietGioHangs)
            .HasForeignKey(c => c.SanPhamId);

        modelBuilder.Entity<DonHang>()
            .HasOne(d => d.KhachHang)
            .WithMany(k => k.DonHangs)
            .HasForeignKey(d => d.KhachHangId);

        modelBuilder.Entity<ChiTietDonHang>()
            .HasOne(c => c.DonHang)
            .WithMany(d => d.ChiTietDonHangs)
            .HasForeignKey(c => c.DonHangId);

        modelBuilder.Entity<ChiTietDonHang>()
            .HasOne(c => c.SanPham)
            .WithMany(s => s.ChiTietDonHangs)
            .HasForeignKey(c => c.SanPhamId);

        modelBuilder.Entity<DanhGia>()
            .HasOne(d => d.SanPham)
            .WithMany(s => s.DanhGias)
            .HasForeignKey(d => d.SanPhamId);

        modelBuilder.Entity<DanhGia>()
            .HasOne(d => d.KhachHang)
            .WithMany(k => k.DanhGias)
            .HasForeignKey(d => d.KhachHangId);

        // Cấu hình CauHinh
        modelBuilder.Entity<CauHinh>(entity =>
        {
            entity.Property(e => e.TongTien).HasPrecision(18, 2);
            entity.HasIndex(e => e.MaChiaSe).IsUnique();
        });

        modelBuilder.Entity<CauHinh>()
            .HasOne(c => c.KhachHang)
            .WithMany()
            .HasForeignKey(c => c.KhachHangId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<ChiTietCauHinh>()
            .HasOne(ct => ct.CauHinh)
            .WithMany(c => c.ChiTietCauHinhs)
            .HasForeignKey(ct => ct.CauHinhId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ChiTietCauHinh>()
            .HasOne(ct => ct.SanPham)
            .WithMany()
            .HasForeignKey(ct => ct.SanPhamId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
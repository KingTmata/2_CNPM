using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PCZone.API.Data;
using PCZone.API.Repositories;
using PCZone.API.Services;

// ==========================
// Load file .env (phải để đầu tiên)
// ==========================
DotNetEnv.Env.Load();

// Tắt file watching để tránh lỗi inotify limit trên Render Linux
AppContext.SetSwitch("Microsoft.AspNetCore.Hosting.SuppressEnvironmentConfiguration", true);

var builder = WebApplication.CreateBuilder(args);

// ==========================
// Đăng ký Controller
// ==========================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// ==========================
// Đăng ký DI - Repositories
// ==========================
builder.Services.AddScoped<ISanPhamRepository, SanPhamRepository>();
builder.Services.AddScoped<IDanhMucRepository, DanhMucRepository>();
builder.Services.AddScoped<IGioHangRepository, GioHangRepository>();
builder.Services.AddScoped<IDonHangRepository, DonHangRepository>();
builder.Services.AddScoped<IDanhGiaRepository, DanhGiaRepository>();
builder.Services.AddScoped<ICouponRepository, CouponRepository>();
builder.Services.AddScoped<IKhachHangRepository, KhachHangRepository>();
builder.Services.AddScoped<ICauHinhRepository, CauHinhRepository>();

// ==========================
// Đăng ký Memory Cache (cho AI caching)
// ==========================
builder.Services.AddMemoryCache();

// ==========================
// Đăng ký DI - Services
// ==========================
builder.Services.AddScoped<ISanPhamService, SanPhamService>();
builder.Services.AddScoped<IDanhMucService, DanhMucService>();
builder.Services.AddScoped<IGioHangService, GioHangService>();
builder.Services.AddScoped<IDonHangService, DonHangService>();
builder.Services.AddScoped<IDanhGiaService, DanhGiaService>();
builder.Services.AddScoped<ICouponService, CouponService>();
builder.Services.AddScoped<IKhachHangService, KhachHangService>();
builder.Services.AddScoped<IDangNhapService, DangNhapService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IAIService, AIService>();
builder.Services.AddHttpClient<IAIService, AIService>();
builder.Services.AddScoped<IBuildPCService, BuildPCService>();

// ==========================
// Đăng ký Entity Framework - SQLite
// ==========================
builder.Services.AddDbContext<UngDungDbContext>(options =>
{
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection"));
});

// ==========================
// JWT Authentication
// ==========================
var jwtSettings = builder.Configuration.GetSection("Jwt");
var jwtKey = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(jwtKey)
    };
});

// ==========================
// Swagger
// ==========================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ==========================
// CORS
// ==========================
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .SetIsOriginAllowed(_ => true)
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// ==========================
// Swagger (mở cho cả Development và Production)
// ==========================
app.UseSwagger();
app.UseSwaggerUI();

// ==========================
// Middleware - Custom (phải đặt đúng thứ tự)
// ==========================
app.UseMiddleware<PCZone.API.Middleware.GhiLogMiddleware>();   // 1. Ghi log request/response
app.UseMiddleware<PCZone.API.Middleware.XuLyLoiMiddleware>();  // 2. Xử lý lỗi toàn cục

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();
// ==========================
// Static Files (wwwroot + media)
// ==========================
app.UseStaticFiles();

// Serve thư mục media từ frontend/assets/media (web lan cuoi/frontend/assets/media)
// ContentRootPath = backend/PCZone.API/, đi lên 2 cấp => thư mục gốc workspace, vào frontend/assets/media
var mediaPath = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, "..", "..", "frontend", "assets", "media"));
if (Directory.Exists(mediaPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(mediaPath),
        RequestPath = "/media"
    });
}
// ==========================
// Map Controller
// ==========================
app.MapControllers();

// ==========================
// Seed Data (phải để trước app.Run)
// ==========================
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<UngDungDbContext>();

    db.Database.Migrate(); // Tự động tạo DB từ migration nếu chưa có

    // Nếu có arg --reseed, xóa sạch dữ liệu cũ và seed lại
    if (args.Contains("--reseed"))
    {
        Console.WriteLine("🧹 Đang xóa dữ liệu cũ và seed lại...");
        db.Database.EnsureDeleted();
        db.Database.Migrate();
    }

    SeedData.KhoiTao(db);
}

app.Run();
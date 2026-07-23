using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Caching.Memory;
using PCZone.API.Models;

namespace PCZone.API.Services;

public class AIService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _model;
    private readonly double _temperature;
    private readonly int _maxTokens;
    private readonly ISanPhamService _sanPhamService;
    private readonly IMemoryCache _cache;
    private const string PRODUCT_CACHE_KEY = "AI_ProductList";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(5);

    public AIService(
        HttpClient httpClient,
        ISanPhamService sanPhamService,
        IMemoryCache cache)
    {
        _httpClient = httpClient;
        _sanPhamService = sanPhamService;
        _cache = cache;

        // Doc tu bien moi truong (file .env)
        _apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY") ?? "";
        _model = Environment.GetEnvironmentVariable("GEMINI_MODEL") ?? "gemini-3.1-flash-lite";
        
        var tempRaw = Environment.GetEnvironmentVariable("GEMINI_TEMPERATURE");
        if (!double.TryParse(tempRaw, out var tempParsed))
            tempParsed = 0.7;
        _temperature = Math.Clamp(tempParsed, 0.0, 2.0);
        
        _maxTokens = int.TryParse(Environment.GetEnvironmentVariable("GEMINI_MAX_TOKENS"), out var tokens) ? tokens : 2048;

        if (string.IsNullOrEmpty(_apiKey))
        {
            throw new InvalidOperationException("GEMINI_API_KEY chua duoc cau hinh trong file .env");
        }
    }

    /// <summary>
    /// Lay danh sach san pham tu database voi cache (5 phut)
    /// </summary>
    private async Task<List<SanPham>> LaySanPhamTuCacheAsync()
    {
        if (_cache.TryGetValue(PRODUCT_CACHE_KEY, out List<SanPham>? products) && products != null)
        {
            return products;
        }

        products = await _sanPhamService.LayTatCaAsync();
        
        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(CacheDuration)
            .SetSlidingExpiration(TimeSpan.FromMinutes(3))
            .SetSize(1);

        _cache.Set(PRODUCT_CACHE_KEY, products, cacheOptions);
        
        return products;
    }

    private async Task<string> XayDungContextSanPhamAsync()
    {
        var sanPhams = await LaySanPhamTuCacheAsync();
        
        if (sanPhams == null || sanPhams.Count == 0)
            return "Hien tai cua hang chua co san pham nao.";

        var sb = new StringBuilder();
        sb.AppendLine("DANH SACH SAN PHAM CUA CUA HANG PCZONE:");
        sb.AppendLine("========================================");

        var nhomTheoDM = sanPhams
            .GroupBy(sp => sp.DanhMuc?.Ten ?? "Khac")
            .OrderBy(g => g.Key);

        foreach (var nhom in nhomTheoDM)
        {
            sb.AppendLine($"\n--- {nhom.Key.ToUpper()} ---");
            int stt = 1;
            foreach (var sp in nhom)
            {
                if (!sp.DangKinhDoanh) continue;
                
                sb.AppendLine($"{stt}. {sp.Ten}");
                sb.AppendLine($"   Gia: {sp.Gia:N0}d");
                if (!string.IsNullOrEmpty(sp.Hang))
                    sb.AppendLine($"   Hang: {sp.Hang}");
                if (!string.IsNullOrEmpty(sp.MoTa))
                    sb.AppendLine($"   Mo ta: {sp.MoTa}");
                if (!string.IsNullOrEmpty(sp.Specs))
                    sb.AppendLine($"   Thong so: {sp.Specs}");
                if (sp.DiemCpu > 0)
                    sb.AppendLine($"   Diem CPU: {sp.DiemCpu}");
                if (sp.DiemGpu > 0)
                    sb.AppendLine($"   Diem GPU: {sp.DiemGpu}");
                sb.AppendLine($"   Ton kho: {sp.SoLuongTon}");
                stt++;
            }
        }

        sb.AppendLine($"\nTong so san pham dang kinh doanh: {sanPhams.Count(sp => sp.DangKinhDoanh)}");
        return sb.ToString();
    }

    public async Task<string> ChatAsync(string message)
    {
        var context = await XayDungContextSanPhamAsync();
        var prompt = "Ban la tro ly AI cua cua hang PCZone - chuyen ban linh kien PC, laptop, man hinh, phu kien cong nghe.\n\n"
            + "Duoi day la danh sach san pham hien co cua cua hang:\n"
            + context + "\n\n"
            + "Yeu cau cua khach hang: '" + message + "'\n\n"
            + "QUY TAC TRA LOI:\n"
            + "- Tra loi NGAN GON, XUC TICH, di thang vao van de\n"
            + "- Dung gach dau dong (-) cho danh sach\n"
            + "- Moi dong chi 1 thong tin, xuong dong giua cac phan\n"
            + "- KHONG viet cau gioi thieu dai dong\n"
            + "- Neu goi y san pham: format - Ten - Gia - Ly do ngan\n"
            + "- KHONG dung ** hay ky tu markdown phuc tap\n"
            + "- Ket thuc bang 1 dong tong ket ngan";
        
        return await GoiGeminiAsync(prompt);
    }

    public async Task<string> TuVanBuildPcAsync(string yeuCau)
    {
        var context = await XayDungContextSanPhamAsync();
        var prompt = "Ban la chuyen gia tu van build PC tai cua hang PCZone.\n\n"
            + "DANH SACH SAN PHAM CUA HANG:\n"
            + context + "\n\n"
            + "Yeu cau cua khach hang: '" + yeuCau + "'\n\n"
            + "QUY TAC TRA LOI:\n"
            + "- Tra loi NGAN GON, di thang vao cau hinh\n"
            + "- Moi linh kien 1 dong, bat dau bang dau gach (-)\n"
            + "- Format: - Loai: Ten chinh xac - Gia\n"
            + "- Vi du:\n"
            + "  - CPU: AMD Ryzen 5 5600 - 2.790.000d\n"
            + "  - GPU: RTX 4060 8GB - 7.490.000d\n"
            + "  - RAM: 16GB DDR4 - 890.000d\n"
            + "- Dong cuoi: Tong: Tong tien\n"
            + "- KHONG viet cau dai dong, khong giai thich thua\n"
            + "- KHONG dung ** hay markdown\n"
            + "- Chi goi y linh kien CO TRONG danh sach ben tren";
        
        return await GoiGeminiAsync(prompt);
    }

    private async Task<string> GoiGeminiAsync(string prompt)
    {
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_model}:generateContent?key={_apiKey}";

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            },
            generationConfig = new
            {
                temperature = _temperature,
                maxOutputTokens = _maxTokens
            }
        };

        var jsonRequest = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(url, content);
        var jsonResponse = await response.Content.ReadAsStringAsync();
        
        if (!response.IsSuccessStatusCode)
        {
            var errorObj = JsonSerializer.Deserialize<GeminiErrorResponse>(jsonResponse);
            var errorMsg = errorObj?.Error?.Message ?? "Khong xac dinh";
            var statusCode = (int)response.StatusCode;
            
            if (statusCode == 429)
            {
                return "API Gemini da het luot su dung trong ngay (quota exceeded). Vui long thu lai sau 24h hoac nang cap tai khoan tai https://ai.google.dev/pricing";
            }
            
            return "Loi " + statusCode + " tu Gemini API: " + errorMsg;
        }

        var result = JsonSerializer.Deserialize<GeminiResponse>(jsonResponse);

        if (result?.Candidates != null && result.Candidates.Length > 0)
        {
            var firstCandidate = result.Candidates[0];
            if (firstCandidate.Content?.Parts != null && firstCandidate.Content.Parts.Length > 0)
            {
                return firstCandidate.Content.Parts[0].Text ?? "Xin loi, toi khong the tra loi ngay luc nay.";
            }
        }

        return "Xin loi, da co loi xay ra khi xu ly yeu cau cua ban.";
    }
}

public class GeminiErrorResponse
{
    [JsonPropertyName("error")]
    public GeminiError? Error { get; set; }
}

public class GeminiError
{
    [JsonPropertyName("code")]
    public int Code { get; set; }

    [JsonPropertyName("message")]
    public string? Message { get; set; }

    [JsonPropertyName("status")]
    public string? Status { get; set; }
}

public class GeminiResponse
{
    [JsonPropertyName("candidates")]
    public Candidate[]? Candidates { get; set; }
}

public class Candidate
{
    [JsonPropertyName("content")]
    public Content? Content { get; set; }

    [JsonPropertyName("finishReason")]
    public string? FinishReason { get; set; }
}

public class Content
{
    [JsonPropertyName("parts")]
    public Part[]? Parts { get; set; }

    [JsonPropertyName("role")]
    public string? Role { get; set; }
}

public class Part
{
    [JsonPropertyName("text")]
    public string? Text { get; set; }
}

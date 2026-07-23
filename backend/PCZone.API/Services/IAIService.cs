namespace PCZone.API.Services;

public interface IAIService
{
    /// <summary>
    /// Gửi câu hỏi đến Gemini AI và nhận phản hồi
    /// </summary>
    Task<string> ChatAsync(string message);

    /// <summary>
    /// Tư vấn cấu hình PC dựa trên ngân sách và nhu cầu
    /// </summary>
    Task<string> TuVanBuildPcAsync(string yeuCau);

}
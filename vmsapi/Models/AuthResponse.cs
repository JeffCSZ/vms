namespace vmsapi.Models
{
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? UnitNo { get; set; }
        public string? StreetNo { get; set; }
        public bool IsResident { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}

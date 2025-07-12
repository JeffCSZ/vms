namespace vmsapi.Models.DTOs
{
    public class VisitorRequestResponseDto
    {
        public int Id { get; set; }
        public DateTime DateTimeCreated { get; set; }
        public DateTime VisitDateTime { get; set; }
        public DateTime Expiry { get; set; }
        public string VisitorName { get; set; } = string.Empty;
        public string VehiclePlateNumber { get; set; } = string.Empty;
        public Guid UUID { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string? UnitNo { get; set; }
        public string? StreetNo { get; set; }
    }
}

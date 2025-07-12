using System.ComponentModel.DataAnnotations;

namespace vmsapi.Models.DTOs
{
    public class UpdateVisitorRequestDto
    {
        [Required]
        public DateTime VisitDateTime { get; set; }

        /// <summary>
        /// The date and time when the visitor request expires.
        /// Must be after VisitDateTime.
        /// </summary>
        [Required]
        public DateTime Expiry { get; set; }

        [Required]
        [MaxLength(30)]
        public string VisitorName { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string VehiclePlateNumber { get; set; } = string.Empty;
    }
}

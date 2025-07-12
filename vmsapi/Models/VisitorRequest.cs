using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace vmsapi.Models
{
    public class VisitorRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime DateTimeCreated { get; set; } = DateTime.Now;

        [Required]
        public DateTime VisitDateTime { get; set; }

        [Required]
        public DateTime Expiry { get; set; }

        [Required]
        [MaxLength(30)]
        public string VisitorName { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string VehiclePlateNumber { get; set; } = string.Empty;

        [Required]
        public Guid UUID { get; set; } = Guid.NewGuid();

        // Foreign Key to MyUser
        [Required]
        public string UserId { get; set; } = string.Empty;

        // Navigation property
        [ForeignKey("UserId")]
        public virtual MyUser User { get; set; } = null!;
    }
}

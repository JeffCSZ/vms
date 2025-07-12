using System.ComponentModel.DataAnnotations;

namespace vmsapi.Models
{
    public class RegisterModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? UnitNo { get; set; }

        [MaxLength(20)]
        public string? StreetNo { get; set; }

        public bool IsResident { get; set; }
    }
}

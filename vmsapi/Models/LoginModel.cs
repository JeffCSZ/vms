using System.ComponentModel.DataAnnotations;

namespace vmsapi.Models
{
    public class LoginModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        public bool RememberMe { get; set; }

        public string? ExpectedAccountType { get; set; } // "resident" or "guard"
    }
}

using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace vmsapi.Models
{
    public class MyUser : IdentityUser
    {
        [MaxLength(20)]
        public string? UnitNo { get; set; }

        [MaxLength(20)]
        public string? StreetNo { get; set; }

        public bool IsResident { get; set; }
    }
}

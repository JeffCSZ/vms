using System.ComponentModel.DataAnnotations;

namespace vmsapi.Attributes
{
    public class ValidExpiryAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is TimeSpan expiry)
            {
                // Expiry should be positive and reasonable (between 1 hour and 30 days)
                return expiry > TimeSpan.Zero && expiry <= TimeSpan.FromDays(30);
            }
            return false;
        }

        public override string FormatErrorMessage(string name)
        {
            return $"{name} must be between 1 hour and 30 days.";
        }
    }
}

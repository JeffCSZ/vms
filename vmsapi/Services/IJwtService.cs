using vmsapi.Models;

namespace vmsapi.Services
{
    public interface IJwtService
    {
        string GenerateToken(MyUser user);
    }
}

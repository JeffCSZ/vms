using vmsapi.Models;
using vmsapi.Models.DTOs;

namespace vmsapi.Repositories
{
    public interface IVisitorRequestRepository
    {
        Task<VisitorRequest> CreateAsync(VisitorRequest visitorRequest);
        Task<IEnumerable<VisitorRequest>> GetAllAsync();
        Task<VisitorRequest?> GetByIdAsync(int id);
        Task<VisitorRequest?> GetByUUIDAsync(Guid uuid);
        Task<IEnumerable<VisitorRequest>> GetByUserIdAsync(string userId);
        Task<VisitorRequest?> UpdateAsync(int id, VisitorRequest visitorRequest);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<MyUser?> GetUserByIdAsync(string userId);
    }
}

using Microsoft.EntityFrameworkCore;
using vmsapi.Data;
using vmsapi.Models;

namespace vmsapi.Repositories
{
    public class VisitorRequestRepository : IVisitorRequestRepository
    {
        private readonly ApplicationDbContext _context;

        public VisitorRequestRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<VisitorRequest> CreateAsync(VisitorRequest visitorRequest)
        {
            _context.VisitorRequests.Add(visitorRequest);
            await _context.SaveChangesAsync();
            return visitorRequest;
        }

        public async Task<IEnumerable<VisitorRequest>> GetAllAsync()
        {
            return await _context.VisitorRequests
                .Include(vr => vr.User)
                .OrderByDescending(vr => vr.DateTimeCreated)
                .ToListAsync();
        }

        public async Task<VisitorRequest?> GetByIdAsync(int id)
        {
            return await _context.VisitorRequests
                .Include(vr => vr.User)
                .FirstOrDefaultAsync(vr => vr.Id == id);
        }

        public async Task<VisitorRequest?> GetByUUIDAsync(Guid uuid)
        {
            return await _context.VisitorRequests
                .Include(vr => vr.User)
                .FirstOrDefaultAsync(vr => vr.UUID == uuid);
        }

        public async Task<IEnumerable<VisitorRequest>> GetByUserIdAsync(string userId)
        {
            return await _context.VisitorRequests
                .Include(vr => vr.User)
                .Where(vr => vr.UserId == userId)
                .OrderByDescending(vr => vr.DateTimeCreated)
                .ToListAsync();
        }

        public async Task<VisitorRequest?> UpdateAsync(int id, VisitorRequest visitorRequest)
        {
            var existingRequest = await _context.VisitorRequests
                .Include(vr => vr.User)
                .FirstOrDefaultAsync(vr => vr.Id == id);
            if (existingRequest == null)
                return null;

            existingRequest.VisitDateTime = visitorRequest.VisitDateTime;
            existingRequest.Expiry = visitorRequest.Expiry;
            existingRequest.VisitorName = visitorRequest.VisitorName;
            existingRequest.VehiclePlateNumber = visitorRequest.VehiclePlateNumber;

            await _context.SaveChangesAsync();
            return existingRequest;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var visitorRequest = await _context.VisitorRequests.FindAsync(id);
            if (visitorRequest == null)
                return false;

            _context.VisitorRequests.Remove(visitorRequest);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.VisitorRequests.AnyAsync(vr => vr.Id == id);
        }

        public async Task<MyUser?> GetUserByIdAsync(string userId)
        {
            return await _context.Users.FindAsync(userId);
        }
    }
}

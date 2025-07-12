using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using vmsapi.Models;
using vmsapi.Models.DTOs;
using vmsapi.Repositories;

namespace vmsapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VisitorRequestController : ControllerBase
    {
        private readonly IVisitorRequestRepository _repository;

        public VisitorRequestController(IVisitorRequestRepository repository)
        {
            _repository = repository;
        }

        // POST api/VisitorRequest
        [HttpPost]
        public async Task<ActionResult<VisitorRequestResponseDto>> CreateVisitorRequest([FromBody] CreateVisitorRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validate that Expiry is after VisitDateTime
            if (dto.Expiry <= dto.VisitDateTime)
                return BadRequest("Expiry must be after VisitDateTime");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found");

            // Check if user exists and is a resident
            var user = await _repository.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound("User not found");

            if (!user.IsResident)
                return Forbid("Only residents can create visitor requests");

            var visitorRequest = new VisitorRequest
            {
                VisitDateTime = dto.VisitDateTime,
                Expiry = dto.Expiry,
                VisitorName = dto.VisitorName,
                VehiclePlateNumber = dto.VehiclePlateNumber,
                UserId = userId
            };

            var createdRequest = await _repository.CreateAsync(visitorRequest);

            // Reload to get user information
            var requestWithUser = await _repository.GetByIdAsync(createdRequest.Id);

            var response = MapToResponseDto(requestWithUser!);
            return CreatedAtAction(nameof(GetVisitorRequestById), new { id = createdRequest.Id }, response);
        }

        // GET api/VisitorRequest
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VisitorRequestResponseDto>>> GetAllVisitorRequests()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found");

            var requests = await _repository.GetByUserIdAsync(userId);
            var response = requests.Select(MapToResponseDto);
            return Ok(response);
        }

        // GET api/VisitorRequest/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<VisitorRequestResponseDto>> GetVisitorRequestById(int id)
        {
            var request = await _repository.GetByIdAsync(id);
            if (request == null)
                return NotFound($"Visitor request with ID {id} not found");

            var response = MapToResponseDto(request);
            return Ok(response);
        }

        // GET api/VisitorRequest/uuid/{uuid}
        [HttpGet("uuid/{uuid}")]
        public async Task<ActionResult<VisitorRequestResponseDto>> GetVisitorRequestByUUID(Guid uuid)
        {
            var request = await _repository.GetByUUIDAsync(uuid);
            if (request == null)
                return NotFound($"Visitor request with UUID {uuid} not found");

            var response = MapToResponseDto(request);
            return Ok(response);
        }

        // GET api/VisitorRequest/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<VisitorRequestResponseDto>>> GetVisitorRequestsByUserId(string userId)
        {
            var requests = await _repository.GetByUserIdAsync(userId);
            var response = requests.Select(MapToResponseDto);
            return Ok(response);
        }

        // GET api/VisitorRequest/all - For guards only
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<VisitorRequestResponseDto>>> GetAllVisitorRequestsForGuards()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found");

            // Check if user is a guard (not a resident)
            var user = await _repository.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound("User not found");

            if (user.IsResident)
                return Forbid("Only guards can access all visitor requests");

            var requests = await _repository.GetAllAsync();
            var response = requests.Select(MapToResponseDto);
            return Ok(response);
        }

        // DELETE api/VisitorRequest/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVisitorRequest(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found");

            var request = await _repository.GetByIdAsync(id);
            if (request == null)
                return NotFound($"Visitor request with ID {id} not found");

            // Check if the user owns this request or is an admin (you can add admin role check here)
            if (request.UserId != userId)
                return Forbid("You can only delete your own visitor requests");

            var deleted = await _repository.DeleteAsync(id);
            if (!deleted)
                return NotFound($"Visitor request with ID {id} not found");

            return NoContent();
        }

        // POST api/VisitorRequest/{id} (for editing)
        [HttpPost("{id}")]
        public async Task<ActionResult<VisitorRequestResponseDto>> UpdateVisitorRequest(int id, [FromBody] UpdateVisitorRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validate that Expiry is after VisitDateTime
            if (dto.Expiry <= dto.VisitDateTime)
                return BadRequest("Expiry must be after VisitDateTime");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found");

            var existingRequest = await _repository.GetByIdAsync(id);
            if (existingRequest == null)
                return NotFound($"Visitor request with ID {id} not found");

            // Check if the user owns this request
            if (existingRequest.UserId != userId)
                return Forbid("You can only edit your own visitor requests");

            var updatedRequest = new VisitorRequest
            {
                VisitDateTime = dto.VisitDateTime,
                Expiry = dto.Expiry,
                VisitorName = dto.VisitorName,
                VehiclePlateNumber = dto.VehiclePlateNumber
            };

            var result = await _repository.UpdateAsync(id, updatedRequest);
            if (result == null)
                return NotFound($"Visitor request with ID {id} not found");

            var response = MapToResponseDto(result);
            return Ok(response);
        }

        private static VisitorRequestResponseDto MapToResponseDto(VisitorRequest request)
        {
            return new VisitorRequestResponseDto
            {
                Id = request.Id,
                DateTimeCreated = request.DateTimeCreated,
                VisitDateTime = request.VisitDateTime,
                Expiry = request.Expiry,
                VisitorName = request.VisitorName,
                VehiclePlateNumber = request.VehiclePlateNumber,
                UUID = request.UUID,
                UserId = request.UserId,
                UserEmail = request.User?.Email ?? string.Empty,
                UnitNo = request.User?.UnitNo,
                StreetNo = request.User?.StreetNo
            };
        }
    }
}

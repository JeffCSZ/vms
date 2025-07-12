using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using vmsapi.Models;
using vmsapi.Services;

namespace vmsapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<MyUser> _userManager;
        private readonly SignInManager<MyUser> _signInManager;
        private readonly IJwtService _jwtService;
        private readonly IConfiguration _configuration;

        public AccountController(UserManager<MyUser> userManager, SignInManager<MyUser> signInManager, IJwtService jwtService, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new MyUser
            {
                UserName = model.Email,
                Email = model.Email,
                UnitNo = model.UnitNo,
                StreetNo = model.StreetNo,
                IsResident = model.IsResident
            };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                var token = _jwtService.GenerateToken(user);
                var jwtSettings = _configuration.GetSection("Jwt");
                var expiryMinutes = double.Parse(jwtSettings["ExpiryInMinutes"]!);

                var response = new AuthResponse
                {
                    Token = token,
                    Email = user.Email!,
                    UnitNo = user.UnitNo,
                    StreetNo = user.StreetNo,
                    IsResident = user.IsResident,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes)
                };

                return Ok(response);
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Invalid login attempt." });
            }

            // Validate account type if specified
            if (!string.IsNullOrEmpty(model.ExpectedAccountType))
            {
                bool isExpectedResident = model.ExpectedAccountType.ToLower() == "resident";
                if (user.IsResident != isExpectedResident)
                {
                    string expectedType = isExpectedResident ? "resident" : "guard";
                    string actualType = user.IsResident ? "resident" : "guard";
                    return BadRequest(new { message = $"This account is registered as a {actualType}. Please use the {expectedType} app to log in." });
                }
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

            if (result.Succeeded)
            {
                var token = _jwtService.GenerateToken(user);
                var jwtSettings = _configuration.GetSection("Jwt");
                var expiryMinutes = double.Parse(jwtSettings["ExpiryInMinutes"]!);

                var response = new AuthResponse
                {
                    Token = token,
                    Email = user.Email!,
                    UnitNo = user.UnitNo,
                    StreetNo = user.StreetNo,
                    IsResident = user.IsResident,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes)
                };

                return Ok(response);
            }

            if (result.IsLockedOut)
            {
                return BadRequest(new { message = "User account locked out." });
            }

            return BadRequest(new { message = "Invalid login attempt." });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // With JWT tokens, logout is handled client-side by removing the token
            // Server-side logout would require token blacklisting which is more complex
            return Ok(new { message = "Logout successful. Please remove the token from client storage." });
        }
    }
}

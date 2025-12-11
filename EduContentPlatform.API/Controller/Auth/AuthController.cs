using EduContentPlatform.Models.Users;
using EduContentPlatform.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EduContentPlatform.API.Controllers.Auth
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var result = await _authService.RegisterAsync(request);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration failed for email: {Email}", request.Email);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var result = await _authService.LoginAsync(request);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed for email: {Email}", request.Email);
                return Unauthorized(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("social-login")]
        public async Task<IActionResult> SocialLogin([FromBody] SocialLoginRequest request)
        {
            try
            {
                var result = await _authService.SocialLoginAsync(request);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Social login failed for provider: {Provider}", request.Provider);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                await _authService.ForgotPasswordAsync(request.Email);
                return Ok(new { success = true, message = "If this email exists, you'll receive reset instructions." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Forgot password failed for email: {Email}", request.Email);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                var result = await _authService.ResetPasswordAsync(request.Token, request.NewPassword);
                if (result)
                {
                    return Ok(new { success = true, message = "Password reset successfully!" });
                }
                return BadRequest(new { success = false, message = "Failed to reset password." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Reset password failed");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var result = await _authService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword);
                if (result)
                {
                    return Ok(new { success = true, message = "Password changed successfully!" });
                }
                return BadRequest(new { success = false, message = "Failed to change password." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Change password failed for user");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var profile = await _authService.GetUserProfileAsync(userId);
                return Ok(new { success = true, data = profile });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Get profile failed");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var updatedProfile = await _authService.UpdateUserProfileAsync(userId, request);
                return Ok(new { success = true, data = updatedProfile, message = "Profile updated successfully!" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Update profile failed");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("social-logins")]
        public async Task<IActionResult> GetSocialLogins()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var socialLogins = await _authService.GetUserSocialLoginsAsync(userId);
                return Ok(new { success = true, data = socialLogins });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Get social logins failed");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("social-logins/{provider}")]
        public async Task<IActionResult> RemoveSocialLogin(string provider)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var result = await _authService.RemoveSocialLoginAsync(userId, provider);
                if (result)
                {
                    return Ok(new { success = true, message = $"Removed {provider} login successfully." });
                }
                return BadRequest(new { success = false, message = "Failed to remove social login." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Remove social login failed for provider: {Provider}", provider);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("health")]
        public IActionResult HealthCheck()
        {
            return Ok(new { success = true, message = "Auth API is running", timestamp = DateTime.UtcNow });
        }
    }
}
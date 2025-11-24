using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EduContentPlatform.Services.Auth;
using EduContentPlatform.API.Authorization;

namespace EduContentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IAuthService _authService;

        public UsersController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            var userProfile = await _authService.GetUserProfileAsync(userId);
            return Ok(new { success = true, data = userProfile });
        }

        [HttpGet("admin-only")]
        [AuthorizeAdmin]
        public IActionResult AdminOnly()
        {
            return Ok(new { success = true, message = "This is only accessible by Admin" });
        }

        [HttpGet("teacher-only")]
        [AuthorizeTeacher]
        public IActionResult TeacherOnly()
        {
            return Ok(new { success = true, message = "This is only accessible by Teachers and above" });
        }
    }
}
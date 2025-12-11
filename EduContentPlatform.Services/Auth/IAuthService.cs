using EduContentPlatform.Models.Users;
using System.Threading.Tasks;

namespace EduContentPlatform.Services.Auth
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> SocialLoginAsync(SocialLoginRequest request);
        Task<bool> ForgotPasswordAsync(string email);
        Task<bool> ResetPasswordAsync(string token, string newPassword);
        Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
        Task<UserWithRolesModel> GetUserProfileAsync(int userId);
        Task<UserWithRolesModel> UpdateUserProfileAsync(int userId, UpdateProfileRequest request);
        Task<List<SocialLoginModel>> GetUserSocialLoginsAsync(int userId);
        Task<bool> RemoveSocialLoginAsync(int userId, string provider);
    }
}
using EduContentPlatform.Models.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Services.Auth
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<bool> ResetPasswordAsync(string token, string newPassword);
        Task<bool> ForgotPasswordAsync(string email);
        Task<UserModel> GetUserProfileAsync(int userId);
    }
}

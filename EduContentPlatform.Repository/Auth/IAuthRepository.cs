using EduContentPlatform.Models.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Repository.Auth
{
    public interface IAuthRepository
    {
        Task<UserModel> GetUserByIdAsync(int id);
        Task<UserModel> GetUserByEmailAsync(string email);
        Task<UserModel> GetUserBySocialIdAsync(string socialId, string provider);
        Task<int> CreateUserAsync(UserModel user);
        Task<bool> UpdateLastLoginAsync(int userId);
        Task<bool> UpdateUserPasswordAsync(int userId, string passwordHash, string salt, bool hasSetPassword);
        Task<bool> CheckEmailExistsAsync(string email);
        Task CreateSocialLoginAsync(int userId, string socialId, string provider);
        Task<bool> HasSocialLoginsAsync(int userId);
        Task SaveResetTokenAsync(int userId, string resetToken);
        Task<UserModel> GetUserByResetTokenAsync(string resetToken);
        Task ClearResetTokenAsync(int userId);

        Task<UserModel> GetUserProfileAsync(int userId);
    }
}

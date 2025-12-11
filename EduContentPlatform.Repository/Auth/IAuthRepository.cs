using EduContentPlatform.Models.Users;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EduContentPlatform.Repository.Auth
{
    public interface IAuthRepository
    {
        Task<UserModel> GetUserByIdAsync(int id);
        Task<UserModel> GetUserByEmailAsync(string email);
        Task<UserWithRolesModel> GetUserWithRolesByIdAsync(int id);
        Task<UserWithRolesModel> GetUserWithRolesByEmailAsync(string email);
        Task<UserModel> GetUserBySocialIdAsync(string socialId, string provider);
        Task<UserModel> GetUserByResetTokenAsync(string resetToken);

        Task<int> CreateUserAsync(UserModel user);
        Task<bool> UpdateUserAsync(UserModel user);

        Task<bool> UpdateLastLoginAsync(int userId);
        Task<bool> UpdateUserPasswordAsync(int userId, string passwordHash, string salt, bool hasSetPassword);

        Task<bool> CheckEmailExistsAsync(string email);
        Task<bool> CheckUsernameExistsAsync(string username);

        Task CreateSocialLoginAsync(SocialLoginModel socialLogin);
        Task<bool> HasSocialLoginsAsync(int userId);
        Task<List<SocialLoginModel>> GetUserSocialLoginsAsync(int userId);
        Task RemoveSocialLoginAsync(int userId, string provider);
        Task LinkSocialAccountAsync(SocialLoginModel socialLogin);
        Task<List<SocialLoginModel>> FindSocialAccountsByEmailAsync(string email, string provider = null);

        Task SaveResetTokenAsync(int userId, string resetToken, DateTime resetTokenExpiry);
        Task ClearResetTokenAsync(int userId);

        // Role management
        Task<List<string>> GetUserRolesAsync(int userId);
        Task AssignRoleAsync(int userId, string roleName, int assignedBy = 0, string notes = null);
        Task RemoveRoleAsync(int userId, string roleName);
        Task<bool> UserHasRoleAsync(int userId, string roleName);

        // For checking roles
        Task<RoleModel> GetRoleByNameAsync(string roleName);
    }
}
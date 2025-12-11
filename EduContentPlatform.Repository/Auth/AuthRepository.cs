using Dapper;
using EduContentPlatform.Models.Users;
using EduContentPlatform.Repository.Database;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace EduContentPlatform.Repository.Auth
{
    public class AuthRepository : IAuthRepository
    {
        private readonly ISqlConnectionFactory _connectionFactory;
        private readonly ILogger<AuthRepository> _logger;

        public AuthRepository(ISqlConnectionFactory connectionFactory, ILogger<AuthRepository> logger)
        {
            _connectionFactory = connectionFactory;
            _logger = logger;
        }

        private void LogError(string method, Exception ex, object payload = null)
        {
            _logger.LogError(ex, $"[AuthRepository::{method}] Error occurred. Payload: {@payload}");
        }

        public async Task<UserModel> GetUserByIdAsync(int id)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();
                return await connection.QueryFirstOrDefaultAsync<UserModel>(
                    "spUsers_GetById",
                    new { UserId = id },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(GetUserByIdAsync), ex, new { id });
                throw new Exception("Failed to fetch user by ID.");
            }
        }

        public async Task<UserModel> GetUserByEmailAsync(string email)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();
                return await connection.QueryFirstOrDefaultAsync<UserModel>(
                    "spUsers_GetByEmail",
                    new { Email = email },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(GetUserByEmailAsync), ex, new { email });
                throw new Exception("Failed to fetch user by email.");
            }
        }

        public async Task<UserWithRolesModel> GetUserWithRolesByIdAsync(int id)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                using var multi = await connection.QueryMultipleAsync(
                    "spUsers_GetById; spUserRoles_GetUserRoles",
                    new { UserId = id },
                    commandType: CommandType.StoredProcedure
                );

                var user = await multi.ReadFirstOrDefaultAsync<UserModel>();
                var roles = await multi.ReadAsync<string>();

                if (user == null) return null;

                return new UserWithRolesModel
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    Email = user.Email,
                    DisplayName = user.DisplayName,
                    PasswordHash = user.PasswordHash,
                    Salt = user.Salt,
                    PhoneNumber = user.PhoneNumber,
                    ProfileImageUrl = user.ProfileImageUrl,
                    Bio = user.Bio,
                    Country = user.Country,
                    IsActive = user.IsActive,
                    IsEmailVerified = user.IsEmailVerified,
                    HasSetPassword = user.HasSetPassword,
                    ResetToken = user.ResetToken,
                    ResetTokenExpiry = user.ResetTokenExpiry,
                    LastLoginAt = user.LastLoginAt,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    Roles = roles?.ToList() ?? new List<string>()
                };
            }
            catch (Exception ex)
            {
                LogError(nameof(GetUserWithRolesByIdAsync), ex, new { id });
                throw new Exception("Failed to fetch user with roles by ID.");
            }
        }

        public async Task<UserWithRolesModel> GetUserWithRolesByEmailAsync(string email)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();
                var user = await GetUserByEmailAsync(email);
                if (user == null) return null;

                var roles = await GetUserRolesAsync(user.UserId);

                return new UserWithRolesModel
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    Email = user.Email,
                    DisplayName = user.DisplayName,
                    PasswordHash = user.PasswordHash,
                    Salt = user.Salt,
                    PhoneNumber = user.PhoneNumber,
                    ProfileImageUrl = user.ProfileImageUrl,
                    Bio = user.Bio,
                    Country = user.Country,
                    IsActive = user.IsActive,
                    IsEmailVerified = user.IsEmailVerified,
                    HasSetPassword = user.HasSetPassword,
                    ResetToken = user.ResetToken,
                    ResetTokenExpiry = user.ResetTokenExpiry,
                    LastLoginAt = user.LastLoginAt,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    Roles = roles
                };
            }
            catch (Exception ex)
            {
                LogError(nameof(GetUserWithRolesByEmailAsync), ex, new { email });
                throw new Exception("Failed to fetch user with roles by email.");
            }
        }

        public async Task<UserModel> GetUserBySocialIdAsync(string socialId, string provider)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();
                return await connection.QueryFirstOrDefaultAsync<UserModel>(
                    "spUsers_GetBySocialId",
                    new { SocialId = socialId, Provider = provider },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(GetUserBySocialIdAsync), ex, new { socialId, provider });
                throw new Exception("Failed to fetch user by social login.");
            }
        }

        public async Task<int> CreateUserAsync(UserModel user)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                var parameters = new DynamicParameters();
                parameters.Add("@Username", user.Username);
                parameters.Add("@Email", user.Email);
                parameters.Add("@DisplayName", user.DisplayName);
                parameters.Add("@PasswordHash", user.PasswordHash);
                parameters.Add("@Salt", user.Salt);
                parameters.Add("@PhoneNumber", user.PhoneNumber);
                parameters.Add("@Country", user.Country);
                parameters.Add("@IsActive", user.IsActive);
                parameters.Add("@HasSetPassword", user.HasSetPassword);
                parameters.Add("@UserId", dbType: DbType.Int32, direction: ParameterDirection.Output);

                await connection.ExecuteAsync(
                    "spUsers_Create",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return parameters.Get<int>("@UserId");
            }
            catch (Exception ex)
            {
                LogError(nameof(CreateUserAsync), ex, user);
                throw new Exception("Failed to create a new user.");
            }
        }

        public async Task<bool> UpdateUserAsync(UserModel user)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                var rows = await connection.ExecuteAsync(
                    @"UPDATE dbo.Users 
                      SET DisplayName = @DisplayName,
                          PhoneNumber = @PhoneNumber,
                          ProfileImageUrl = @ProfileImageUrl,
                          Bio = @Bio,
                          Country = @Country,
                          UpdatedAt = SYSUTCDATETIME()
                      WHERE UserId = @UserId",
                    user
                );

                return rows > 0;
            }
            catch (Exception ex)
            {
                LogError(nameof(UpdateUserAsync), ex, user);
                throw new Exception("Failed to update user.");
            }
        }

        public async Task<bool> UpdateLastLoginAsync(int userId)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                var rows = await connection.ExecuteAsync(
                    "spUsers_UpdateLastLogin",
                    new { UserId = userId },
                    commandType: CommandType.StoredProcedure
                );

                return rows > 0;
            }
            catch (Exception ex)
            {
                LogError(nameof(UpdateLastLoginAsync), ex, new { userId });
                throw new Exception("Failed to update last login.");
            }
        }

        public async Task<bool> UpdateUserPasswordAsync(int userId, string passwordHash, string salt, bool hasSetPassword)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                var rows = await connection.ExecuteAsync(
                    "spUsers_UpdatePassword",
                    new
                    {
                        UserId = userId,
                        PasswordHash = passwordHash,
                        Salt = salt,
                        HasSetPassword = hasSetPassword
                    },
                    commandType: CommandType.StoredProcedure
                );

                return rows > 0;
            }
            catch (Exception ex)
            {
                LogError(nameof(UpdateUserPasswordAsync), ex, new { userId });
                throw new Exception("Failed to update user password.");
            }
        }

        public async Task<bool> CheckEmailExistsAsync(string email)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                return await connection.ExecuteScalarAsync<bool>(
                    "spUsers_CheckEmailExists",
                    new { Email = email },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(CheckEmailExistsAsync), ex, new { email });
                throw new Exception("Failed to check email existence.");
            }
        }

        public async Task<bool> CheckUsernameExistsAsync(string username)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                return await connection.ExecuteScalarAsync<bool>(
                    "SELECT CASE WHEN EXISTS (SELECT 1 FROM dbo.Users WHERE Username = @Username) THEN 1 ELSE 0 END",
                    new { Username = username }
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(CheckUsernameExistsAsync), ex, new { username });
                throw new Exception("Failed to check username existence.");
            }
        }

        public async Task CreateSocialLoginAsync(SocialLoginModel socialLogin)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                await connection.ExecuteAsync(
                    "spUserSocialLogins_Create",
                    new
                    {
                        UserId = socialLogin.UserId,
                        Provider = socialLogin.Provider,
                        ProviderKey = socialLogin.ProviderKey,
                        Email = socialLogin.Email,
                        DisplayName = socialLogin.DisplayName,
                        ProfileUrl = socialLogin.ProfileUrl,
                        ImageUrl = socialLogin.ImageUrl,
                        AccessToken = socialLogin.AccessToken,
                        RefreshToken = socialLogin.RefreshToken,
                        TokenExpiry = socialLogin.TokenExpiry
                    },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(CreateSocialLoginAsync), ex, socialLogin);
                throw new Exception("Failed to create social login record.");
            }
        }

        public async Task<bool> HasSocialLoginsAsync(int userId)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                return await connection.ExecuteScalarAsync<bool>(
                    "spUsers_HasSocialLogins",
                    new { UserId = userId },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(HasSocialLoginsAsync), ex, new { userId });
                throw new Exception("Failed to check user social logins.");
            }
        }

        public async Task<List<SocialLoginModel>> GetUserSocialLoginsAsync(int userId)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                var result = await connection.QueryAsync<SocialLoginModel>(
                    "spUsers_GetSocialLogins",
                    new { UserId = userId },
                    commandType: CommandType.StoredProcedure
                );

                return result.AsList();
            }
            catch (Exception ex)
            {
                LogError(nameof(GetUserSocialLoginsAsync), ex, new { userId });
                throw new Exception("Failed to get user social logins.");
            }
        }

        public async Task RemoveSocialLoginAsync(int userId, string provider)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                await connection.ExecuteAsync(
                    "spUsers_RemoveSocialLogin",
                    new { UserId = userId, Provider = provider },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(RemoveSocialLoginAsync), ex, new { userId, provider });
                throw new Exception("Failed to remove social login.");
            }
        }

        public async Task LinkSocialAccountAsync(SocialLoginModel socialLogin)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                await connection.ExecuteAsync(
                    "spUsers_LinkSocialAccount",
                    new
                    {
                        UserId = socialLogin.UserId,
                        Provider = socialLogin.Provider,
                        ProviderKey = socialLogin.ProviderKey,
                        Email = socialLogin.Email,
                        DisplayName = socialLogin.DisplayName,
                        ProfileUrl = socialLogin.ProfileUrl,
                        ImageUrl = socialLogin.ImageUrl
                    },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(LinkSocialAccountAsync), ex, socialLogin);
                throw new Exception("Failed to link social account.");
            }
        }

        public async Task<List<SocialLoginModel>> FindSocialAccountsByEmailAsync(string email, string provider = null)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                var result = await connection.QueryAsync<SocialLoginModel>(
                    @"SELECT sl.Provider, sl.UserId 
                      FROM dbo.UserSocialLogins sl
                      WHERE sl.Email = @Email
                        AND (@Provider IS NULL OR sl.Provider = @Provider)",
                    new { Email = email, Provider = provider }
                );

                return result.AsList();
            }
            catch (Exception ex)
            {
                LogError(nameof(FindSocialAccountsByEmailAsync), ex, new { email, provider });
                throw new Exception("Failed to find social accounts by email.");
            }
        }

        public async Task SaveResetTokenAsync(int userId, string resetToken, DateTime resetTokenExpiry)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                await connection.ExecuteAsync(
                    "spUsers_SaveResetToken",
                    new
                    {
                        UserId = userId,
                        ResetToken = resetToken,
                        ResetTokenExpiry = resetTokenExpiry
                    },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(SaveResetTokenAsync), ex, new { userId });
                throw new Exception("Failed to save reset token.");
            }
        }

        public async Task<UserModel> GetUserByResetTokenAsync(string resetToken)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                return await connection.QueryFirstOrDefaultAsync<UserModel>(
                    "spUsers_GetByResetToken",
                    new { ResetToken = resetToken },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(GetUserByResetTokenAsync), ex, new { resetToken });
                throw new Exception("Failed to fetch user by reset token.");
            }
        }

        public async Task ClearResetTokenAsync(int userId)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                await connection.ExecuteAsync(
                    "spUsers_ClearResetToken",
                    new { UserId = userId },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(ClearResetTokenAsync), ex, new { userId });
                throw new Exception("Failed to clear reset token.");
            }
        }

        public async Task<List<string>> GetUserRolesAsync(int userId)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                var result = await connection.QueryAsync<string>(
                    "spUserRoles_GetUserRoles",
                    new { UserId = userId },
                    commandType: CommandType.StoredProcedure
                );

                return result.AsList();
            }
            catch (Exception ex)
            {
                LogError(nameof(GetUserRolesAsync), ex, new { userId });
                throw new Exception("Failed to get user roles.");
            }
        }

        public async Task AssignRoleAsync(int userId, string roleName, int assignedBy = 0, string notes = null)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                await connection.ExecuteAsync(
                    "spUserRoles_AssignRole",
                    new
                    {
                        UserId = userId,
                        RoleName = roleName,
                        AssignedBy = assignedBy > 0 ? (int?)assignedBy : null,
                        Notes = notes
                    },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(AssignRoleAsync), ex, new { userId, roleName });
                throw new Exception("Failed to assign role to user.");
            }
        }

        public async Task RemoveRoleAsync(int userId, string roleName)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                await connection.ExecuteAsync(
                    "spUserRoles_RemoveRole",
                    new { UserId = userId, RoleName = roleName },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(RemoveRoleAsync), ex, new { userId, roleName });
                throw new Exception("Failed to remove role from user.");
            }
        }

        public async Task<bool> UserHasRoleAsync(int userId, string roleName)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                var result = await connection.ExecuteScalarAsync<bool?>(
                    @"SELECT CAST(CASE WHEN EXISTS (
                        SELECT 1 FROM dbo.UserRoles ur
                        INNER JOIN dbo.Roles r ON ur.RoleId = r.RoleId
                        WHERE ur.UserId = @UserId AND r.RoleName = @RoleName
                    ) THEN 1 ELSE 0 END AS BIT)",
                    new { UserId = userId, RoleName = roleName }
                );

                return result ?? false;
            }
            catch (Exception ex)
            {
                LogError(nameof(UserHasRoleAsync), ex, new { userId, roleName });
                throw new Exception("Failed to check if user has role.");
            }
        }

        public async Task<RoleModel> GetRoleByNameAsync(string roleName)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                return await connection.QueryFirstOrDefaultAsync<RoleModel>(
                    @"SELECT RoleId, RoleName, Description, CreatedAt 
                      FROM dbo.Roles 
                      WHERE RoleName = @RoleName",
                    new { RoleName = roleName }
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(GetRoleByNameAsync), ex, new { roleName });
                throw new Exception("Failed to get role by name.");
            }
        }
    }
}
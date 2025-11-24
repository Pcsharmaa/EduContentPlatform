using Dapper;
using EduContentPlatform.Models.Users;
using EduContentPlatform.Repository.Database;
using Microsoft.Extensions.Logging;
using System;
using System.Data;
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

        // ================================
        // GET USER BY EMAIL
        // ================================
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

        // ================================
        // GET USER BY SOCIAL LOGIN
        // ================================
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

        // ================================
        // CREATE USER
        // ================================
        public async Task<int> CreateUserAsync(UserModel user)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                var parameters = new DynamicParameters();
                parameters.Add("@Email", user.Email);
                parameters.Add("@DisplayName", user.DisplayName);
                parameters.Add("@UserTypeId", user.UserTypeId);
                parameters.Add("@PasswordHash", user.PasswordHash);
                parameters.Add("@Salt", user.Salt);
                parameters.Add("@IsActive", user.IsActive);
                parameters.Add("@CreatedAt", user.CreatedAt);
                parameters.Add("@Id", dbType: DbType.Int32, direction: ParameterDirection.Output);

                await connection.ExecuteAsync(
                    "spUsers_Create",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return parameters.Get<int>("@Id");
            }
            catch (Exception ex)
            {
                LogError(nameof(CreateUserAsync), ex, user);
                throw new Exception("Failed to create a new user.");
            }
        }

        // ================================
        // CREATE SOCIAL LOGIN
        // ================================
        public async Task CreateSocialLoginAsync(int userId, string socialId, string provider)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                await connection.ExecuteAsync(
                    "spUserSocialLogins_Create",
                    new
                    {
                        UserId = userId,
                        SocialId = socialId,
                        Provider = provider,
                        CreatedAt = DateTime.UtcNow
                    },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(CreateSocialLoginAsync), ex, new { userId, socialId, provider });
                throw new Exception("Failed to create social login record.");
            }
        }

        // ================================
        // UPDATE LAST LOGIN
        // ================================
        public async Task<bool> UpdateLastLoginAsync(int userId)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                var rows = await connection.ExecuteAsync(
                    "spUsers_UpdateLastLogin",
                    new { UserId = userId, LastLoginAt = DateTime.UtcNow },
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

        // ================================
        // UPDATE PASSWORD
        // ================================
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

        // ================================
        // CHECK EMAIL EXISTS
        // ================================
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

        // ================================
        // CHECK SOCIAL LOGIN EXISTS
        // ================================
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

        // ================================
        // SAVE RESET TOKEN
        // ================================
        public async Task SaveResetTokenAsync(int userId, string resetToken)
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
                        ResetTokenExpiry = DateTime.UtcNow.AddHours(24)
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

        // ================================
        // GET USER BY RESET TOKEN
        // ================================
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

        // ================================
        // CLEAR RESET TOKEN
        // ================================
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

        // ================================
        // GET USER BY ID
        // ================================
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

        // ================================
        // GET USER Profile BY ID
        // ================================
        public async Task<UserModel> GetUserProfileAsync(int userId)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();

                return await connection.QueryFirstOrDefaultAsync<UserModel>(
                    "spUsers_GetUserProfile",
                    new { UserId = userId },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(GetUserByIdAsync), ex, new { userId });
                throw new Exception("Failed to fetch user by ID.");
            }
        }
    }
}

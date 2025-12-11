using EduContentPlatform.Models.Users;
using EduContentPlatform.Repository.Auth;
using EduContentPlatform.Services.Utilities;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EduContentPlatform.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IJwtService _jwtService;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ILogger<AuthService> _logger;
        private readonly IEmailService _emailService;

        public AuthService(
            IAuthRepository authRepository,
            IJwtService jwtService,
            IPasswordHasher passwordHasher,
            ILogger<AuthService> logger,
            IEmailService emailService = null)
        {
            _authRepository = authRepository;
            _jwtService = jwtService;
            _passwordHasher = passwordHasher;
            _logger = logger;
            _emailService = emailService;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            try
            {
                // Validate email
                if (string.IsNullOrWhiteSpace(request.Email))
                    throw new Exception("Email is required.");

                if (!IsValidEmail(request.Email))
                    throw new Exception("Invalid email format.");

                // Check if email already exists
                if (await _authRepository.CheckEmailExistsAsync(request.Email))
                    throw new Exception("Email already exists.");

                // Check username if provided
                if (!string.IsNullOrWhiteSpace(request.Username))
                {
                    if (await _authRepository.CheckUsernameExistsAsync(request.Username))
                        throw new Exception("Username already exists.");
                }
                else
                {
                    // Generate username from email
                    request.Username = request.Email.Split('@')[0];
                }

                // Hash password
                var salt = _passwordHasher.GenerateSalt();
                var passwordHash = _passwordHasher.HashPassword(request.Password, salt);

                // Create user
                var user = new UserModel
                {
                    Username = request.Username,
                    Email = request.Email.ToLower(),
                    DisplayName = request.DisplayName ?? request.Username,
                    PasswordHash = passwordHash,
                    Salt = salt,
                    PhoneNumber = request.PhoneNumber,
                    Country = request.Country,
                    IsActive = true,
                    IsEmailVerified = false,
                    HasSetPassword = true,
                    CreatedAt = DateTime.UtcNow
                };

                var userId = await _authRepository.CreateUserAsync(user);
                user.UserId = userId;

                // Assign default Student role
                await _authRepository.AssignRoleAsync(userId, "Student");

                // Get user with roles
                var userWithRoles = await _authRepository.GetUserWithRolesByIdAsync(userId);

                // Generate token
                var token = _jwtService.GenerateToken(userWithRoles);

                // Send welcome email (optional)
                if (_emailService != null)
                {
                    try
                    {
                        await _emailService.SendWelcomeEmailAsync(user.Email, user.DisplayName);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to send welcome email to {Email}", user.Email);
                    }
                }

                return new AuthResponse
                {
                    Token = token,
                    User = userWithRoles,
                    ExpiresAt = DateTime.UtcNow.AddDays(7),
                    HasSetPassword = true,
                    Message = "Registration successful. Welcome to EduContent Platform!"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration failed for email: {Email}", request.Email);
                throw;
            }
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                // Get user with roles
                var user = await _authRepository.GetUserWithRolesByEmailAsync(request.Email);
                if (user == null || !user.IsActive)
                    throw new Exception("Invalid email or password.");

                // Check if user has set password (social users might not have)
                if (!user.HasSetPassword || string.IsNullOrEmpty(user.PasswordHash))
                    throw new Exception("Please use social login or setup your password using 'Forgot Password'.");

                // Verify password
                if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash, user.Salt))
                    throw new Exception("Invalid email or password.");

                // Update last login
                await _authRepository.UpdateLastLoginAsync(user.UserId);

                // Generate token
                var token = _jwtService.GenerateToken(user);

                return new AuthResponse
                {
                    Token = token,
                    User = user,
                    ExpiresAt = DateTime.UtcNow.AddDays(7),
                    HasSetPassword = user.HasSetPassword,
                    Message = "Login successful."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed for email: {Email}", request.Email);
                throw;
            }
        }

        public async Task<AuthResponse> SocialLoginAsync(SocialLoginRequest request)
        {
            try
            {
                // Check if social account already exists
                var existingUser = await _authRepository.GetUserBySocialIdAsync(request.ProviderKey, request.Provider);

                if (existingUser != null)
                {
                    // Existing user found, update social login info and return auth
                    await UpdateSocialLoginInfo(existingUser.UserId, request);
                    await _authRepository.UpdateLastLoginAsync(existingUser.UserId);

                    var userWithRoles = await _authRepository.GetUserWithRolesByIdAsync(existingUser.UserId);
                    var token = _jwtService.GenerateToken(userWithRoles);

                    return new AuthResponse
                    {
                        Token = token,
                        User = userWithRoles,
                        ExpiresAt = DateTime.UtcNow.AddDays(7),
                        HasSetPassword = existingUser.HasSetPassword,
                        Message = "Social login successful."
                    };
                }

                // New social login - check if email exists in system
                if (!string.IsNullOrEmpty(request.Email))
                {
                    var emailUser = await _authRepository.GetUserByEmailAsync(request.Email);
                    if (emailUser != null)
                    {
                        // Link social account to existing user
                        await LinkSocialToExistingUser(emailUser.UserId, request);
                        await _authRepository.UpdateLastLoginAsync(emailUser.UserId);

                        var userWithRoles = await _authRepository.GetUserWithRolesByIdAsync(emailUser.UserId);
                        var token = _jwtService.GenerateToken(userWithRoles);

                        return new AuthResponse
                        {
                            Token = token,
                            User = userWithRoles,
                            ExpiresAt = DateTime.UtcNow.AddDays(7),
                            HasSetPassword = emailUser.HasSetPassword,
                            Message = "Social account linked successfully."
                        };
                    }
                }

                // Create new user from social login
                var newUser = await CreateUserFromSocialLogin(request);

                // Create social login record
                var socialLogin = new SocialLoginModel
                {
                    UserId = newUser.UserId,
                    Provider = request.Provider,
                    ProviderKey = request.ProviderKey,
                    Email = request.Email,
                    DisplayName = request.DisplayName,
                    ProfileUrl = request.ProfileUrl,
                    ImageUrl = request.ImageUrl,
                    AccessToken = request.AccessToken,
                    RefreshToken = request.RefreshToken,
                    TokenExpiry = request.TokenExpiry,
                    LastLoginAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                };

                await _authRepository.CreateSocialLoginAsync(socialLogin);

                // Get user with roles
                var newUserWithRoles = await _authRepository.GetUserWithRolesByIdAsync(newUser.UserId);
                var newToken = _jwtService.GenerateToken(newUserWithRoles);

                return new AuthResponse
                {
                    Token = newToken,
                    User = newUserWithRoles,
                    ExpiresAt = DateTime.UtcNow.AddDays(7),
                    HasSetPassword = newUser.HasSetPassword,
                    Message = "Account created via social login."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Social login failed for provider: {Provider}, email: {Email}",
                    request.Provider, request.Email);
                throw;
            }
        }

        public async Task<bool> ForgotPasswordAsync(string email)
        {
            try
            {
                var user = await _authRepository.GetUserByEmailAsync(email);
                if (user == null || !user.IsActive)
                {
                    // Don't reveal if user exists for security
                    return true;
                }

                // Generate reset token
                var resetToken = Guid.NewGuid().ToString("N") + "-" + DateTime.UtcNow.Ticks;
                var expiry = DateTime.UtcNow.AddHours(24);

                await _authRepository.SaveResetTokenAsync(user.UserId, resetToken, expiry);

                // Send reset email
                if (_emailService != null)
                {
                    await _emailService.SendPasswordResetEmailAsync(user.Email, user.DisplayName, resetToken);
                }
                else
                {
                    // Log token for development
                    _logger.LogInformation("Password reset token for {Email}: {Token}", user.Email, resetToken);
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Forgot password failed for email: {Email}", email);
                throw;
            }
        }

        public async Task<bool> ResetPasswordAsync(string token, string newPassword)
        {
            try
            {
                var user = await _authRepository.GetUserByResetTokenAsync(token);
                if (user == null)
                    throw new Exception("Invalid or expired reset token.");

                // Validate new password
                if (string.IsNullOrWhiteSpace(newPassword) || newPassword.Length < 6)
                    throw new Exception("Password must be at least 6 characters long.");

                // Hash new password
                var salt = _passwordHasher.GenerateSalt();
                var passwordHash = _passwordHasher.HashPassword(newPassword, salt);

                // Update password
                var updated = await _authRepository.UpdateUserPasswordAsync(
                    user.UserId, passwordHash, salt, true);

                if (updated)
                {
                    await _authRepository.ClearResetTokenAsync(user.UserId);

                    // Send confirmation email
                    if (_emailService != null)
                    {
                        await _emailService.SendPasswordResetConfirmationAsync(user.Email, user.DisplayName);
                    }
                }

                return updated;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Reset password failed for token: {Token}", token);
                throw;
            }
        }

        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            try
            {
                var user = await _authRepository.GetUserByIdAsync(userId);
                if (user == null || !user.IsActive)
                    throw new Exception("User not found.");

                if (!user.HasSetPassword)
                    throw new Exception("Please set up your password first.");

                // Verify current password
                if (!_passwordHasher.VerifyPassword(currentPassword, user.PasswordHash, user.Salt))
                    throw new Exception("Current password is incorrect.");

                // Validate new password
                if (string.IsNullOrWhiteSpace(newPassword) || newPassword.Length < 6)
                    throw new Exception("Password must be at least 6 characters long.");

                if (currentPassword == newPassword)
                    throw new Exception("New password must be different from current password.");

                // Hash new password
                var salt = _passwordHasher.GenerateSalt();
                var passwordHash = _passwordHasher.HashPassword(newPassword, salt);

                // Update password
                return await _authRepository.UpdateUserPasswordAsync(userId, passwordHash, salt, true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Change password failed for user ID: {UserId}", userId);
                throw;
            }
        }

        public async Task<UserWithRolesModel> GetUserProfileAsync(int userId)
        {
            try
            {
                var user = await _authRepository.GetUserWithRolesByIdAsync(userId);
                if (user == null)
                    throw new Exception("User not found.");

                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Get profile failed for user ID: {UserId}", userId);
                throw;
            }
        }

        public async Task<UserWithRolesModel> UpdateUserProfileAsync(int userId, UpdateProfileRequest request)
        {
            try
            {
                var user = await _authRepository.GetUserByIdAsync(userId);
                if (user == null)
                    throw new Exception("User not found.");

                // Update user profile
                user.DisplayName = request.DisplayName ?? user.DisplayName;
                user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
                user.Bio = request.Bio ?? user.Bio;
                user.Country = request.Country ?? user.Country;
                user.ProfileImageUrl = request.ProfileImageUrl ?? user.ProfileImageUrl;

                var updated = await _authRepository.UpdateUserAsync(user);
                if (!updated)
                    throw new Exception("Failed to update profile.");

                return await _authRepository.GetUserWithRolesByIdAsync(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Update profile failed for user ID: {UserId}", userId);
                throw;
            }
        }

        public async Task<List<SocialLoginModel>> GetUserSocialLoginsAsync(int userId)
        {
            try
            {
                return await _authRepository.GetUserSocialLoginsAsync(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Get social logins failed for user ID: {UserId}", userId);
                throw;
            }
        }

        public async Task<bool> RemoveSocialLoginAsync(int userId, string provider)
        {
            try
            {
                // Check if user has other authentication methods
                var user = await _authRepository.GetUserByIdAsync(userId);
                if (user == null)
                    throw new Exception("User not found.");

                var socialLogins = await _authRepository.GetUserSocialLoginsAsync(userId);
                var hasPassword = user.HasSetPassword && !string.IsNullOrEmpty(user.PasswordHash);

                // Prevent removing last authentication method
                if (socialLogins.Count == 1 && !hasPassword)
                    throw new Exception("Cannot remove the only authentication method. Please set a password first.");

                await _authRepository.RemoveSocialLoginAsync(userId, provider);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Remove social login failed for user ID: {UserId}, provider: {Provider}",
                    userId, provider);
                throw;
            }
        }

        private async Task<UserModel> CreateUserFromSocialLogin(SocialLoginRequest request)
        {
            // Generate username from email or provider key
            var username = !string.IsNullOrEmpty(request.Email)
                ? request.Email.Split('@')[0]
                : request.Provider.ToLower() + "_" + request.ProviderKey.Substring(0, Math.Min(8, request.ProviderKey.Length));

            // Make username unique if needed
            var baseUsername = username;
            var counter = 1;
            while (await _authRepository.CheckUsernameExistsAsync(username))
            {
                username = $"{baseUsername}{counter}";
                counter++;
            }

            var user = new UserModel
            {
                Username = username,
                Email = request.Email?.ToLower() ?? $"{username}@social.{request.Provider.ToLower()}",
                DisplayName = request.DisplayName ?? username,
                PasswordHash = null, // Social users don't have password initially
                Salt = null,
                IsActive = true,
                IsEmailVerified = !string.IsNullOrEmpty(request.Email), // Assume email is verified from social provider
                HasSetPassword = false, // User hasn't set password yet
                CreatedAt = DateTime.UtcNow
            };

            var userId = await _authRepository.CreateUserAsync(user);
            user.UserId = userId;

            // Assign default Student role
            await _authRepository.AssignRoleAsync(userId, "Student");

            return user;
        }

        private async Task UpdateSocialLoginInfo(int userId, SocialLoginRequest request)
        {
            var socialLogin = new SocialLoginModel
            {
                UserId = userId,
                Provider = request.Provider,
                ProviderKey = request.ProviderKey,
                Email = request.Email,
                DisplayName = request.DisplayName,
                ProfileUrl = request.ProfileUrl,
                ImageUrl = request.ImageUrl,
                AccessToken = request.AccessToken,
                RefreshToken = request.RefreshToken,
                TokenExpiry = request.TokenExpiry,
                LastLoginAt = DateTime.UtcNow
            };

            await _authRepository.LinkSocialAccountAsync(socialLogin);
        }

        private async Task LinkSocialToExistingUser(int userId, SocialLoginRequest request)
        {
            var socialLogin = new SocialLoginModel
            {
                UserId = userId,
                Provider = request.Provider,
                ProviderKey = request.ProviderKey,
                Email = request.Email,
                DisplayName = request.DisplayName,
                ProfileUrl = request.ProfileUrl,
                ImageUrl = request.ImageUrl,
                AccessToken = request.AccessToken,
                RefreshToken = request.RefreshToken,
                TokenExpiry = request.TokenExpiry,
                LastLoginAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            await _authRepository.LinkSocialAccountAsync(socialLogin);
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}
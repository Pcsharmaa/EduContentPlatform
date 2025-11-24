using EduContentPlatform.Models.Users;
using EduContentPlatform.Repository.Auth;
using EduContentPlatform.Services.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IUserTypeRepository _userTypeRepository;
        private readonly IJwtService _jwtService;
        private readonly IPasswordHasher _passwordHasher;

        public AuthService(IAuthRepository authRepository, IUserTypeRepository userTypeRepository, IJwtService jwtService, IPasswordHasher passwordHasher)
        {
            _authRepository = authRepository;
            _userTypeRepository = userTypeRepository;
            _jwtService = jwtService;
            _passwordHasher = passwordHasher;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            // Check if email already exists
            if (await _authRepository.CheckEmailExistsAsync(request.Email))
                throw new Exception("Email already exists");

            // Validate UserType exists
            var userType = await _userTypeRepository.GetUserTypeByIdAsync(request.UserTypeId);
            if (userType == null || !userType.IsActive)
                throw new Exception("Invalid user type");

            // Hash password
            var salt = _passwordHasher.GenerateSalt();
            var passwordHash = _passwordHasher.HashPassword(request.Password, salt);

            // Create user
            var user = new UserModel
            {
                Email = request.Email,
                DisplayName = request.DisplayName,
                UserTypeId = request.UserTypeId,
                UserTypeName = userType.Name,
                PasswordHash = passwordHash,
                Salt = salt,
                IsActive = true,
                HasSetPassword = true,
                CreatedAt = DateTime.UtcNow
            };

            var userId = await _authRepository.CreateUserAsync(user);
            user.UserId = userId;

            // Generate token
            var token = _jwtService.GenerateToken(user);

            return new AuthResponse
            {
                Token = token,
                User = user,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                HasSetPassword = true,
                Message = "Registration successful"
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _authRepository.GetUserByEmailAsync(request.Email);
            if (user == null || !user.IsActive)
                throw new Exception("Invalid credentials");

            // Check if user has set password (social users)
            if (!user.HasSetPassword || string.IsNullOrEmpty(user.PasswordHash))
                throw new Exception("Please use social login or setup your password using 'Forgot Password'");

            // Verify password
            if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash, user.Salt))
                throw new Exception("Invalid credentials");

            // Update last login
            await _authRepository.UpdateLastLoginAsync(user.UserId);

            var token = _jwtService.GenerateToken(user);

            return new AuthResponse
            {
                Token = token,
                User = user,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                HasSetPassword = user.HasSetPassword,
                Message = "Login successful"
            };
        }

        public async Task<bool> ForgotPasswordAsync(string email)
        {
            var user = await _authRepository.GetUserByEmailAsync(email);
            if (user == null) return true; // Don't reveal if email exists

            // Generate reset token
            var resetToken = GenerateResetToken();
            await _authRepository.SaveResetTokenAsync(user.UserId, resetToken);

            // In real application, send email here
            Console.WriteLine($"Password reset token for {email}: {resetToken}");

            return true;
        }

        public async Task<bool> ResetPasswordAsync(string token, string newPassword)
        {
            var user = await _authRepository.GetUserByResetTokenAsync(token);
            if (user == null)
                throw new Exception("Invalid or expired reset token");

            // Hash new password
            var salt = _passwordHasher.GenerateSalt();
            var passwordHash = _passwordHasher.HashPassword(newPassword, salt);

            // Update password
            var updated = await _authRepository.UpdateUserPasswordAsync(user.UserId, passwordHash, salt, true);
            if (updated)
            {
                await _authRepository.ClearResetTokenAsync(user.UserId);
            }

            return updated;
        }

        private string GenerateResetToken()
        {
            return Guid.NewGuid().ToString() + "-" + DateTime.UtcNow.Ticks;
        }
        public Task<UserModel> GetUserProfileAsync(int userId)
        {
            return _authRepository.GetUserProfileAsync(userId);
        }


    }
}

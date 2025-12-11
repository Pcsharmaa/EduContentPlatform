using System;

namespace EduContentPlatform.Models.Users
{
    public class UserModel
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string PasswordHash { get; set; }
        public string Salt { get; set; }
        public string PhoneNumber { get; set; }
        public string ProfileImageUrl { get; set; }
        public string Bio { get; set; }
        public string Country { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsEmailVerified { get; set; }
        public bool HasSetPassword { get; set; } = true;
        public string ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    public class RoleModel
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class UserWithRolesModel : UserModel
    {
        public List<string> Roles { get; set; } = new List<string>();
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string PhoneNumber { get; set; }
        public string Country { get; set; }
    }

    public class AuthResponse
    {
        public string Token { get; set; }
        public UserWithRolesModel User { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool HasSetPassword { get; set; }
        public string Message { get; set; }
    }

    public class SocialLoginRequest
    {
        public string Provider { get; set; }
        public string ProviderKey { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string ProfileUrl { get; set; }
        public string ImageUrl { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public DateTime? TokenExpiry { get; set; }
    }

    public class SocialLoginModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Provider { get; set; }
        public string ProviderKey { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string ProfileUrl { get; set; }
        public string ImageUrl { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public DateTime? TokenExpiry { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ForgotPasswordRequest
    {
        public string Email { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }

    public class UpdateProfileRequest
    {
        public string DisplayName { get; set; }
        public string PhoneNumber { get; set; }
        public string Bio { get; set; }
        public string Country { get; set; }
        public string ProfileImageUrl { get; set; }
    }
}
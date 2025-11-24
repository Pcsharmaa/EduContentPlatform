using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Models.Users
{
    public class UserModel
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public int UserTypeId { get; set; }
        public string UserTypeName { get; set; }
        public string PasswordHash { get; set; }
        public string Salt { get; set; }
        public bool IsActive { get; set; } = true;
        public bool HasSetPassword { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }
    }

    public class UserTypeModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int PermissionsLevel { get; set; }
        public bool IsActive { get; set; } = true;
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
        public int UserTypeId { get; set; }
    }

    public class AuthResponse
    {
        public string Token { get; set; }
        public UserModel User { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool HasSetPassword { get; set; }
        public string Message { get; set; }
    }

    public class SocialLoginRequest
    {
        public string Provider { get; set; }
        public string AccessToken { get; set; }
        public string IdToken { get; set; }
        public string RequestedRole { get; set; }
    }

    public class SocialUserInfo
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PictureUrl { get; set; }
        public string Provider { get; set; }
        public bool EmailVerified { get; set; }
    }
}

using EduContentPlatform.Models.Users;
using System.Security.Claims;

namespace EduContentPlatform.Services.Utilities
{
    public interface IJwtService
    {
        string GenerateToken(UserWithRolesModel user);
        bool ValidateToken(string token, out UserWithRolesModel user);
        string GenerateTokenFromClaims(ClaimsPrincipal claimsPrincipal);
        ClaimsPrincipal GetPrincipalFromToken(string token);
    }
}
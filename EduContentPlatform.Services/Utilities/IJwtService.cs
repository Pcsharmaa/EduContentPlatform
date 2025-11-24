using EduContentPlatform.Models.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Services.Utilities
{
    public interface IJwtService
    {
        string GenerateToken(UserModel user);
        ClaimsPrincipal ValidateToken(string token);
    }
}

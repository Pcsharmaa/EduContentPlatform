using EduContentPlatform.Models.Users;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EduContentPlatform.Services.Utilities
{
    public class JwtService : IJwtService
    {
        private readonly string _secretKey;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly int _expiryInDays;

        public JwtService(IConfiguration configuration)
        {
            _secretKey = configuration["Jwt:SecretKey"] ??
                throw new ArgumentNullException("Jwt:SecretKey is not configured");
            _issuer = configuration["Jwt:Issuer"] ?? "EduContentPlatform";
            _audience = configuration["Jwt:Audience"] ?? "EduContentUsers";
            _expiryInDays = int.TryParse(configuration["Jwt:ExpiryInDays"], out var days) ? days : 7;
        }

        public string GenerateToken(UserWithRolesModel user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            if (string.IsNullOrEmpty(user.Email))
                throw new ArgumentException("User email is required");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_secretKey);

            if (key.Length < 32) // Minimum 256 bits
                throw new ArgumentException("JWT secret key must be at least 32 characters long");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),
                new Claim("username", user.Username ?? user.Email),
                new Claim("display_name", user.DisplayName ?? user.Username ?? user.Email)
            };

            // Add display name if available
            if (!string.IsNullOrEmpty(user.DisplayName))
            {
                claims.Add(new Claim(ClaimTypes.Name, user.DisplayName));
            }

            // Add username if available
            if (!string.IsNullOrEmpty(user.Username))
            {
                claims.Add(new Claim("username", user.Username));
            }

            // Add all roles as individual claims
            if (user.Roles != null && user.Roles.Count > 0)
            {
                foreach (var role in user.Roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                // Add roles as a comma-separated string for convenience
                claims.Add(new Claim("roles", string.Join(",", user.Roles)));
            }
            else
            {
                // Default role if none assigned
                claims.Add(new Claim(ClaimTypes.Role, "Student"));
                claims.Add(new Claim("roles", "Student"));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(_expiryInDays),
                Issuer = _issuer,
                Audience = _audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public bool ValidateToken(string token, out UserWithRolesModel user)
        {
            user = null;

            if (string.IsNullOrEmpty(token))
                return false;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_secretKey);

            try
            {
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _issuer,
                    ValidateAudience = true,
                    ValidAudience = _audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

                // Extract user information from claims
                var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);
                var emailClaim = principal.FindFirst(ClaimTypes.Email);
                var nameClaim = principal.FindFirst(ClaimTypes.Name);
                var usernameClaim = principal.FindFirst("username");
                var roles = principal.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

                if (userIdClaim == null || emailClaim == null)
                    return false;

                user = new UserWithRolesModel
                {
                    UserId = int.Parse(userIdClaim.Value),
                    Email = emailClaim.Value,
                    Username = usernameClaim?.Value,
                    DisplayName = nameClaim?.Value,
                    Roles = roles
                };

                return true;
            }
            catch (SecurityTokenException)
            {
                // Token validation failed
                return false;
            }
            catch (Exception)
            {
                // Other exceptions
                return false;
            }
        }

        public string GenerateTokenFromClaims(ClaimsPrincipal claimsPrincipal)
        {
            if (claimsPrincipal == null)
                throw new ArgumentNullException(nameof(claimsPrincipal));

            var userId = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = claimsPrincipal.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(email))
                throw new ArgumentException("Invalid claims principal");

            var user = new UserWithRolesModel
            {
                UserId = int.Parse(userId),
                Email = email,
                Username = claimsPrincipal.FindFirst("username")?.Value,
                DisplayName = claimsPrincipal.FindFirst(ClaimTypes.Name)?.Value,
                Roles = claimsPrincipal.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList()
            };

            return GenerateToken(user);
        }

        public ClaimsPrincipal GetPrincipalFromToken(string token)
        {
            if (string.IsNullOrEmpty(token))
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_secretKey);

            try
            {
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _issuer,
                    ValidateAudience = true,
                    ValidAudience = _audience,
                    ValidateLifetime = false, // We don't validate lifetime here
                    ClockSkew = TimeSpan.Zero
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
                return principal;
            }
            catch
            {
                return null;
            }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Services.Utilities
{
    public class PasswordHasher : IPasswordHasher
    {
        public string GenerateSalt()
        {
            var saltBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            return Convert.ToBase64String(saltBytes);
        }

        public string HashPassword(string password, string salt)
        {
            var saltBytes = Convert.FromBase64String(salt);
            using (var deriveBytes = new Rfc2898DeriveBytes(password, saltBytes, 10000, HashAlgorithmName.SHA256))
            {
                var hashBytes = deriveBytes.GetBytes(32);
                return Convert.ToBase64String(hashBytes);
            }
        }

        public bool VerifyPassword(string password, string passwordHash, string salt)
        {
            if (string.IsNullOrEmpty(passwordHash) || string.IsNullOrEmpty(salt))
                return false;

            var computedHash = HashPassword(password, salt);
            return computedHash == passwordHash;
        }
    }
}

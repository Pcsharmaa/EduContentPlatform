namespace EduContentPlatform.Services.Utilities
{
    public interface IPasswordHasher
    {
        string HashPassword(string password, string salt);
        bool VerifyPassword(string password, string hash, string salt);
        string GenerateSalt();
        (string Hash, string Salt) CreateHash(string password);
    }
}
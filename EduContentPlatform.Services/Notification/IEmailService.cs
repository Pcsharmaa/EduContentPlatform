using System.Threading.Tasks;

namespace EduContentPlatform.Services.Utilities
{
    public interface IEmailService
    {
        Task SendWelcomeEmailAsync(string email, string displayName);
        Task SendPasswordResetEmailAsync(string email, string displayName, string resetToken);
        Task SendPasswordResetConfirmationAsync(string email, string displayName);
        Task SendEmailVerificationAsync(string email, string displayName, string verificationToken);
    }
}
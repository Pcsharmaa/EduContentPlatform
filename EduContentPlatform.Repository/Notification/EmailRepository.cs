//using Microsoft.Extensions.Configuration;
//using Microsoft.Extensions.Logging;
//using System;
//using System.Net.Mail;
//using System.Threading.Tasks;

//namespace EduContentPlatform.Services.Utilities
//{
//    public class EmailService : IEmailService
//    {
//        private readonly IConfiguration _configuration;
//        private readonly ILogger<EmailService> _logger;
//        private readonly string _smtpServer;
//        private readonly int _smtpPort;
//        private readonly string _smtpUsername;
//        private readonly string _smtpPassword;
//        private readonly string _fromEmail;
//        private readonly string _fromName;
//        private readonly bool _isEnabled;

//        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
//        {
//            _configuration = configuration;
//            _logger = logger;

//            _smtpServer = _configuration["Email:SmtpServer"];
//            _smtpPort = int.TryParse(_configuration["Email:SmtpPort"], out var port) ? port : 587;
//            _smtpUsername = _configuration["Email:SmtpUsername"];
//            _smtpPassword = _configuration["Email:SmtpPassword"];
//            _fromEmail = _configuration["Email:FromEmail"] ?? "noreply@educontentplatform.com";
//            _fromName = _configuration["Email:FromName"] ?? "EduContent Platform";
//            _isEnabled = bool.TryParse(_configuration["Email:IsEnabled"], out var enabled) ? enabled : false;
//        }

//        public async Task SendWelcomeEmailAsync(string email, string displayName)
//        {
//            if (!_isEnabled)
//            {
//                _logger.LogInformation("Email service is disabled. Welcome email would be sent to: {Email}", email);
//                return;
//            }

//            try
//            {
//                var subject = "Welcome to EduContent Platform!";
//                var body = $@"
//<!DOCTYPE html>
//<html>
//<head>
//    <style>
//        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
//        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
//        .header {{ background-color: #4a6baf; color: white; padding: 20px; text-align: center; }}
//        .content {{ padding: 30px; background-color: #f9f9f9; }}
//        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
//    </style>
//</head>
//<body>
//    <div class='container'>
//        <div class='header'>
//            <h1>Welcome to EduContent Platform!</h1>
//        </div>
//        <div class='content'>
//            <p>Dear {displayName},</p>
//            <p>Thank you for joining EduContent Platform! We're excited to have you on board.</p>
//            <p>With your account, you can:</p>
//            <ul>
//                <li>Access thousands of educational resources</li>
//                <li>Enroll in online courses</li>
//                <li>Connect with educators and learners</li>
//                <li>Track your learning progress</li>
//            </ul>
//            <p>If you have any questions, feel free to contact our support team.</p>
//            <p>Happy learning!</p>
//            <p>The EduContent Team</p>
//        </div>
//        <div class='footer'>
//            <p>&copy; {DateTime.Now.Year} EduContent Platform. All rights reserved.</p>
//        </div>
//    </div>
//</body>
//</html>";

//                await SendEmailAsync(email, subject, body);
//                _logger.LogInformation("Welcome email sent to: {Email}", email);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Failed to send welcome email to: {Email}", email);
//                throw;
//            }
//        }

//        public async Task SendPasswordResetEmailAsync(string email, string displayName, string resetToken)
//        {
//            if (!_isEnabled)
//            {
//                _logger.LogInformation("Email service is disabled. Reset email would be sent to: {Email}", email);
//                _logger.LogInformation("Reset token: {Token}", resetToken);
//                return;
//            }

//            try
//            {
//                var resetLink = $"{_configuration["App:BaseUrl"]}/reset-password?token={resetToken}";

//                var subject = "Password Reset Request - EduContent Platform";
//                var body = $@"
//<!DOCTYPE html>
//<html>
//<head>
//    <style>
//        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
//        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
//        .header {{ background-color: #dc3545; color: white; padding: 20px; text-align: center; }}
//        .content {{ padding: 30px; background-color: #f9f9f9; }}
//        .button {{ display: inline-block; padding: 12px 24px; background-color: #4a6baf; color: white; 
//                  text-decoration: none; border-radius: 4px; margin: 20px 0; }}
//        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
//        .token {{ background-color: #f8f9fa; padding: 10px; border-left: 4px solid #4a6baf; 
//                  font-family: monospace; word-break: break-all; }}
//    </style>
//</head>
//<body>
//    <div class='container'>
//        <div class='header'>
//            <h1>Password Reset Request</h1>
//        </div>
//        <div class='content'>
//            <p>Dear {displayName},</p>
//            <p>We received a request to reset your password for your EduContent Platform account.</p>
//            <p>Click the button below to reset your password:</p>
//            <p><a href='{resetLink}' class='button'>Reset Password</a></p>
//            <p>Or copy and paste this link in your browser:</p>
//            <p class='token'>{resetLink}</p>
//            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
//            <p>This reset link will expire in 24 hours.</p>
//            <p>Best regards,<br>The EduContent Team</p>
//        </div>
//        <div class='footer'>
//            <p>&copy; {DateTime.Now.Year} EduContent Platform. All rights reserved.</p>
//            <p>This is an automated message, please do not reply to this email.</p>
//        </div>
//    </div>
//</body>
//</html>";

//                await SendEmailAsync(email, subject, body);
//                _logger.LogInformation("Password reset email sent to: {Email}", email);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Failed to send password reset email to: {Email}", email);
//                throw;
//            }
//        }

//        public async Task SendPasswordResetConfirmationAsync(string email, string displayName)
//        {
//            if (!_isEnabled)
//            {
//                _logger.LogInformation("Email service is disabled. Reset confirmation email would be sent to: {Email}", email);
//                return;
//            }

//            try
//            {
//                var subject = "Password Reset Successful - EduContent Platform";
//                var body = $@"
//<!DOCTYPE html>
//<html>
//<head>
//    <style>
//        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
//        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
//        .header {{ background-color: #28a745; color: white; padding: 20px; text-align: center; }}
//        .content {{ padding: 30px; background-color: #f9f9f9; }}
//        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
//    </style>
//</head>
//<body>
//    <div class='container'>
//        <div class='header'>
//            <h1>Password Reset Successful</h1>
//        </div>
//        <div class='content'>
//            <p>Dear {displayName},</p>
//            <p>Your EduContent Platform password has been successfully reset.</p>
//            <p>If you did not initiate this password reset, please contact our support team immediately.</p>
//            <p>For security reasons:</p>
//            <ul>
//                <li>Use a strong, unique password</li>
//                <li>Enable two-factor authentication if available</li>
//                <li>Avoid using the same password across multiple sites</li>
//            </ul>
//            <p>Thank you for helping us keep your account secure.</p>
//            <p>Best regards,<br>The EduContent Team</p>
//        </div>
//        <div class='footer'>
//            <p>&copy; {DateTime.Now.Year} EduContent Platform. All rights reserved.</p>
//            <p>This is an automated message, please do not reply to this email.</p>
//        </div>
//    </div>
//</body>
//</html>";

//                await SendEmailAsync(email, subject, body);
//                _logger.LogInformation("Password reset confirmation email sent to: {Email}", email);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Failed to send password reset confirmation email to: {Email}", email);
//                throw;
//            }
//        }

//        private async Task SendEmailAsync(string toEmail, string subject, string body)
//        {
//            using var client = new SmtpClient(_smtpServer, _smtpPort)
//            {
//                EnableSsl = _smtpPort == 587 || _smtpPort == 465,
//                Credentials = !string.IsNullOrEmpty(_smtpUsername) ?
//                    new System.Net.NetworkCredential(_smtpUsername, _smtpPassword) : null,
//                Timeout = 10000
//            };

//            var mailMessage = new MailMessage
//            {
//                From = new MailAddress(_fromEmail, _fromName),
//                Subject = subject,
//                Body = body,
//                IsBodyHtml = true
//            };

//            mailMessage.To.Add(toEmail);

//            await client.SendMailAsync(mailMessage);
//        }

//        public async Task SendEmailVerificationAsync(string email, string displayName, string verificationToken)
//        {
//            if (!_isEnabled)
//            {
//                _logger.LogInformation("Email service is disabled. Verification email would be sent to: {Email}", email);
//                return;
//            }

//            try
//            {
//                var verificationLink = $"{_configuration["App:BaseUrl"]}/verify-email?token={verificationToken}";

//                var subject = "Verify Your Email - EduContent Platform";
//                var body = $@"
//<!DOCTYPE html>
//<html>
//<head>
//    <style>
//        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
//        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
//        .header {{ background-color: #4a6baf; color: white; padding: 20px; text-align: center; }}
//        .content {{ padding: 30px; background-color: #f9f9f9; }}
//        .button {{ display: inline-block; padding: 12px 24px; background-color: #4a6baf; color: white; 
//                  text-decoration: none; border-radius: 4px; margin: 20px 0; }}
//        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
//    </style>
//</head>
//<body>
//    <div class='container'>
//        <div class='header'>
//            <h1>Verify Your Email Address</h1>
//        </div>
//        <div class='content'>
//            <p>Dear {displayName},</p>
//            <p>Thank you for signing up for EduContent Platform!</p>
//            <p>Please verify your email address by clicking the button below:</p>
//            <p><a href='{verificationLink}' class='button'>Verify Email</a></p>
//            <p>Or copy and paste this link in your browser:</p>
//            <p>{verificationLink}</p>
//            <p>This link will expire in 24 hours.</p>
//            <p>If you didn't create an account with us, please ignore this email.</p>
//            <p>Best regards,<br>The EduContent Team</p>
//        </div>
//        <div class='footer'>
//            <p>&copy; {DateTime.Now.Year} EduContent Platform. All rights reserved.</p>
//        </div>
//    </div>
//</body>
//</html>";

//                await SendEmailAsync(email, subject, body);
//                _logger.LogInformation("Email verification sent to: {Email}", email);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Failed to send email verification to: {Email}", email);
//                throw;
//            }
//        }
//    }
//}
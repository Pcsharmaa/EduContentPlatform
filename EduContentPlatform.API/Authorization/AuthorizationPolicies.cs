using Microsoft.AspNetCore.Authorization;

namespace EduContentPlatform.API.Authorization
{
    public static class AuthorizationPolicies
    {
        public static void ConfigurePolicies(AuthorizationOptions options)
        {
            options.AddPolicy("Student", policy =>
                policy.RequireRole("Student", "Teacher", "Publisher", "Editor", "Reviewer", "Admin"));

            options.AddPolicy("Teacher", policy =>
                policy.RequireRole("Teacher", "Publisher", "Editor", "Reviewer", "Admin"));

            options.AddPolicy("Publisher", policy =>
                policy.RequireRole("Publisher", "Editor", "Reviewer", "Admin"));

            options.AddPolicy("Editor", policy =>
                policy.RequireRole("Editor", "Reviewer", "Admin"));

            options.AddPolicy("Reviewer", policy =>
                policy.RequireRole("Reviewer", "Admin"));

            options.AddPolicy("Admin", policy =>
                policy.RequireRole("Admin"));

            options.AddPolicy("ContentCreator", policy =>
                policy.RequireRole("Teacher", "Publisher", "Editor", "Reviewer", "Admin"));
        }
    }
}

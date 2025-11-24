using Microsoft.AspNetCore.Authorization;

namespace EduContentPlatform.API.Authorization
{
    public class AuthorizeUserTypeAttribute : AuthorizeAttribute
    {
        public AuthorizeUserTypeAttribute(params string[] userTypes)
        {
            Roles = string.Join(",", userTypes);
        }
    }

    public class AuthorizeStudentAttribute : AuthorizeUserTypeAttribute
    {
        public AuthorizeStudentAttribute() : base("Student") { }
    }

    public class AuthorizeTeacherAttribute : AuthorizeUserTypeAttribute
    {
        public AuthorizeTeacherAttribute() : base("Teacher") { }
    }

    public class AuthorizePublisherAttribute : AuthorizeUserTypeAttribute
    {
        public AuthorizePublisherAttribute() : base("Publisher") { }
    }

    public class AuthorizeEditorAttribute : AuthorizeUserTypeAttribute
    {
        public AuthorizeEditorAttribute() : base("Editor") { }
    }

    public class AuthorizeReviewerAttribute : AuthorizeUserTypeAttribute
    {
        public AuthorizeReviewerAttribute() : base("Reviewer") { }
    }

    public class AuthorizeAdminAttribute : AuthorizeUserTypeAttribute
    {
        public AuthorizeAdminAttribute() : base("Admin") { }
    }

    public class AuthorizeContentCreatorAttribute : AuthorizeUserTypeAttribute
    {
        public AuthorizeContentCreatorAttribute()
            : base("Teacher", "Publisher", "Editor", "Reviewer", "Admin") { }
    }
}

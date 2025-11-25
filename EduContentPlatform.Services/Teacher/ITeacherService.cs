using EduContentPlatform.Models.Teacher;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Services.Teacher
{
    public interface ITeacherService
    {
        Task<int> CreateCourseAsync(int teacherId, string courseName, string description);
        Task<int> CreateChapterAsync(int courseId, string chapterName, int sortOrder);
        Task<int> UploadFileAsync(int teacherId, TeacherUploadRequest req);
        Task<IEnumerable<dynamic>> GetFilesByChapterAsync(int chapterId);
    }
}

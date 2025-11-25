using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Repository.Teacher
{
    public interface ITeacherRepository
    {
        Task<int> CreateCourseAsync(int teacherId, string courseName, string description);
        Task<int> CreateChapterAsync(int courseId, string chapterName, int sortOrder);
        Task<int> SaveTeacherFileAsync(int teacherId, int courseId, int chapterId, string fileType, string fileName, string fileUrl, int? durationSeconds, long? fileSize);
        Task<IEnumerable<dynamic>> GetFilesByChapterAsync(int chapterId);
    }
}

using Dapper;
using EduContentPlatform.Repository.Database;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Repository.Teacher
{
    public class TeacherRepository : ITeacherRepository
    {
        private readonly ISqlConnectionFactory _factory;
        public TeacherRepository(ISqlConnectionFactory factory) => _factory = factory;

        public async Task<int> CreateCourseAsync(int teacherId, string courseName, string description)
        {
            using var conn = _factory.CreateConnection();
            return await conn.ExecuteScalarAsync<int>("sp_CreateCourse", new { TeacherId = teacherId, CourseName = courseName, Description = description }, commandType: CommandType.StoredProcedure);
        }

        public async Task<int> CreateChapterAsync(int courseId, string chapterName, int sortOrder)
        {
            using var conn = _factory.CreateConnection();
            return await conn.ExecuteScalarAsync<int>("sp_CreateChapter", new { CourseId = courseId, ChapterName = chapterName, SortOrder = sortOrder }, commandType: CommandType.StoredProcedure);
        }

        public async Task<int> SaveTeacherFileAsync(int teacherId, int courseId, int chapterId, string fileType, string fileName, string fileUrl, int? durationSeconds, long? fileSize)
        {
            using var conn = _factory.CreateConnection();
            return await conn.ExecuteScalarAsync<int>("sp_Teacher_UploadFile",
                new { TeacherId = teacherId, CourseId = courseId, ChapterId = chapterId, FileType = fileType, FileName = fileName, FileUrl = fileUrl, DurationSeconds = durationSeconds, FileSize = fileSize },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<dynamic>> GetFilesByChapterAsync(int chapterId)
        {
            using var conn = _factory.CreateConnection();
            return await conn.QueryAsync("SELECT * FROM TeacherFiles WHERE ChapterId = @ChapterId ORDER BY UploadedAt DESC", new { ChapterId = chapterId });
        }
    }
}

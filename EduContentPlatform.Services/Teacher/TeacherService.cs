using EduContentPlatform.Models.Teacher;
using EduContentPlatform.Repository.Teacher;
using EduContentPlatform.Services.FileStorage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Services.Teacher
{
    public class TeacherService : ITeacherService
    {
        private readonly ITeacherRepository _repo;
        private readonly IFileStorageService _storage;
        public TeacherService(ITeacherRepository repo, IFileStorageService storage)
        {
            _repo = repo;
            _storage = storage;
        }

        public Task<int> CreateCourseAsync(int teacherId, string courseName, string description) => _repo.CreateCourseAsync(teacherId, courseName, description);
        public Task<int> CreateChapterAsync(int courseId, string chapterName, int sortOrder) => _repo.CreateChapterAsync(courseId, chapterName, sortOrder);

        public async Task<int> UploadFileAsync(int teacherId, TeacherUploadRequest req)
        {
            var folder = _storage.EnsureTeacherChapterFolder(teacherId, req.CourseId, req.ChapterId);
            var (fullPath, relUrl) = await _storage.SaveFormFileAsync(req.File, folder);

            // optional: detect duration or file size
            int? duration = null;
            long? size = null;
            try
            {
                var fi = new FileInfo(fullPath);
                size = fi.Length;
                // for video duration you can integrate FFmpeg in future
            }
            catch { }

            return await _repo.SaveTeacherFileAsync(teacherId, req.CourseId, req.ChapterId, req.FileType, Path.GetFileName(fullPath), relUrl, duration, size);
        }

        public Task<IEnumerable<dynamic>> GetFilesByChapterAsync(int chapterId) => _repo.GetFilesByChapterAsync(chapterId);
    }
}

using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Services.FileStorage
{
    public interface IFileStorageService
    {
        string EnsureTeacherChapterFolder(int teacherId, int courseId, int chapterId);
        string EnsurePublicationFolder(int publicationId, int? volumeId = null);
        Task<(string fullPath, string relativeUrl)> SaveFormFileAsync(IFormFile file, string folderPath);
    }
}

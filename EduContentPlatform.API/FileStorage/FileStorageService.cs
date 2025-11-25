using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Services.FileStorage
{
    public class FileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _env;
        private readonly string _root;

        public FileStorageService(IWebHostEnvironment env)
        {
            _env = env;
            _root = Path.Combine(_env.WebRootPath ?? "wwwroot", "ContentFiles");
            Directory.CreateDirectory(_root);
        }

        public string EnsureTeacherChapterFolder(int teacherId, int courseId, int chapterId)
        {
            var folder = Path.Combine(_root, "TeacherContent", $"teacher_{teacherId}", $"course_{courseId}", $"chapter_{chapterId}");
            Directory.CreateDirectory(folder);
            Directory.CreateDirectory(Path.Combine(folder, "videos"));
            Directory.CreateDirectory(Path.Combine(folder, "documents"));
            return folder;
        }

        public string EnsurePublicationFolder(int publicationId, int? volumeId = null)
        {
            var pubFolder = Path.Combine(_root, "PublicationContent", $"publication_{publicationId}");
            Directory.CreateDirectory(pubFolder);
            var volumes = Path.Combine(pubFolder, "volumes");
            Directory.CreateDirectory(volumes);
            if (volumeId.HasValue && volumeId.Value > 0)
            {
                var vol = Path.Combine(volumes, $"volume_{volumeId.Value}");
                Directory.CreateDirectory(vol);
                return vol;
            }
            return pubFolder;
        }

        public async Task<(string fullPath, string relativeUrl)> SaveFormFileAsync(IFormFile file, string folderPath)
        {
            var sanitized = Path.GetFileName(file.FileName);
            var guid = Guid.NewGuid().ToString();
            var finalName = $"{guid}_{sanitized}";
            var fullPath = Path.Combine(folderPath, finalName);

            using (var fs = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(fs);
            }

            var relative = fullPath.Replace(_env.WebRootPath ?? "wwwroot", "").Replace("\\", "/").TrimStart('/');
            return (fullPath, "/" + relative);
        }
    }
}

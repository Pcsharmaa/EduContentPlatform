using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Models.Teacher
{
    public class TeacherUploadRequest
    {
        public int CourseId { get; set; }
        public int ChapterId { get; set; }
        public string FileType { get; set; } // video | pdf | ppt | doc | image
        public string Title { get; set; }
        public string Description { get; set; }
        public IFormFile File { get; set; }
    }
}

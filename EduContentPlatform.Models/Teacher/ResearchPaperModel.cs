using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Models.Teacher
{
    public class ResearchPaperModel
    {
        public int PaperId { get; set; }
        public int? PublicationId { get; set; }   // optional link to publication
        public int CreatedBy { get; set; }        // uploader user id
        public string Title { get; set; }
        public string Abstract { get; set; }
        public string FileUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

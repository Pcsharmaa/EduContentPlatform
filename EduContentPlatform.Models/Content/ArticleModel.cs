using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Models.Content
{
    public class ArticleModel
    {
        public int ArticleId { get; set; }
        public int? PublicationId { get; set; }
        public int? VolumeId { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public string FileUrl { get; set; }
        public bool IsPaid { get; set; }
        public decimal Price { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}

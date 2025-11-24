using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Models.Content
{
    namespace EduContentPlatform.Models.Publications
    {
        public class ArticleModel
        {
            public int ArticleId { get; set; }

            public string Title { get; set; }
            public string Body { get; set; }
            public string FileUrl { get; set; }

            public int CreatedBy { get; set; }
            public DateTime CreatedAt { get; set; }

            public string Status { get; set; }

            public bool IsPaid { get; set; }
            public decimal? Price { get; set; }
        }
    }

}

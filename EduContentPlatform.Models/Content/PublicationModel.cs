using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Models.Content
{
    namespace EduContentPlatform.Models.Publications
    {
        public class PublicationModel
        {
            public int PublicationId { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string CoverImageUrl { get; set; }
            public int CreatedBy { get; set; }
            public DateTime CreatedAt { get; set; }

            public string Status { get; set; }        // Submitted / Editing / UnderReview / Approved / Published / Rejected
            public bool IsPaid { get; set; }
            public decimal? Price { get; set; }
            public string Category { get; set; }

            // Optional nested list (volumes)
            public List<PublicationVolumeModel> Volumes { get; set; }
        }
    }

}

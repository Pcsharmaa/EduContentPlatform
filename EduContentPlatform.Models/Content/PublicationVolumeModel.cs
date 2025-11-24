using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Models.Content
{
    namespace EduContentPlatform.Models.Publications
    {
        public class PublicationVolumeModel
        {
            public int VolumeId { get; set; }
            public int PublicationId { get; set; }

            public int? VolumeNumber { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }

            public string FileUrl { get; set; }
            public string HlsMasterPlaylistUrl { get; set; }

            public decimal? Price { get; set; }
            public bool IsPaid { get; set; }

            public string Status { get; set; }
            public int CreatedBy { get; set; }
            public DateTime CreatedAt { get; set; }
        }
    }

}

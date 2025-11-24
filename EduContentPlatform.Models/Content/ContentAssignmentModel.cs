using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Models.Content
{
    namespace EduContentPlatform.Models.Publications
    {
        public class ContentAssignmentModel
        {
            public int Id { get; set; }
            public string ItemType { get; set; }
            public int ItemId { get; set; }

            public int AssignedTo { get; set; }
            public DateTime AssignedAt { get; set; }
        }
    }

}

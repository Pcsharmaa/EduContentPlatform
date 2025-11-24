using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Models.Content
{
    namespace EduContentPlatform.Models.Publications
    {
        public class UserContentAccessModel
        {
            public int Id { get; set; }
            public int UserId { get; set; }

            public string ItemType { get; set; }   // Publication / Volume / Article
            public int ItemId { get; set; }

            public string AccessType { get; set; }  // Free / Purchased / Granted
            public DateTime GrantedAt { get; set; }
        }
    }

}

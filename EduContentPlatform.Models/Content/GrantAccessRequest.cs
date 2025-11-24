using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Models.Content
{
    public class GrantAccessRequest
    {
        public int UserId { get; set; }
        public string ItemType { get; set; }
        public int ItemId { get; set; }
        public string AccessType { get; set; }
    }
}

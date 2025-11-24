using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Models.Content
{
    public class PublishingHistoryModel
    {
        public int Id { get; set; }
        public string ItemType { get; set; }    // Publication / Volume / Article
        public int ItemId { get; set; }
        public string Action { get; set; }
        public int? PerformedBy { get; set; }
        public DateTime PerformedAt { get; set; }
        public string Comments { get; set; }
    }
}

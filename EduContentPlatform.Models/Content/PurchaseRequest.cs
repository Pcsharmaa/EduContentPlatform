using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Models.Content
{
    public class PurchaseRequest
    {
        public string ItemType { get; set; }
        public int ItemId { get; set; }
        public decimal Amount { get; set; }
    }
}

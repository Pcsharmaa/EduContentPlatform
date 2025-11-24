using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Repository.Content
{
    public interface IPurchaseRepository
    {
        Task<int> CreatePurchaseAsync(int userId, string itemType, int itemId, decimal amount);
        Task<bool> HasAccessAsync(int userId, string itemType, int itemId);
        Task GrantAccessAsync(int userId, string itemType, int itemId, string accessType);
    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Repository.Content
{
    public class PurchaseService : IPurchaseService
    {
        private readonly IPurchaseRepository _repo;
        public PurchaseService(IPurchaseRepository repo) => _repo = repo;

        public Task<int> PurchaseAsync(int userId, string itemType, int itemId, decimal amount) => _repo.CreatePurchaseAsync(userId, itemType, itemId, amount);
        public Task<bool> HasAccessAsync(int userId, string itemType, int itemId) => _repo.HasAccessAsync(userId, itemType, itemId);
        public Task GrantAccessAsync(int userId, string itemType, int itemId, string accessType = "Granted") => _repo.GrantAccessAsync(userId, itemType, itemId, accessType);
    }
}

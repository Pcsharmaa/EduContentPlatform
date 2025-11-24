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

        public async Task<int> PurchaseAsync(int userId, string itemType, int itemId, decimal amount)
        {
            // Integrate payment gateway here (Stripe/Razorpay) and confirm
            // After payment success:
            var accessId = await _repo.CreatePurchaseAsync(userId, itemType, itemId, amount);
            return accessId;
        }

        public async Task<bool> HasAccessAsync(int userId, string itemType, int itemId)
            => await _repo.HasAccessAsync(userId, itemType, itemId);

        public async Task GrantAccessAsync(int userId, string itemType, int itemId, string accessType = "Granted")
            => await _repo.GrantAccessAsync(userId, itemType, itemId, accessType);
    }
}

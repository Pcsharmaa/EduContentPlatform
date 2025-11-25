using System.Data;
using System.Threading.Tasks;
using Dapper;
using EduContentPlatform.Repository.Database;
using Microsoft.Extensions.Logging;

namespace EduContentPlatform.Repository.Content
{
    public class PurchaseRepository : IPurchaseRepository
    {
        private readonly ISqlConnectionFactory _factory;
        public PurchaseRepository(ISqlConnectionFactory factory) => _factory = factory;

        public async Task<int> CreatePurchaseAsync(int userId, string itemType, int itemId, decimal amount)
        {
            using var conn = _factory.CreateConnection();
            return await conn.ExecuteScalarAsync<int>("sp_PurchaseItem", new { UserId = userId, ItemType = itemType, ItemId = itemId, Amount = amount }, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> HasAccessAsync(int userId, string itemType, int itemId)
        {
            using var conn = _factory.CreateConnection();
            var result = await conn.ExecuteScalarAsync<int>("sp_CheckUserAccess", new { UserId = userId, ItemType = itemType, ItemId = itemId }, commandType: CommandType.StoredProcedure);
            return result > 0;
        }

        public async Task GrantAccessAsync(int userId, string itemType, int itemId, string accessType)
        {
            using var conn = _factory.CreateConnection();
            await conn.ExecuteAsync("sp_GrantAccess", new { UserId = userId, ItemType = itemType, ItemId = itemId, AccessType = accessType }, commandType: CommandType.StoredProcedure);
        }
    }
}

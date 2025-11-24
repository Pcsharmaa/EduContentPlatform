using System.Data;
using System.Threading.Tasks;
using Dapper;
using EduContentPlatform.Repository.Database;
using Microsoft.Extensions.Logging;

namespace EduContentPlatform.Repository.Content
{
    public class PurchaseRepository : IPurchaseRepository
    {
        private readonly ISqlConnectionFactory _sqlConnectionFactory;
        private readonly ILogger<PurchaseRepository> _logger;

        public PurchaseRepository(ISqlConnectionFactory sqlConnectionFactory, ILogger<PurchaseRepository> logger)
        {
            _sqlConnectionFactory = sqlConnectionFactory;
            _logger = logger;
        }

        private void LogError(string method, Exception ex, object payload = null)
        {
            _logger.LogError(ex, $"[PurchaseRepository::{method}] Error occurred. Payload: {@payload}");
        }

        public async Task<int> CreatePurchaseAsync(int userId, string itemType, int itemId, decimal amount)
        {
            try
            {
                using var conn = _sqlConnectionFactory.CreateConnection();

                return await conn.ExecuteScalarAsync<int>(
                    "sp_PurchaseItem",
                    new { UserId = userId, ItemType = itemType, ItemId = itemId, Amount = amount },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(CreatePurchaseAsync), ex, new { userId, itemType, itemId, amount });
                throw;
            }
        }

        public async Task<bool> HasAccessAsync(int userId, string itemType, int itemId)
        {
            try
            {
                using var conn = _sqlConnectionFactory.CreateConnection();

                var result = await conn.ExecuteScalarAsync<int>(
                    "sp_CheckUserAccess",
                    new { UserId = userId, ItemType = itemType, ItemId = itemId },
                    commandType: CommandType.StoredProcedure
                );

                return result > 0;
            }
            catch (Exception ex)
            {
                LogError(nameof(HasAccessAsync), ex, new { userId, itemType, itemId });
                throw;
            }
        }

        public async Task GrantAccessAsync(int userId, string itemType, int itemId, string accessType)
        {
            try
            {
                using var conn = _sqlConnectionFactory.CreateConnection();

                await conn.ExecuteAsync(
                    "sp_GrantAccess",
                    new { UserId = userId, ItemType = itemType, ItemId = itemId, AccessType = accessType },
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                LogError(nameof(GrantAccessAsync), ex, new { userId, itemType, itemId, accessType });
                throw;
            }
        }
    }
}

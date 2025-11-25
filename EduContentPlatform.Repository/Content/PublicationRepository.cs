using Dapper;
using EduContentPlatform.Models.Content;
using EduContentPlatform.Models.Content.EduContentPlatform.Models.Publications;
using EduContentPlatform.Models.Teacher;
using EduContentPlatform.Repository.Database;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace EduContentPlatform.Repository.Content
{
    public class PublicationRepository : IPublicationRepository
    {
        private readonly ISqlConnectionFactory _factory;
        public PublicationRepository(ISqlConnectionFactory factory) => _factory = factory;

        public async Task<int> UploadPublicationAsync(PublicationModel model)
        {
            using var conn = _factory.CreateConnection();
            return await conn.ExecuteScalarAsync<int>(
                "sp_UploadPublication",
                new { model.Title, model.Description, model.CoverImageUrl, model.IsPaid, model.Price, model.Category, model.CreatedBy },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<int> UploadVolumeAsync(PublicationVolumeModel model)
        {
            using var conn = _factory.CreateConnection();
            return await conn.ExecuteScalarAsync<int>(
                "sp_UploadVolume",
                new { model.PublicationId, model.VolumeNumber, model.Title, model.Description, model.FileUrl, model.Price, model.CreatedBy },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<int> UploadArticleAsync(ArticleModel model)
        {
            using var conn = _factory.CreateConnection();
            return await conn.ExecuteScalarAsync<int>(
                "sp_UploadArticle",
                new { model.Title, model.Body, model.FileUrl, model.CreatedBy, model.IsPaid, model.Price },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<int> UploadResearchPaperAsync(ResearchPaperModel model)
        {
            using var conn = _factory.CreateConnection();
            return await conn.ExecuteScalarAsync<int>(
                "sp_UploadResearchPaper",
                new { model.PublicationId, model.Title, model.Abstract, model.FileUrl, model.CreatedBy },
                commandType: CommandType.StoredProcedure);
        }

        public async Task AssignToEditorAsync(string itemType, int itemId, int editorUserId)
        {
            using var conn = _factory.CreateConnection();
            await conn.ExecuteAsync(
                "sp_AssignToEditor",
                new { ItemType = itemType, ItemId = itemId, AssignedTo = editorUserId },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task UpdatePublishingStatusAsync(string itemType, int itemId, string status, int performedBy, string comments)
        {
            using var conn = _factory.CreateConnection();
            await conn.ExecuteAsync("sp_UpdatePublishingStatus", new { ItemType = itemType, ItemId = itemId, Status = status, PerformedBy = performedBy, Comments = comments }, commandType: CommandType.StoredProcedure);
        }

        public async Task<PublicationModel> GetPublicationAsync(int publicationId)
        {
            using var conn = _factory.CreateConnection();
            var multi = await conn.QueryMultipleAsync("sp_GetPublicationDetails", new { PublicationId = publicationId }, commandType: CommandType.StoredProcedure);
            var pub = await multi.ReadFirstOrDefaultAsync<PublicationModel>();
            if (pub == null) return null;
            pub.Volumes = (await multi.ReadAsync<PublicationVolumeModel>()).ToList();
            return pub;
        }

        public async Task<IEnumerable<PublicationVolumeModel>> GetVolumesAsync(int publicationId)
        {
            using var conn = _factory.CreateConnection();
            return await conn.QueryAsync<PublicationVolumeModel>(
                "sp_GetPublicationVolumes",
                new { PublicationId = publicationId },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<IEnumerable<PublicationModel>> GetPendingForRoleAsync(string roleName)
        {
            using var conn = _factory.CreateConnection();
            return await conn.QueryAsync<PublicationModel>("sp_GetPendingForRole", new { RoleName = roleName }, commandType: CommandType.StoredProcedure);
        }
    }
}

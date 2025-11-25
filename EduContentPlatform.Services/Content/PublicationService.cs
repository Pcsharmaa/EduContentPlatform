using EduContentPlatform.Models.Content;
using EduContentPlatform.Models.Content.EduContentPlatform.Models.Publications;
using EduContentPlatform.Models.Teacher;
using EduContentPlatform.Services.Notification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Repository.Content
{
    public class PublicationService : IPublicationService
    {
        private readonly IPublicationRepository _repo;
        public PublicationService(IPublicationRepository repo) => _repo = repo;

        public Task<int> SubmitPublicationAsync(PublicationModel model) => _repo.UploadPublicationAsync(model);
        public Task<int> SubmitVolumeAsync(PublicationVolumeModel model) => _repo.UploadVolumeAsync(model);
        public Task<int> SubmitArticleAsync(ArticleModel model) => _repo.UploadArticleAsync(model);
        public Task<int> SubmitResearchPaperAsync(ResearchPaperModel model) => _repo.UploadResearchPaperAsync(model);
        public Task AssignToEditorAsync(string itemType, int itemId, int editorUserId) => _repo.AssignToEditorAsync(itemType, itemId, editorUserId);
        public Task UpdateStatusAsync(string itemType, int itemId, string status, int performedBy, string comments = null) => _repo.UpdatePublishingStatusAsync(itemType, itemId, status, performedBy, comments);
        public Task<IEnumerable<PublicationModel>> GetPendingForRoleAsync(string roleName) => _repo.GetPendingForRoleAsync(roleName);
        public Task<PublicationModel> GetPublicationAsync(int publicationId) => _repo.GetPublicationAsync(publicationId);
        public Task<IEnumerable<PublicationVolumeModel>> GetVolumesAsync(int publicationId) => _repo.GetVolumesAsync(publicationId);
    }
}

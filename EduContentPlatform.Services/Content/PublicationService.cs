using EduContentPlatform.Models.Content.EduContentPlatform.Models.Publications;
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
        private readonly IPublicationRepository _publicationRepository;
        private readonly IEmailService _emailService;

        public PublicationService(IPublicationRepository publicationRepository,IEmailService emailService)
        {
            _publicationRepository = publicationRepository;
            _emailService = emailService;
        }

        public async Task<int> SubmitPublicationAsync(PublicationModel model)
        {
            var id = await _publicationRepository.UploadPublicationAsync(model);
            // notify publishers/editors if necessary
            return id;
        }

        public async Task<int> SubmitVolumeAsync(PublicationVolumeModel model)
        {
            var id = await _publicationRepository.UploadVolumeAsync(model);
            // if video volume, you can enqueue video worker job here
            return id;
        }

        public async Task<int> SubmitArticleAsync(ArticleModel model)
        {
            var id = await _publicationRepository.UploadArticleAsync(model);
            return id;
        }

        public async Task UpdateStatusAsync(string itemType, int itemId, string status, int performedBy, string comments = null)
        {
            await _publicationRepository.UpdatePublishingStatusAsync(itemType, itemId, status, performedBy, comments);
            // optionally notify relevant users
        }

        public async Task AssignToEditorAsync(string itemType, int itemId, int editorUserId)
        {
            await _publicationRepository.AssignToEditorAsync(itemType, itemId, editorUserId);
            // notify editor
        }

        public async Task<IEnumerable<PublicationModel>> GetPendingForRoleAsync(string roleName)
            => await _publicationRepository.GetPendingForRoleAsync(roleName);

        public async Task<PublicationModel> GetPublicationAsync(int publicationId)
            => await _publicationRepository.GetPublicationAsync(publicationId);

        public async Task<IEnumerable<PublicationVolumeModel>> GetVolumesAsync(int publicationId)
            => await _publicationRepository.GetVolumesAsync(publicationId);
    }
}

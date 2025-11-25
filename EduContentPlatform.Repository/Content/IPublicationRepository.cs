using EduContentPlatform.Models.Content;
using EduContentPlatform.Models.Content.EduContentPlatform.Models.Publications;
using EduContentPlatform.Models.Teacher;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Repository.Content
{
    public interface IPublicationRepository
    {
        Task<int> UploadPublicationAsync(PublicationModel model);
        Task<int> UploadVolumeAsync(PublicationVolumeModel model);
        Task<int> UploadArticleAsync(ArticleModel model);
        Task<int> UploadResearchPaperAsync(ResearchPaperModel model);
        Task AssignToEditorAsync(string itemType, int itemId, int editorUserId);
        Task UpdatePublishingStatusAsync(string itemType, int itemId, string status, int performedBy, string comments);
        Task<PublicationModel> GetPublicationAsync(int publicationId);
        Task<IEnumerable<PublicationVolumeModel>> GetVolumesAsync(int publicationId);
        Task<IEnumerable<PublicationModel>> GetPendingForRoleAsync(string roleName);
    }
}

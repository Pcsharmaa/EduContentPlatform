using EduContentPlatform.Models.Content;
using EduContentPlatform.Models.Content.EduContentPlatform.Models.Publications;
using EduContentPlatform.Models.Teacher;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Repository.Content
{
    public interface IPublicationService
    {
        Task<int> SubmitPublicationAsync(PublicationModel model);
        Task<int> SubmitVolumeAsync(PublicationVolumeModel model);
        Task<int> SubmitArticleAsync(ArticleModel model);
        Task<int> SubmitResearchPaperAsync(ResearchPaperModel model);
        Task AssignToEditorAsync(string itemType, int itemId, int editorUserId);
        Task UpdateStatusAsync(string itemType, int itemId, string status, int performedBy, string comments = null);
        Task<IEnumerable<PublicationModel>> GetPendingForRoleAsync(string roleName);
        Task<PublicationModel> GetPublicationAsync(int publicationId);
        Task<IEnumerable<PublicationVolumeModel>> GetVolumesAsync(int publicationId);
    }

}

using EduContentPlatform.Models.Content.EduContentPlatform.Models.Publications;
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
        Task UpdateStatusAsync(string itemType, int itemId, string status, int performedBy, string comments = null);
        Task AssignToEditorAsync(string itemType, int itemId, int editorUserId);
        Task<IEnumerable<PublicationModel>> GetPendingForRoleAsync(string roleName);
        Task<PublicationModel> GetPublicationAsync(int publicationId);
        Task<IEnumerable<PublicationVolumeModel>> GetVolumesAsync(int publicationId);
    }

}

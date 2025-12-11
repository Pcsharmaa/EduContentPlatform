// Services/Content/IContentService.cs
using EduContentPlatform.Models.Content;
using System.Threading.Tasks;

namespace EduContentPlatform.Services.Content
{
    public interface IContentService
    {
        // Content
        Task<ContentItemModel> GetContentByIdAsync(int contentId);
        Task<ContentItemWithDetailsModel> GetContentWithDetailsAsync(int contentId, int? userId = null);
        Task<int> CreateContentAsync(ContentItemModel content);
        Task<bool> UpdateContentAsync(ContentItemModel content);
        Task<bool> DeleteContentAsync(int contentId);
        Task<bool> UpdateContentStatusAsync(int contentId, string status);
        Task<IEnumerable<ContentItemWithDetailsModel>> SearchContentAsync(
            string searchTerm = null,
            string contentType = null,
            int? categoryId = null,
            int page = 1,
            int pageSize = 20,
            int? userId = null);
        Task<IEnumerable<ContentItemWithDetailsModel>> GetFeaturedContentAsync(int limit = 10);
        Task<bool> IncrementViewCountAsync(int contentId);
        Task<bool> IncrementDownloadCountAsync(int contentId);

        // Files
        Task<ContentFileModel> GetFileByIdAsync(int fileId);
        Task<IEnumerable<ContentFileModel>> GetContentFilesAsync(int contentId);
        Task<int> AddContentFileAsync(ContentFileModel file);
        Task<bool> SetPrimaryFileAsync(int contentId, int fileId);
        Task<bool> DeleteContentFileAsync(int fileId);
        Task<bool> UpdateFileAsync(ContentFileModel file);

        // Categories
        Task<IEnumerable<CategoryModel>> GetAllCategoriesAsync();
        Task<IEnumerable<CategoryTreeItemModel>> GetCategoryTreeAsync(bool includeContentCount = false);
        Task<CategoryModel> GetCategoryByIdAsync(int categoryId);
        Task<int> CreateCategoryAsync(CategoryModel category);
        Task<bool> UpdateCategoryAsync(CategoryModel category);
        Task<bool> DeleteCategoryAsync(int categoryId);
        Task<bool> AssignContentToCategoriesAsync(int contentId, List<int> categoryIds);
        Task<IEnumerable<int>> GetContentCategoryIdsAsync(int contentId);

        // Courses
        Task<CourseModel> GetCourseByIdAsync(int courseId);
        Task<CourseWithDetailsModel> GetCourseWithDetailsAsync(int courseId, int? userId = null);
        Task<int> CreateCourseAsync(CourseModel course);
        Task<bool> UpdateCourseAsync(CourseModel course);
        Task<bool> DeleteCourseAsync(int courseId);
        Task<IEnumerable<CourseWithDetailsModel>> GetUserCoursesAsync(int userId);
        Task<IEnumerable<CourseWithDetailsModel>> GetPublishedCoursesAsync(int page = 1, int pageSize = 20);
        Task<bool> UpdateCourseStatsAsync(int courseId);

        // Chapters
        Task<ChapterModel> GetChapterByIdAsync(int chapterId);
        Task<ChapterWithDetailsModel> GetChapterWithDetailsAsync(int chapterId, int? userId = null);
        Task<IEnumerable<ChapterModel>> GetCourseChaptersAsync(int courseId);
        Task<int> CreateChapterAsync(ChapterModel chapter);
        Task<bool> UpdateChapterAsync(ChapterModel chapter);
        Task<bool> DeleteChapterAsync(int chapterId);
        Task<bool> UpdateChapterOrderAsync(int chapterId, int sortOrder);

        // Ratings & Reviews
        Task<RatingReviewModel> GetRatingByIdAsync(int ratingId);
        Task<IEnumerable<RatingReviewModel>> GetContentRatingsAsync(int contentId, int page = 1, int pageSize = 10);
        Task<RatingReviewModel> GetUserRatingForContentAsync(int contentId, int userId);
        Task<int> AddRatingAsync(RatingReviewModel rating);
        Task<bool> UpdateRatingAsync(RatingReviewModel rating);
        Task<bool> DeleteRatingAsync(int ratingId);
        Task<bool> ReportRatingAsync(int ratingId, string reason);
        Task<bool> AddRatingReplyAsync(int ratingId, string reply, int repliedBy);
        Task<bool> MarkRatingAsHelpfulAsync(int ratingId, int userId);

        // User Progress
        Task<UserProgressModel> GetUserProgressAsync(int contentId, int userId);
        Task<IEnumerable<UserProgressModel>> GetUserAllProgressAsync(int userId);
        Task<int> CreateOrUpdateProgressAsync(UserProgressModel progress);
        Task<bool> UpdateProgressAsync(UserProgressModel progress);
        Task<bool> DeleteProgressAsync(int progressId);

        // Purchases
        Task<PurchaseModel> GetPurchaseByIdAsync(int purchaseId);
        Task<PurchaseModel> GetPurchaseByOrderIdAsync(string orderId);
        Task<IEnumerable<PurchaseModel>> GetUserPurchasesAsync(int userId);
        Task<int> CreatePurchaseAsync(PurchaseModel purchase);
        Task<bool> UpdatePurchaseStatusAsync(int purchaseId, string status);
        Task<bool> ProcessRefundAsync(int purchaseId, decimal amount, string reason);
        Task<bool> CheckUserPurchaseAsync(int contentId, int userId);
        Task<bool> HasUserAccessAsync(int contentId, int userId);

        // Wishlist
        Task<WishlistItemModel> GetWishlistItemAsync(int contentId, int userId);
        Task<IEnumerable<ContentItemWithDetailsModel>> GetUserWishlistAsync(int userId);
        Task<int> AddToWishlistAsync(WishlistItemModel item);
        Task<bool> RemoveFromWishlistAsync(int contentId, int userId);
        Task<bool> ClearUserWishlistAsync(int userId);

        // Workflow
        Task<IEnumerable<WorkflowItemModel>> GetContentWorkflowAsync(int contentId);
        Task<int> AddWorkflowStepAsync(WorkflowItemModel workflow);
        Task<bool> UpdateWorkflowStepAsync(int workflowId, string status, string notes = null);
        Task<bool> AssignWorkflowAsync(int contentId, int assignedToUserId, string roleName);

        // Analytics
        Task<ContentAnalyticsModel> GetContentAnalyticsAsync(int contentId);
        Task<DashboardStatsModel> GetDashboardStatsAsync(DateTime? startDate = null, DateTime? endDate = null);
        Task<IEnumerable<DailyStatModel>> GetDailyStatsAsync(int contentId, int days = 30);
        Task<IEnumerable<ContentStatModel>> GetTopContentAsync(int limit = 10, string period = "month");
        Task<UserContentAnalyticsModel> GetUserContentAnalyticsAsync(int userId);

        // Content Relationships
        Task<bool> AddContentToCourseAsync(int contentId, int courseId, int? chapterId = null);
        Task<bool> RemoveContentFromCourseAsync(int contentId);
        Task<IEnumerable<ContentItemWithDetailsModel>> GetCourseContentAsync(int courseId, int? userId = null);
        Task<IEnumerable<ContentItemWithDetailsModel>> GetChapterContentAsync(int chapterId, int? userId = null);
    }
}
using EduContentPlatform.Models.Content;
using EduContentPlatform.Repositorie.Content;
using EduContentPlatform.Repository.Auth;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EduContentPlatform.Services.Content
{
    public class ContentService : IContentService
    {
        private readonly IContentRepository _contentRepository;
        private readonly ILogger<ContentService> _logger;

        public ContentService(
            IContentRepository contentRepository,
            ILogger<ContentService> logger)
        {
            _contentRepository = contentRepository ?? throw new ArgumentNullException(nameof(contentRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        #region CONTENT

        public async Task<ContentItemModel> GetContentByIdAsync(int contentId)
        {
            return await _contentRepository.GetContentByIdAsync(contentId);
        }

        public async Task<ContentItemWithDetailsModel> GetContentWithDetailsAsync(int contentId, int? userId = null)
        {
            // Pass userId through if repository supports it for localized details
            var content = await _contentRepository.GetContentWithDetailsAsync(contentId, userId);

            if (content == null)
            {
                _logger.LogWarning("Content not found: {ContentId}", contentId);
                throw new KeyNotFoundException($"Content with id {contentId} not found.");
            }

            if (userId.HasValue)
            {
                try
                {
                    content.HasAccess = await _contentRepository.HasUserAccessAsync(contentId, userId.Value);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error checking access for user {UserId} and content {ContentId}", userId, contentId);
                    content.HasAccess = false;
                }
            }

            return content;
        }

        public async Task<int> CreateContentAsync(ContentItemModel content)
        {
            if (content == null) throw new ArgumentNullException(nameof(content));

            content.CreatedAt = DateTime.UtcNow;

            // auto-slug
            if (string.IsNullOrWhiteSpace(content.Slug))
                content.Slug = GenerateSlug(content.Title);

            return await _contentRepository.CreateContentAsync(content);
        }

        public async Task<bool> UpdateContentAsync(ContentItemModel content)
        {
            if (content == null) throw new ArgumentNullException(nameof(content));
            content.UpdatedAt = DateTime.UtcNow;

            // Ensure slug exists
            if (string.IsNullOrWhiteSpace(content.Slug) && !string.IsNullOrWhiteSpace(content.Title))
                content.Slug = GenerateSlug(content.Title);

            return await _contentRepository.UpdateContentAsync(content);
        }

        public async Task<bool> DeleteContentAsync(int contentId)
        {
            return await _contentRepository.DeleteContentAsync(contentId);
        }

        public async Task<bool> UpdateContentStatusAsync(int contentId, string status)
        {
            return await _contentRepository.UpdateContentStatusAsync(contentId, status);
        }

        public async Task<IEnumerable<ContentItemWithDetailsModel>> SearchContentAsync(
            string searchTerm = null,
            string contentType = null,
            int? categoryId = null,
            int page = 1,
            int pageSize = 20,
            int? userId = null)
        {
            var results = await _contentRepository.SearchContentAsync(
                searchTerm,
                contentType,
                categoryId,
                page,
                pageSize,
                userId);

            // If repository doesn't set HasAccess, set it here
            if (userId.HasValue)
            {
                foreach (var item in results)
                {
                    try
                    {
                        item.HasAccess = await _contentRepository.HasUserAccessAsync(item.ContentId, userId.Value);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error checking access for user {UserId} and content {ContentId}", userId.Value, item.ContentId);
                        item.HasAccess = false;
                    }
                }
            }

            return results;
        }

        public async Task<IEnumerable<ContentItemWithDetailsModel>> GetFeaturedContentAsync(int limit = 10)
        {
            return await _contentRepository.GetFeaturedContentAsync(limit);
        }

        public async Task<bool> IncrementViewCountAsync(int contentId)
        {
            return await _contentRepository.IncrementViewCountAsync(contentId);
        }

        public async Task<bool> IncrementDownloadCountAsync(int contentId)
        {
            return await _contentRepository.IncrementDownloadCountAsync(contentId);
        }

        #endregion

        #region FILES

        public Task<ContentFileModel> GetFileByIdAsync(int fileId)
            => _contentRepository.GetFileByIdAsync(fileId);

        public Task<IEnumerable<ContentFileModel>> GetContentFilesAsync(int contentId)
            => _contentRepository.GetContentFilesAsync(contentId);

        public Task<int> AddContentFileAsync(ContentFileModel file)
        {
            if (file == null) throw new ArgumentNullException(nameof(file));
            file.CreatedAt = DateTime.UtcNow;
            return _contentRepository.AddContentFileAsync(file);
        }

        public Task<bool> SetPrimaryFileAsync(int contentId, int fileId)
            => _contentRepository.SetPrimaryFileAsync(contentId, fileId);

        public Task<bool> DeleteContentFileAsync(int fileId)
            => _contentRepository.DeleteContentFileAsync(fileId);

        public Task<bool> UpdateFileAsync(ContentFileModel file)
        {
            if (file == null) throw new ArgumentNullException(nameof(file));
            file.UpdatedAt = DateTime.UtcNow;
            return _contentRepository.UpdateFileAsync(file);
        }

        #endregion

        #region CATEGORIES

        public Task<IEnumerable<CategoryModel>> GetAllCategoriesAsync()
            => _contentRepository.GetAllCategoriesAsync();

        public Task<IEnumerable<CategoryTreeItemModel>> GetCategoryTreeAsync(bool includeContentCount = false)
            => _contentRepository.GetCategoryTreeAsync(includeContentCount);

        public Task<CategoryModel> GetCategoryByIdAsync(int categoryId)
            => _contentRepository.GetCategoryByIdAsync(categoryId);

        public Task<int> CreateCategoryAsync(CategoryModel category)
        {
            if (category == null) throw new ArgumentNullException(nameof(category));
            category.CreatedAt = DateTime.UtcNow;
            return _contentRepository.CreateCategoryAsync(category);
        }

        public Task<bool> UpdateCategoryAsync(CategoryModel category)
        {
            if (category == null) throw new ArgumentNullException(nameof(category));
            category.UpdatedAt = DateTime.UtcNow;
            return _contentRepository.UpdateCategoryAsync(category);
        }

        public Task<bool> DeleteCategoryAsync(int categoryId)
            => _contentRepository.DeleteCategoryAsync(categoryId);

        public Task<bool> AssignContentToCategoriesAsync(int contentId, List<int> categoryIds)
            => _contentRepository.AssignContentToCategoriesAsync(contentId, categoryIds);

        public Task<IEnumerable<int>> GetContentCategoryIdsAsync(int contentId)
            => _contentRepository.GetContentCategoryIdsAsync(contentId);

        #endregion

        #region COURSES

        public Task<CourseModel> GetCourseByIdAsync(int courseId)
            => _contentRepository.GetCourseByIdAsync(courseId);

        public Task<CourseWithDetailsModel> GetCourseWithDetailsAsync(int courseId, int? userId = null)
            => _contentRepository.GetCourseWithDetailsAsync(courseId, userId);

        public Task<int> CreateCourseAsync(CourseModel course)
        {
            if (course == null) throw new ArgumentNullException(nameof(course));
            course.CreatedAt = DateTime.UtcNow;
            return _contentRepository.CreateCourseAsync(course);
        }

        public Task<bool> UpdateCourseAsync(CourseModel course)
        {
            if (course == null) throw new ArgumentNullException(nameof(course));
            course.UpdatedAt = DateTime.UtcNow;
            return _contentRepository.UpdateCourseAsync(course);
        }

        public Task<bool> DeleteCourseAsync(int courseId)
            => _contentRepository.DeleteCourseAsync(courseId);

        public Task<IEnumerable<CourseWithDetailsModel>> GetUserCoursesAsync(int userId)
            => _contentRepository.GetUserCoursesAsync(userId);

        public Task<IEnumerable<CourseWithDetailsModel>> GetPublishedCoursesAsync(int page = 1, int pageSize = 20)
            => _contentRepository.GetPublishedCoursesAsync(page, pageSize);

        public Task<bool> UpdateCourseStatsAsync(int courseId)
            => _contentRepository.UpdateCourseStatsAsync(courseId);

        #endregion

        #region CHAPTERS

        public Task<ChapterModel> GetChapterByIdAsync(int chapterId)
            => _contentRepository.GetChapterByIdAsync(chapterId);

        public Task<ChapterWithDetailsModel> GetChapterWithDetailsAsync(int chapterId, int? userId = null)
            => _contentRepository.GetChapterWithDetailsAsync(chapterId, userId);

        public Task<IEnumerable<ChapterModel>> GetCourseChaptersAsync(int courseId)
            => _contentRepository.GetCourseChaptersAsync(courseId);

        public Task<int> CreateChapterAsync(ChapterModel chapter)
        {
            if (chapter == null) throw new ArgumentNullException(nameof(chapter));
            chapter.CreatedAt = DateTime.UtcNow;
            return _contentRepository.CreateChapterAsync(chapter);
        }

        public Task<bool> UpdateChapterAsync(ChapterModel chapter)
        {
            if (chapter == null) throw new ArgumentNullException(nameof(chapter));
            chapter.UpdatedAt = DateTime.UtcNow;
            return _contentRepository.UpdateChapterAsync(chapter);
        }

        public Task<bool> DeleteChapterAsync(int chapterId)
            => _contentRepository.DeleteChapterAsync(chapterId);

        public Task<bool> UpdateChapterOrderAsync(int chapterId, int sortOrder)
            => _contentRepository.UpdateChapterOrderAsync(chapterId, sortOrder);

        #endregion

        #region RATINGS & REVIEWS

        public Task<RatingReviewModel> GetRatingByIdAsync(int ratingId)
            => _contentRepository.GetRatingByIdAsync(ratingId);

        public Task<IEnumerable<RatingReviewModel>> GetContentRatingsAsync(int contentId, int page = 1, int pageSize = 10)
            => _contentRepository.GetContentRatingsAsync(contentId, page, pageSize);

        public Task<RatingReviewModel> GetUserRatingForContentAsync(int contentId, int userId)
            => _contentRepository.GetUserRatingForContentAsync(contentId, userId);

        public Task<int> AddRatingAsync(RatingReviewModel rating)
        {
            if (rating == null) throw new ArgumentNullException(nameof(rating));
            rating.CreatedAt = DateTime.UtcNow;
            return _contentRepository.AddRatingAsync(rating);
        }

        public Task<bool> UpdateRatingAsync(RatingReviewModel rating)
        {
            if (rating == null) throw new ArgumentNullException(nameof(rating));
            rating.UpdatedAt = DateTime.UtcNow;
            return _contentRepository.UpdateRatingAsync(rating);
        }

        public Task<bool> DeleteRatingAsync(int ratingId)
            => _contentRepository.DeleteRatingAsync(ratingId);

        public Task<bool> ReportRatingAsync(int ratingId, string reason)
            => _contentRepository.ReportRatingAsync(ratingId, reason);

        public Task<bool> AddRatingReplyAsync(int ratingId, string reply, int repliedBy)
            => _contentRepository.AddRatingReplyAsync(ratingId, reply, repliedBy);

        public Task<bool> MarkRatingAsHelpfulAsync(int ratingId, int userId)
            => _contentRepository.MarkRatingAsHelpfulAsync(ratingId, userId);

        #endregion

        #region USER PROGRESS

        public Task<UserProgressModel> GetUserProgressAsync(int contentId, int userId)
            => _contentRepository.GetUserProgressAsync(contentId, userId);

        public Task<IEnumerable<UserProgressModel>> GetUserAllProgressAsync(int userId)
            => _contentRepository.GetUserAllProgressAsync(userId);

        public Task<int> CreateOrUpdateProgressAsync(UserProgressModel progress)
        {
            if (progress == null) throw new ArgumentNullException(nameof(progress));
            progress.UpdatedAt = DateTime.UtcNow;
            return _contentRepository.CreateOrUpdateProgressAsync(progress);
        }

        public Task<bool> UpdateProgressAsync(UserProgressModel progress)
        {
            if (progress == null) throw new ArgumentNullException(nameof(progress));
            progress.UpdatedAt = DateTime.UtcNow;
            return _contentRepository.UpdateProgressAsync(progress);
        }

        public Task<bool> DeleteProgressAsync(int progressId)
            => _contentRepository.DeleteProgressAsync(progressId);

        #endregion

        #region PURCHASES

        public Task<PurchaseModel> GetPurchaseByIdAsync(int purchaseId)
            => _contentRepository.GetPurchaseByIdAsync(purchaseId);

        public Task<PurchaseModel> GetPurchaseByOrderIdAsync(string orderId)
            => _contentRepository.GetPurchaseByOrderIdAsync(orderId);

        public Task<IEnumerable<PurchaseModel>> GetUserPurchasesAsync(int userId)
            => _contentRepository.GetUserPurchasesAsync(userId);

        public Task<int> CreatePurchaseAsync(PurchaseModel purchase)
        {
            if (purchase == null) throw new ArgumentNullException(nameof(purchase));
            purchase.CreatedAt = DateTime.UtcNow;
            return _contentRepository.CreatePurchaseAsync(purchase);
        }

        public Task<bool> UpdatePurchaseStatusAsync(int purchaseId, string status)
            => _contentRepository.UpdatePurchaseStatusAsync(purchaseId, status);

        public Task<bool> ProcessRefundAsync(int purchaseId, decimal amount, string reason)
            => _contentRepository.ProcessRefundAsync(purchaseId, amount, reason);

        public Task<bool> CheckUserPurchaseAsync(int contentId, int userId)
            => _contentRepository.CheckUserPurchaseAsync(contentId, userId);

        public Task<bool> HasUserAccessAsync(int contentId, int userId)
            => _contentRepository.HasUserAccessAsync(contentId, userId);

        #endregion

        #region WISHLIST

        public Task<WishlistItemModel> GetWishlistItemAsync(int contentId, int userId)
            => _contentRepository.GetWishlistItemAsync(contentId, userId);

        public Task<IEnumerable<ContentItemWithDetailsModel>> GetUserWishlistAsync(int userId)
            => _contentRepository.GetUserWishlistAsync(userId);

        public Task<int> AddToWishlistAsync(WishlistItemModel item)
        {
            if (item == null) throw new ArgumentNullException(nameof(item));
            item.CreatedAt = DateTime.UtcNow;
            return _contentRepository.AddToWishlistAsync(item);
        }

        public Task<bool> RemoveFromWishlistAsync(int contentId, int userId)
            => _contentRepository.RemoveFromWishlistAsync(contentId, userId);

        public Task<bool> ClearUserWishlistAsync(int userId)
            => _contentRepository.ClearUserWishlistAsync(userId);

        #endregion

        #region WORKFLOW

        public Task<IEnumerable<WorkflowItemModel>> GetContentWorkflowAsync(int contentId)
            => _contentRepository.GetContentWorkflowAsync(contentId);

        public Task<int> AddWorkflowStepAsync(WorkflowItemModel workflow)
        {
            if (workflow == null) throw new ArgumentNullException(nameof(workflow));
            workflow.CreatedAt = DateTime.UtcNow;
            return _contentRepository.AddWorkflowStepAsync(workflow);
        }

        public Task<bool> UpdateWorkflowStepAsync(int workflowId, string status, string notes = null)
            => _contentRepository.UpdateWorkflowStepAsync(workflowId, status, notes);

        public Task<bool> AssignWorkflowAsync(int contentId, int assignedToUserId, string roleName)
            => _contentRepository.AssignWorkflowAsync(contentId, assignedToUserId, roleName);

        #endregion

        #region ANALYTICS

        public Task<ContentAnalyticsModel> GetContentAnalyticsAsync(int contentId)
            => _contentRepository.GetContentAnalyticsAsync(contentId);

        public Task<DashboardStatsModel> GetDashboardStatsAsync(DateTime? startDate = null, DateTime? endDate = null)
            => _contentRepository.GetDashboardStatsAsync(startDate, endDate);

        public Task<IEnumerable<DailyStatModel>> GetDailyStatsAsync(int contentId, int days = 30)
            => _contentRepository.GetDailyStatsAsync(contentId, days);

        public Task<IEnumerable<ContentStatModel>> GetTopContentAsync(int limit = 10, string period = "month")
            => _contentRepository.GetTopContentAsync(limit, period);

        public Task<UserContentAnalyticsModel> GetUserContentAnalyticsAsync(int userId)
            => _contentRepository.GetUserContentAnalyticsAsync(userId);

        #endregion

        #region CONTENT RELATIONSHIPS

        public Task<bool> AddContentToCourseAsync(int contentId, int courseId, int? chapterId = null)
            => _contentRepository.AddContentToCourseAsync(contentId, courseId, chapterId);

        public Task<bool> RemoveContentFromCourseAsync(int contentId)
            => _contentRepository.RemoveContentFromCourseAsync(contentId);

        public Task<IEnumerable<ContentItemWithDetailsModel>> GetCourseContentAsync(int courseId, int? userId = null)
            => _contentRepository.GetCourseContentAsync(courseId, userId);

        public Task<IEnumerable<ContentItemWithDetailsModel>> GetChapterContentAsync(int chapterId, int? userId = null)
            => _contentRepository.GetChapterContentAsync(chapterId, userId);

        #endregion

        #region Helpers

        private string GenerateSlug(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return Guid.NewGuid().ToString();

            var slug = title.ToLowerInvariant();
            slug = slug.Replace(" ", "-");
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\-]", "");
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"-+", "-");
            slug = slug.Trim('-');
            slug = $"{slug}-{DateTime.UtcNow:yyyyMMddHHmmss}";
            return slug;
        }

        #endregion
    }
}

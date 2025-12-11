using Dapper;
using EduContentPlatform.Models.Content;
using EduContentPlatform.Repository.Auth;
using EduContentPlatform.Repository.Database;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace EduContentPlatform.Repositorie.Content
{
    public class ContentRepository : IContentRepository
    {
        private readonly ISqlConnectionFactory _connectionFactory;
        private readonly ILogger<ContentRepository> _logger;
       

        public ContentRepository(ISqlConnectionFactory connectionFactory, ILogger<ContentRepository> logger)
        {
            _connectionFactory = connectionFactory;
            _logger = logger;
        }



        public async Task<ContentItemModel> GetContentByIdAsync(int contentId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<ContentItemModel>(
                "spContent_GetById",
                new { ContentId = contentId },
                commandType: CommandType.StoredProcedure
            ) ?? new ContentItemModel(); 
        }

        public async Task<ContentItemWithDetailsModel> GetContentWithDetailsAsync(int contentId, int? userId = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var multi = await connection.QueryMultipleAsync(
                "spContent_GetWithDetails",
                new { ContentId = contentId, UserId = userId },
                commandType: CommandType.StoredProcedure
            );

            var content = await multi.ReadSingleOrDefaultAsync<ContentItemWithDetailsModel>();
            if (content != null)
            {
                content.Files = (await multi.ReadAsync<ContentFileModel>()).ToList();
                content.Categories = (await multi.ReadAsync<CategoryModel>()).ToList();
                content.HasAccess = (await multi.ReadSingleOrDefaultAsync<bool?>()) ?? false;
                content.IsInWishlist = (await multi.ReadSingleOrDefaultAsync<bool?>()) ?? false;
                content.UserProgress = await multi.ReadSingleOrDefaultAsync<UserProgressModel>();
            }

            return content ?? new ContentItemWithDetailsModel();
        }

        public async Task<int> CreateContentAsync(ContentItemModel content)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters(new
            {
                content.Title,
                content.Description,
                content.ContentType,
                content.SubType,
                content.OwnerUserId,
                content.OwnerRole,
                content.CourseId,
                content.ChapterId,
                content.IsPaid,
                content.Price,
                content.DiscountPrice,
                content.Currency,
                content.Language,
                content.Level,
                content.DurationMinutes,
                content.Pages,
                content.WordCount,
                content.IsFeatured,
                content.IsRecommended,
                content.Status
            });
            parameters.Add("@ContentId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("spContent_Create", parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@ContentId");
        }

        public async Task<bool> UpdateContentAsync(ContentItemModel content)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spContent_Update", new
            {
                content.ContentId,
                content.Title,
                content.Description,
                content.ContentType,
                content.SubType,
                content.IsPaid,
                content.Price,
                content.DiscountPrice,
                content.Currency,
                content.Language,
                content.Level,
                content.DurationMinutes,
                content.Pages,
                content.WordCount,
                content.IsFeatured,
                content.IsRecommended,
                content.Status,
                UpdatedAt = DateTime.UtcNow
            }, commandType: CommandType.StoredProcedure);

            return rows > 0;
        }

        public async Task<bool> DeleteContentAsync(int contentId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spContent_Delete",
                new { ContentId = contentId },
                commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<bool> UpdateContentStatusAsync(int contentId, string status)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spContent_UpdateStatus",
                new { ContentId = contentId, Status = status },
                commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<IEnumerable<ContentItemWithDetailsModel>> SearchContentAsync(
            string searchTerm = null, string contentType = null, int? categoryId = null,
            int page = 1, int pageSize = 20, int? userId = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<ContentItemWithDetailsModel>("spContent_Search", new
            {
                SearchTerm = searchTerm ?? "",
                ContentType = contentType ?? "",
                CategoryId = categoryId,
                PageNumber = page,
                PageSize = pageSize,
                UserId = userId
            }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ContentItemWithDetailsModel>> GetFeaturedContentAsync(int limit = 10)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<ContentItemWithDetailsModel>("spContent_GetFeatured",
                new { Limit = limit }, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> IncrementViewCountAsync(int contentId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spContent_IncrementViewCount",
                new { ContentId = contentId }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<bool> IncrementDownloadCountAsync(int contentId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spContent_IncrementDownloadCount",
                new { ContentId = contentId }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }


        #region Files

        public async Task<ContentFileModel> GetFileByIdAsync(int fileId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<ContentFileModel>("spFiles_GetById",
                new { FileId = fileId }, commandType: CommandType.StoredProcedure) ?? new ContentFileModel();
        }

        public async Task<IEnumerable<ContentFileModel>> GetContentFilesAsync(int contentId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<ContentFileModel>("spFiles_GetByContent",
                new { ContentId = contentId }, commandType: CommandType.StoredProcedure);
        }

        public async Task<int> AddContentFileAsync(ContentFileModel file)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters(new
            {
                file.ContentId,
                file.FileName,
                file.FileUrl,
                file.FilePath,
                file.MimeType,
                file.Extension,
                file.FileSize,
                file.DurationSec,
                file.Pages,
                file.Resolution,
                file.Bitrate,
                file.ThumbnailUrl,
                file.PreviewUrl,
                file.IsPrimary,
                file.SortOrder,
                file.UploadedBy
            });
            parameters.Add("@FileId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("spFiles_Create", parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@FileId");
        }

        public async Task<bool> SetPrimaryFileAsync(int contentId, int fileId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spFiles_SetPrimary",
                new { ContentId = contentId, FileId = fileId }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<bool> DeleteContentFileAsync(int fileId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spFiles_Delete",
                new { FileId = fileId }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<bool> UpdateFileAsync(ContentFileModel file)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spFiles_Update", new
            {
                file.FileId,
                file.FileName,
                file.FileUrl,
                file.FilePath,
                file.MimeType,
                file.Extension,
                file.FileSize,
                file.DurationSec,
                file.Pages,
                file.Resolution,
                file.Bitrate,
                file.ThumbnailUrl,
                file.PreviewUrl,
                file.IsPrimary,
                file.SortOrder
            }, commandType: CommandType.StoredProcedure);

            return rows > 0;
        }

        #endregion

        #region Categories

        public async Task<IEnumerable<CategoryModel>> GetAllCategoriesAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<CategoryModel>("spCategories_GetAll",
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<CategoryTreeItemModel>> GetCategoryTreeAsync(bool includeContentCount = false)
        {
            using var connection = _connectionFactory.CreateConnection();
            var categories = await connection.QueryAsync<CategoryTreeItemModel>("spCategories_GetTree",
                new { IncludeContentCount = includeContentCount }, commandType: CommandType.StoredProcedure);
            return BuildCategoryTree(categories.ToList());
        }

        public async Task<CategoryModel> GetCategoryByIdAsync(int categoryId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<CategoryModel>("spCategories_GetById",
                new { CategoryId = categoryId }, commandType: CommandType.StoredProcedure) ?? new CategoryModel();
        }

        public async Task<int> CreateCategoryAsync(CategoryModel category)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters(new
            {
                category.Name,
                category.Slug,
                category.Description,
                category.ParentCategoryId,
                category.IconUrl,
                category.IsActive,
                category.SortOrder
            });
            parameters.Add("@CategoryId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("spCategories_Create", parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@CategoryId");
        }

        public async Task<bool> UpdateCategoryAsync(CategoryModel category)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spCategories_Update", new
            {
                category.CategoryId,
                category.Name,
                category.Slug,
                category.Description,
                category.ParentCategoryId,
                category.IconUrl,
                category.IsActive,
                category.SortOrder
            }, commandType: CommandType.StoredProcedure);

            return rows > 0;
        }

        public async Task<bool> DeleteCategoryAsync(int categoryId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spCategories_Delete",
                new { CategoryId = categoryId }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<bool> AssignContentToCategoriesAsync(int contentId, List<int> categoryIds)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spContentCategories_Assign",
                new { ContentId = contentId, CategoryIds = ToDataTable(categoryIds) },
                commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<IEnumerable<int>> GetContentCategoryIdsAsync(int contentId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<int>("spContentCategories_GetIds",
                new { ContentId = contentId }, commandType: CommandType.StoredProcedure);
        }

        #endregion

        #region Courses

        public async Task<CourseModel> GetCourseByIdAsync(int courseId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<CourseModel>("spCourses_GetById",
                new { CourseId = courseId }, commandType: CommandType.StoredProcedure) ?? new CourseModel();
        }

        public async Task<CourseWithDetailsModel> GetCourseWithDetailsAsync(int courseId, int? userId = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var multi = await connection.QueryMultipleAsync("spCourses_GetWithDetails",
                new { CourseId = courseId, UserId = userId }, commandType: CommandType.StoredProcedure);

            var course = await multi.ReadSingleOrDefaultAsync<CourseWithDetailsModel>();
            if (course != null)
            {
                course.Chapters = (await multi.ReadAsync<ChapterModel>()).ToList();
                course.UserHasAccess = (await multi.ReadSingleOrDefaultAsync<bool?>()) ?? false;
                course.UserProgressPercent = await multi.ReadSingleOrDefaultAsync<decimal?>();
            }

            return course ?? new CourseWithDetailsModel();
        }

        public async Task<int> CreateCourseAsync(CourseModel course)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters(new
            {
                course.Title,
                course.Slug,
                course.Description,
                course.ShortDescription,
                course.CreatedBy,
                course.InstructorId,
                course.CategoryId,
                course.Price,
                course.DiscountPrice,
                course.IsPaid,
                course.Level,
                course.DurationHours,
                course.ThumbnailUrl,
                course.PreviewVideoUrl,
                course.Status
            });
            parameters.Add("@CourseId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("spCourses_Create", parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@CourseId");
        }

        public async Task<bool> UpdateCourseAsync(CourseModel course)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spCourses_Update", new
            {
                course.CourseId,
                course.Title,
                course.Slug,
                course.Description,
                course.ShortDescription,
                course.CategoryId,
                course.Price,
                course.DiscountPrice,
                course.IsPaid,
                course.Level,
                course.DurationHours,
                course.ThumbnailUrl,
                course.PreviewVideoUrl,
                course.Status,
                course.IsFeatured,
                UpdatedAt = DateTime.UtcNow
            }, commandType: CommandType.StoredProcedure);

            return rows > 0;
        }

        public async Task<bool> DeleteCourseAsync(int courseId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spCourses_Delete",
                new { CourseId = courseId }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<IEnumerable<CourseWithDetailsModel>> GetUserCoursesAsync(int userId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<CourseWithDetailsModel>("spCourses_GetByUser",
                new { UserId = userId }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<CourseWithDetailsModel>> GetPublishedCoursesAsync(int page = 1, int pageSize = 20)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<CourseWithDetailsModel>("spCourses_GetPublished",
                new { PageNumber = page, PageSize = pageSize }, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateCourseStatsAsync(int courseId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spCourses_UpdateStats",
                new { CourseId = courseId }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        #endregion

        #region Chapters

        public async Task<ChapterModel> GetChapterByIdAsync(int chapterId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<ChapterModel>("spChapters_GetById",
                new { ChapterId = chapterId }, commandType: CommandType.StoredProcedure) ?? new ChapterModel();
        }

        public async Task<ChapterWithDetailsModel> GetChapterWithDetailsAsync(int chapterId, int? userId = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var multi = await connection.QueryMultipleAsync("spChapters_GetWithDetails",
                new { ChapterId = chapterId, UserId = userId }, commandType: CommandType.StoredProcedure);

            var chapter = await multi.ReadSingleOrDefaultAsync<ChapterWithDetailsModel>();
            if (chapter != null)
            {
                chapter.Lessons = (await multi.ReadAsync<ContentItemWithDetailsModel>()).ToList();
                chapter.UserProgressPercent = await multi.ReadSingleOrDefaultAsync<decimal?>();
            }

            return chapter ?? new ChapterWithDetailsModel();
        }

        public async Task<IEnumerable<ChapterModel>> GetCourseChaptersAsync(int courseId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<ChapterModel>("spChapters_GetByCourse",
                new { CourseId = courseId }, commandType: CommandType.StoredProcedure);
        }

        public async Task<int> CreateChapterAsync(ChapterModel chapter)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters(new
            {
                chapter.CourseId,
                chapter.Title,
                chapter.Description,
                chapter.SortOrder,
                chapter.DurationMinutes,
                chapter.IsPreview
            });
            parameters.Add("@ChapterId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("spChapters_Create", parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@ChapterId");
        }

        public async Task<bool> UpdateChapterAsync(ChapterModel chapter)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spChapters_Update", new
            {
                chapter.ChapterId,
                chapter.Title,
                chapter.Description,
                chapter.SortOrder,
                chapter.DurationMinutes,
                chapter.IsPreview,
                UpdatedAt = DateTime.UtcNow
            }, commandType: CommandType.StoredProcedure);

            return rows > 0;
        }

        public async Task<bool> DeleteChapterAsync(int chapterId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spChapters_Delete",
                new { ChapterId = chapterId }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<bool> UpdateChapterOrderAsync(int chapterId, int sortOrder)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spChapters_UpdateOrder",
                new { ChapterId = chapterId, SortOrder = sortOrder }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        #endregion

        #region Ratings & Reviews

        public async Task<RatingReviewModel> GetRatingByIdAsync(int ratingId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<RatingReviewModel>("spRatings_GetById",
                new { RatingId = ratingId }, commandType: CommandType.StoredProcedure) ?? new RatingReviewModel();
        }

        public async Task<IEnumerable<RatingReviewModel>> GetContentRatingsAsync(int contentId, int page = 1, int pageSize = 10)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<RatingReviewModel>("spRatings_GetByContent",
                new { ContentId = contentId, PageNumber = page, PageSize = pageSize },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<RatingReviewModel> GetUserRatingForContentAsync(int contentId, int userId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<RatingReviewModel>("spRatings_GetUserRating",
                new { ContentId = contentId, UserId = userId }, commandType: CommandType.StoredProcedure) ?? new RatingReviewModel();
        }

        public async Task<int> AddRatingAsync(RatingReviewModel rating)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters(new
            {
                rating.ContentId,
                rating.UserId,
                rating.Rating,
                rating.ReviewTitle,
                rating.ReviewText
            });
            parameters.Add("@RatingId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("spRatings_Create", parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@RatingId");
        }

        public async Task<bool> UpdateRatingAsync(RatingReviewModel rating)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spRatings_Update", new
            {
                rating.RatingId,
                rating.Rating,
                rating.ReviewTitle,
                rating.ReviewText,
                UpdatedAt = DateTime.UtcNow
            }, commandType: CommandType.StoredProcedure);

            return rows > 0;
        }

        public async Task<bool> DeleteRatingAsync(int ratingId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spRatings_Delete",
                new { RatingId = ratingId }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<bool> ReportRatingAsync(int ratingId, string reason)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spRatings_Report",
                new { RatingId = ratingId, ReportReason = reason }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<bool> AddRatingReplyAsync(int ratingId, string reply, int repliedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spRatings_AddReply",
                new { RatingId = ratingId, ReplyText = reply, RepliedBy = repliedBy },
                commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<bool> MarkRatingAsHelpfulAsync(int ratingId, int userId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spRatings_MarkHelpful",
                new { RatingId = ratingId, UserId = userId }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        #endregion

        #region User Progress

        public async Task<UserProgressModel> GetUserProgressAsync(int contentId, int userId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<UserProgressModel>("spProgress_GetByContentUser",
                new { ContentId = contentId, UserId = userId }, commandType: CommandType.StoredProcedure) ?? new UserProgressModel();
        }

        public async Task<IEnumerable<UserProgressModel>> GetUserAllProgressAsync(int userId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<UserProgressModel>("spProgress_GetByUser",
                new { UserId = userId }, commandType: CommandType.StoredProcedure);
        }

        public async Task<int> CreateOrUpdateProgressAsync(UserProgressModel progress)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters(new
            {
                progress.UserId,
                progress.ContentId,
                progress.CourseId,
                progress.ChapterId,
                progress.ProgressPercent,
                progress.TimeSpentSec,
                progress.LastPositionSec,
                progress.IsCompleted,
                progress.Notes
            });
            parameters.Add("@ProgressId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("spProgress_CreateOrUpdate", parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@ProgressId");
        }

        public async Task<bool> UpdateProgressAsync(UserProgressModel progress)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spProgress_Update", new
            {
                progress.ProgressId,
                progress.ProgressPercent,
                progress.TimeSpentSec,
                progress.LastPositionSec,
                progress.IsCompleted,
                progress.Notes,
                UpdatedAt = DateTime.UtcNow
            }, commandType: CommandType.StoredProcedure);

            return rows > 0;
        }

        public async Task<bool> DeleteProgressAsync(int progressId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spProgress_Delete",
                new { ProgressId = progressId }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        #endregion

        #region Purchases

        public async Task<PurchaseModel> GetPurchaseByIdAsync(int purchaseId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<PurchaseModel>("spPurchases_GetById",
                new { PurchaseId = purchaseId }, commandType: CommandType.StoredProcedure) ?? new PurchaseModel();
        }

        public async Task<PurchaseModel> GetPurchaseByOrderIdAsync(string orderId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<PurchaseModel>("spPurchases_GetByOrderId",
                new { OrderId = orderId }, commandType: CommandType.StoredProcedure) ?? new PurchaseModel();
        }

        public async Task<IEnumerable<PurchaseModel>> GetUserPurchasesAsync(int userId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<PurchaseModel>("spPurchases_GetByUser",
                new { UserId = userId }, commandType: CommandType.StoredProcedure);
        }

        public async Task<int> CreatePurchaseAsync(PurchaseModel purchase)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters(new
            {
                purchase.UserId,
                purchase.ContentId,
                purchase.OrderId,
                purchase.Amount,
                purchase.Currency,
                purchase.PaymentMethod,
                purchase.PaymentStatus,
                purchase.AccessType,
                purchase.AccessExpiry,
                purchase.TransactionId,
                purchase.PaymentGateway,
                purchase.GatewayResponse
            });
            parameters.Add("@PurchaseId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("spPurchases_Create", parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@PurchaseId");
        }

        public async Task<bool> UpdatePurchaseStatusAsync(int purchaseId, string status)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spPurchases_UpdateStatus",
                new { PurchaseId = purchaseId, PaymentStatus = status }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<bool> ProcessRefundAsync(int purchaseId, decimal amount, string reason)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spPurchases_ProcessRefund",
                new { PurchaseId = purchaseId, RefundAmount = amount, RefundReason = reason },
                commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<bool> CheckUserPurchaseAsync(int contentId, int userId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var count = await connection.ExecuteScalarAsync<int>("spPurchases_CheckUserPurchase",
                new { ContentId = contentId, UserId = userId }, commandType: CommandType.StoredProcedure);
            return count > 0;
        }

        public async Task<bool> HasUserAccessAsync(int contentId, int userId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.ExecuteScalarAsync<bool>("spContent_CheckUserAccess",
                new { ContentId = contentId, UserId = userId }, commandType: CommandType.StoredProcedure);
        }

        #endregion

        #region Wishlist

        public async Task<WishlistItemModel> GetWishlistItemAsync(int contentId, int userId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<WishlistItemModel>("spWishlist_GetItem",
                new { ContentId = contentId, UserId = userId }, commandType: CommandType.StoredProcedure) ?? new WishlistItemModel();
        }

        public async Task<IEnumerable<ContentItemWithDetailsModel>> GetUserWishlistAsync(int userId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<ContentItemWithDetailsModel>("spWishlist_GetByUser",
                new { UserId = userId }, commandType: CommandType.StoredProcedure);
        }

        public async Task<int> AddToWishlistAsync(WishlistItemModel item)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters(new
            {
                item.UserId,
                item.ContentId,
                item.Notes
            });
            parameters.Add("@WishlistId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("spWishlist_Create", parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@WishlistId");
        }

        public async Task<bool> RemoveFromWishlistAsync(int contentId, int userId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spWishlist_Remove",
                new { ContentId = contentId, UserId = userId }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<bool> ClearUserWishlistAsync(int userId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spWishlist_ClearUser",
                new { UserId = userId }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        #endregion

        #region Workflow Methods

        public async Task<IEnumerable<WorkflowItemModel>> GetContentWorkflowAsync(int contentId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<WorkflowItemModel>("spWorkflow_GetByContent",
                new { ContentId = contentId }, commandType: CommandType.StoredProcedure);
        }

        public async Task<int> AddWorkflowStepAsync(WorkflowItemModel workflow)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters(new
            {
                workflow.ContentId,
                workflow.AssignedToUserId,
                workflow.RoleName,
                workflow.Status,
                workflow.PreviousStatus,
                workflow.Comments,
                workflow.Notes,
                workflow.PerformedBy,
                workflow.PerformedAt,
                workflow.DueDate
            });
            parameters.Add("@WorkflowId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("spWorkflow_Create", parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@WorkflowId");
        }

        public async Task<bool> UpdateWorkflowStepAsync(int workflowId, string status, string notes = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spWorkflow_Update",
                new { WorkflowId = workflowId, Status = status, Notes = notes, CompletedAt = DateTime.UtcNow },
                commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<bool> AssignWorkflowAsync(int contentId, int assignedToUserId, string roleName)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spWorkflow_Assign",
                new { ContentId = contentId, AssignedToUserId = assignedToUserId, RoleName = roleName },
                commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        #endregion

        #region Analytics

        public async Task<ContentAnalyticsModel> GetContentAnalyticsAsync(int contentId)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var multi = await connection.QueryMultipleAsync("spAnalytics_GetContentAnalytics",
                new { ContentId = contentId }, commandType: CommandType.StoredProcedure);

            var analytics = await multi.ReadSingleOrDefaultAsync<ContentAnalyticsModel>();
            if (analytics != null)
            {
                analytics.DailyStats = (await multi.ReadAsync<DailyStatModel>()).ToList();
                analytics.RatingDistribution = (await multi.ReadAsync<RatingDistributionModel>()).ToList();
            }

            return analytics ?? new ContentAnalyticsModel();
        }

        public async Task<DashboardStatsModel> GetDashboardStatsAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var multi = await connection.QueryMultipleAsync("spAnalytics_GetDashboardStats",
                new { StartDate = startDate, EndDate = endDate }, commandType: CommandType.StoredProcedure);

            var stats = await multi.ReadSingleOrDefaultAsync<DashboardStatsModel>();
            if (stats != null)
            {
                var contentByType = await multi.ReadAsync<dynamic>();
                stats.ContentByType = contentByType
                    .ToDictionary(x => (string)x.ContentType, x => (int)x.Count);
                stats.RevenueTrend = (await multi.ReadAsync<DailyStatModel>()).ToList();
            }

            return stats ?? new DashboardStatsModel();
        }

        public async Task<IEnumerable<DailyStatModel>> GetDailyStatsAsync(int contentId, int days = 30)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<DailyStatModel>("spAnalytics_GetDailyStats",
                new { ContentId = contentId, Days = days }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ContentStatModel>> GetTopContentAsync(int limit = 10, string period = "month")
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<ContentStatModel>("spAnalytics_GetTopContent",
                new { Limit = limit, Period = period }, commandType: CommandType.StoredProcedure);
        }

        public async Task<UserContentAnalyticsModel> GetUserContentAnalyticsAsync(int userId)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var multi = await connection.QueryMultipleAsync("spAnalytics_GetUserAnalytics",
                new { UserId = userId }, commandType: CommandType.StoredProcedure);

            var analytics = await multi.ReadSingleOrDefaultAsync<UserContentAnalyticsModel>();
            if (analytics != null)
            {
                analytics.TopContent = (await multi.ReadAsync<ContentStatModel>()).ToList();
            }

            return analytics ?? new UserContentAnalyticsModel();
        }

        #endregion

        #region Content Relationships

        public async Task<bool> AddContentToCourseAsync(int contentId, int courseId, int? chapterId = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spContent_AddToCourse",
                new { ContentId = contentId, CourseId = courseId, ChapterId = chapterId },
                commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<bool> RemoveContentFromCourseAsync(int contentId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var rows = await connection.ExecuteAsync("spContent_RemoveFromCourse",
                new { ContentId = contentId }, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }

        public async Task<IEnumerable<ContentItemWithDetailsModel>> GetCourseContentAsync(int courseId, int? userId = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<ContentItemWithDetailsModel>("spContent_GetByCourse",
                new { CourseId = courseId, UserId = userId }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ContentItemWithDetailsModel>> GetChapterContentAsync(int chapterId, int? userId = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<ContentItemWithDetailsModel>("spContent_GetByChapter",
                new { ChapterId = chapterId, UserId = userId }, commandType: CommandType.StoredProcedure);
        }

        #endregion

        #region Helper Methods

        private List<CategoryTreeItemModel> BuildCategoryTree(List<CategoryTreeItemModel> categories)
        {
            var lookup = categories.ToDictionary(c => c.CategoryId);
            var rootCategories = new List<CategoryTreeItemModel>();

            foreach (var category in categories)
            {
                if (category.ParentCategoryId.HasValue && lookup.ContainsKey(category.ParentCategoryId.Value))
                {
                    var parent = lookup[category.ParentCategoryId.Value];
                    parent.SubCategories.Add(category);
                    category.Level = parent.Level + 1;
                }
                else
                {
                    category.Level = 0;
                    rootCategories.Add(category);
                }
            }

            return rootCategories;
        }

        private DataTable ToDataTable(List<int> ids)
        {
            var table = new DataTable();
            table.Columns.Add("Id", typeof(int));
            if (ids != null)
            {
                foreach (var id in ids)
                {
                    table.Rows.Add(id);
                }
            }
            return table;
        }

        #endregion
    }
}
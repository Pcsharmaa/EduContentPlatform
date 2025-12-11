// Models/Content/ContentModels.cs
using System;
using System.Collections.Generic;

namespace EduContentPlatform.Models.Content
{
    public class ContentItemModel
    {
        public int ContentId { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }
        public string ContentType { get; set; } // 'book', 'video', 'pdf', 'course', 'article', 'researchpaper'
        public string SubType { get; set; } // 'lecture', 'tutorial', 'research', 'review'
        public int OwnerUserId { get; set; }
        public string OwnerRole { get; set; }
        public int? CourseId { get; set; }
        public int? ChapterId { get; set; }
        public bool IsPaid { get; set; }
        public decimal? Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public string Currency { get; set; } = "USD";
        public decimal? RatingAvg { get; set; }
        public int RatingCount { get; set; }
        public int ViewCount { get; set; }
        public int DownloadCount { get; set; }
        public string Status { get; set; } = "Draft"; // Draft/Pending/Approved/Published/Rejected/Archived
        public string Language { get; set; } = "en";
        public string Level { get; set; } // Beginner/Intermediate/Advanced
        public int? DurationMinutes { get; set; }
        public int? Pages { get; set; }
        public int? WordCount { get; set; }
        public bool IsFeatured { get; set; }
        public int? FeaturedOrder { get; set; }
        public bool IsRecommended { get; set; }
        public DateTime? PublishedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    public class ContentItemWithDetailsModel : ContentItemModel
    {
        public string OwnerDisplayName { get; set; }
        public string OwnerProfileImage { get; set; }
        public bool HasAccess { get; set; }
        public bool IsInWishlist { get; set; }
        public List<ContentFileModel> Files { get; set; } = new();
        public List<CategoryModel> Categories { get; set; } = new();
        public List<RatingReviewModel> Ratings { get; set; } = new();
        public UserProgressModel UserProgress { get; set; }
    }

    public class ContentFileModel
    {
        public int FileId { get; set; }
        public int ContentId { get; set; }
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public string FilePath { get; set; }
        public string MimeType { get; set; }
        public string Extension { get; set; }
        public long FileSize { get; set; }
        public int? DurationSec { get; set; }
        public int? Pages { get; set; }
        public string Resolution { get; set; }
        public int? Bitrate { get; set; }
        public string ThumbnailUrl { get; set; }
        public string PreviewUrl { get; set; }
        public bool IsPrimary { get; set; }
        public int SortOrder { get; set; }
        public int Version { get; set; }
        public int UploadedBy { get; set; }
        public string UploaderName { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
    }

    public class CategoryModel
    {
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }
        public int? ParentCategoryId { get; set; }
        public string IconUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
    }

    public class CategoryTreeItemModel : CategoryModel
    {
        public List<CategoryTreeItemModel> SubCategories { get; set; } = new();
        public int Level { get; set; }
        public string Path { get; set; }
        public int ContentCount { get; set; }
    }

    public class CourseModel
    {
        public int CourseId { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public int CreatedBy { get; set; }
        public int InstructorId { get; set; }
        public int? CategoryId { get; set; }
        public decimal? Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public bool IsPaid { get; set; }
        public string Level { get; set; }
        public decimal? DurationHours { get; set; }
        public int LessonsCount { get; set; }
        public int StudentsCount { get; set; }
        public decimal? RatingAvg { get; set; }
        public int RatingCount { get; set; }
        public string ThumbnailUrl { get; set; }
        public string PreviewVideoUrl { get; set; }
        public string Status { get; set; } = "Draft";
        public bool IsFeatured { get; set; }
        public bool IsPublished { get; set; }
        public DateTime? PublishedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    public class CourseWithDetailsModel : CourseModel
    {
        public string InstructorName { get; set; }
        public string InstructorBio { get; set; }
        public string InstructorImage { get; set; }
        public string CategoryName { get; set; }
        public int ChaptersCount { get; set; }
        public bool UserHasAccess { get; set; }
        public decimal? UserProgressPercent { get; set; }
        public List<ChapterModel> Chapters { get; set; } = new();
        public List<ContentItemWithDetailsModel> Lessons { get; set; } = new();
    }

    public class ChapterModel
    {
        public int ChapterId { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int SortOrder { get; set; }
        public int? DurationMinutes { get; set; }
        public bool IsPreview { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    public class ChapterWithDetailsModel : ChapterModel
    {
        public decimal? UserProgressPercent { get; set; }
        public List<ContentItemWithDetailsModel> Lessons { get; set; } = new();
    }

    public class RatingReviewModel
    {
        public int RatingId { get; set; }
        public int ContentId { get; set; }
        public int UserId { get; set; }
        public string UserDisplayName { get; set; }
        public string UserProfileImage { get; set; }
        public int Rating { get; set; }
        public string ReviewTitle { get; set; }
        public string ReviewText { get; set; }
        public bool IsVerified { get; set; }
        public int HelpfulCount { get; set; }
        public string ReplyText { get; set; }
        public int? RepliedBy { get; set; }
        public string ReplierName { get; set; }
        public DateTime? RepliedAt { get; set; }
        public bool IsEdited { get; set; }
        public DateTime? EditedAt { get; set; }
        public bool IsReported { get; set; }
        public string ReportReason { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    public class UserProgressModel
    {
        public int ProgressId { get; set; }
        public int UserId { get; set; }
        public int ContentId { get; set; }
        public int? CourseId { get; set; }
        public int? ChapterId { get; set; }
        public decimal ProgressPercent { get; set; }
        public int TimeSpentSec { get; set; }
        public int? LastPositionSec { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? LastAccessedAt { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    public class PurchaseModel
    {
        public int PurchaseId { get; set; }
        public int UserId { get; set; }
        public int ContentId { get; set; }
        public string OrderId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; } = "Pending"; // Pending/Completed/Failed/Refunded
        public string AccessType { get; set; } = "Purchased"; // Purchased/Granted/Free/Trial
        public DateTime? AccessExpiry { get; set; }
        public string TransactionId { get; set; }
        public string PaymentGateway { get; set; }
        public string GatewayResponse { get; set; }
        public bool IsRefunded { get; set; }
        public decimal? RefundAmount { get; set; }
        public string RefundReason { get; set; }
        public DateTime? RefundedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class WishlistItemModel
    {
        public int WishlistId { get; set; }
        public int UserId { get; set; }
        public int ContentId { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class WorkflowItemModel
    {
        public int WorkflowId { get; set; }
        public int ContentId { get; set; }
        public int? AssignedToUserId { get; set; }
        public string AssignedToName { get; set; }
        public string RoleName { get; set; }
        public string Status { get; set; }
        public string PreviousStatus { get; set; }
        public string Comments { get; set; }
        public string Notes { get; set; }
        public int? PerformedBy { get; set; }
        public string PerformerName { get; set; }
        public DateTime? PerformedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    // Request/Response DTOs
    public class CreateContentRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string ContentType { get; set; }
        public string SubType { get; set; }
        public int? CourseId { get; set; }
        public int? ChapterId { get; set; }
        public bool IsPaid { get; set; }
        public decimal? Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public string Currency { get; set; } = "USD";
        public string Language { get; set; } = "en";
        public string Level { get; set; }
        public int? DurationMinutes { get; set; }
        public int? Pages { get; set; }
        public int? WordCount { get; set; }
        public List<int> CategoryIds { get; set; } = new();
        public List<FileUploadRequest> Files { get; set; } = new();
        public bool IsFeatured { get; set; }
        public bool IsRecommended { get; set; }
    }

    public class UpdateContentRequest : CreateContentRequest
    {
        public int ContentId { get; set; }
    }

    public class FileUploadRequest
    {
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public string FilePath { get; set; }
        public string MimeType { get; set; }
        public long FileSize { get; set; }
        public int? DurationSec { get; set; }
        public int? Pages { get; set; }
        public string Resolution { get; set; }
        public int? Bitrate { get; set; }
        public string ThumbnailUrl { get; set; }
        public string PreviewUrl { get; set; }
        public bool IsPrimary { get; set; }
        public int SortOrder { get; set; }
    }

    public class CreateCourseRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public int? CategoryId { get; set; }
        public decimal? Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public bool IsPaid { get; set; }
        public string Level { get; set; }
        public string ThumbnailUrl { get; set; }
        public string PreviewVideoUrl { get; set; }
        public List<ChapterRequest> Chapters { get; set; } = new();
    }

    public class ChapterRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int SortOrder { get; set; }
        public bool IsPreview { get; set; }
        public List<CreateContentRequest> Lessons { get; set; } = new();
    }

    public class UpdateProgressRequest
    {
        public decimal ProgressPercent { get; set; }
        public int? LastPositionSec { get; set; }
    }

    public class AddRatingRequest
    {
        public int Rating { get; set; }
        public string ReviewTitle { get; set; }
        public string ReviewText { get; set; }
    }

    public class PaymentRequest
    {
        public string PaymentMethod { get; set; }
        public string CardToken { get; set; }
        public string PaymentGateway { get; set; } = "Stripe";
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public string ReturnUrl { get; set; }
    }

    public class WorkflowActionRequest
    {
        public string Notes { get; set; }
        public string Reason { get; set; }
    }

    public class SearchRequest
    {
        public string Query { get; set; }
        public string ContentType { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    public class SearchResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }

    public class ContentAnalyticsModel
    {
        public int ContentId { get; set; }
        public string Title { get; set; }
        public int TotalViews { get; set; }
        public int TotalDownloads { get; set; }
        public int TotalPurchases { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalRatings { get; set; }
        public decimal AverageRating { get; set; }
        public int WishlistCount { get; set; }
        public int TotalTimeSpent { get; set; }
        public decimal CompletionRate { get; set; }
        public List<DailyStatModel> DailyStats { get; set; } = new();
        public List<RatingDistributionModel> RatingDistribution { get; set; } = new();
    }

    public class UserContentAnalyticsModel
    {
        public int UserId { get; set; }
        public int TotalContentCreated { get; set; }
        public int TotalContentPublished { get; set; }
        public int TotalCoursesCreated { get; set; }
        public int TotalStudents { get; set; }
        public decimal AverageRating { get; set; }
        public decimal TotalRevenue { get; set; }
        public List<ContentStatModel> TopContent { get; set; } = new();
    }

    public class DailyStatModel
    {
        public DateTime Date { get; set; }
        public int Views { get; set; }
        public int Downloads { get; set; }
        public int Purchases { get; set; }
        public decimal Revenue { get; set; }
    }

    public class RatingDistributionModel
    {
        public int Rating { get; set; }
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }

    public class ContentStatModel
    {
        public int ContentId { get; set; }
        public string Title { get; set; }
        public int Views { get; set; }
        public int Purchases { get; set; }
        public decimal Revenue { get; set; }
        public decimal Rating { get; set; }
    }

    public class DashboardStatsModel
    {
        public int TotalContent { get; set; }
        public int TotalCourses { get; set; }
        public int TotalUsers { get; set; }
        public int TotalPurchases { get; set; }
        public decimal TotalRevenue { get; set; }
        public int ActiveUsers { get; set; }
        public Dictionary<string, int> ContentByType { get; set; } = new();
        public List<DailyStatModel> RevenueTrend { get; set; } = new();
    }

    public class DownloadRecordModel
    {
        public int DownloadId { get; set; }
        public int UserId { get; set; }
        public int ContentId { get; set; }
        public int FileId { get; set; }
        public DateTime DownloadedAt { get; set; } = DateTime.UtcNow;
        public string FileName { get; set; }
        public string ContentTitle { get; set; }
    }
}
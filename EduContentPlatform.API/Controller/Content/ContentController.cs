using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EduContentPlatform.Services.Content;
using EduContentPlatform.Models.Content;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EduContentPlatform.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ContentController : ControllerBase
    {
        private readonly IContentService _contentService;
        private readonly ILogger<ContentController> _logger;

        public ContentController(IContentService contentService, ILogger<ContentController> logger)
        {
            _contentService = contentService;
            _logger = logger;
        }

        private int GetUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return string.IsNullOrWhiteSpace(idClaim) ? 0 : int.Parse(idClaim);
        }

        #region Content CRUD

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetContentById(int id)
        {
            try
            {
                var content = await _contentService.GetContentByIdAsync(id);
                if (content == null) return NotFound(new { success = false, message = "Content not found" });
                return Ok(new { success = true, data = content });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetContentById failed for id: {Id}", id);
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // Optional: endpoint to get content with user-specific details (uses interface method that accepts userId)
        [HttpGet("{id}/details")]
        [AllowAnonymous]
        public async Task<IActionResult> GetContentWithDetails(int id)
        {
            try
            {
                int? userId = User.Identity.IsAuthenticated ? (int?)GetUserId() : null;
                var content = await _contentService.GetContentWithDetailsAsync(id, userId);
                if (content == null) return NotFound(new { success = false, message = "Content not found" });
                return Ok(new { success = true, data = content });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetContentWithDetails failed for id: {Id}", id);
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateContent([FromBody] ContentItemModel content)
        {
            try
            {
                if (content == null) return BadRequest(new { success = false, message = "Content model is required" });

                var newId = await _contentService.CreateContentAsync(content);
                return CreatedAtAction(nameof(GetContentById), new { id = newId }, new { success = true, id = newId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CreateContent failed");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContent(int id, [FromBody] ContentItemModel content)
        {
            try
            {
                if (content == null) return BadRequest(new { success = false, message = "Content model is required" });

                // If model has an Id property set by name ContentId or Id, set it. We'll assume ContentItemModel has ContentId.
                // This avoids mismatch between route id and payload.
                var contentIdProp = content.GetType().GetProperty("ContentId");
                if (contentIdProp != null) contentIdProp.SetValue(content, id);

                var result = await _contentService.UpdateContentAsync(content);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateContent failed for id: {Id}", id);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContent(int id)
        {
            try
            {
                var result = await _contentService.DeleteContentAsync(id);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteContent failed for id: {Id}", id);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateContentStatus(int id, [FromQuery] string status)
        {
            try
            {
                var result = await _contentService.UpdateContentStatusAsync(id, status);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateContentStatus failed for id: {Id}", id);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchContent(
            [FromQuery] string searchTerm = null,
            [FromQuery] string contentType = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                int? userId = User.Identity.IsAuthenticated ? (int?)GetUserId() : null;
                var result = await _contentService.SearchContentAsync(searchTerm, contentType, categoryId, page, pageSize, userId);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SearchContent failed: {SearchTerm}", searchTerm);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("featured")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFeaturedContent([FromQuery] int limit = 10)
        {
            try
            {
                var result = await _contentService.GetFeaturedContentAsync(limit);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetFeaturedContent failed");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("{id}/increment-view")]
        public async Task<IActionResult> IncrementViewCount(int id)
        {
            try
            {
                var result = await _contentService.IncrementViewCountAsync(id);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "IncrementViewCount failed for id: {Id}", id);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("{id}/increment-download")]
        public async Task<IActionResult> IncrementDownloadCount(int id)
        {
            try
            {
                var result = await _contentService.IncrementDownloadCountAsync(id);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "IncrementDownloadCount failed for id: {Id}", id);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        #endregion

        #region Files

        [HttpGet("{contentId}/files")]
        [AllowAnonymous]
        public async Task<IActionResult> GetContentFiles(int contentId)
        {
            try
            {
                var files = await _contentService.GetContentFilesAsync(contentId);
                return Ok(new { success = true, data = files });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetContentFiles failed for contentId: {ContentId}", contentId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("files/{fileId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFileById(int fileId)
        {
            try
            {
                var file = await _contentService.GetFileByIdAsync(fileId);
                if (file == null) return NotFound(new { success = false, message = "File not found" });
                return Ok(new { success = true, data = file });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetFileById failed for fileId: {FileId}", fileId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // Note: interface expects ContentFileModel. Accept body and set ContentId from route when present.
        [HttpPost("{contentId}/files")]
        public async Task<IActionResult> AddFile(int contentId, [FromBody] ContentFileModel file)
        {
            try
            {
                if (file == null) return BadRequest(new { success = false, message = "File model is required" });

                var contentIdProp = file.GetType().GetProperty("ContentId");
                if (contentIdProp != null) contentIdProp.SetValue(file, contentId);

                var newFileId = await _contentService.AddContentFileAsync(file);
                return CreatedAtAction(nameof(GetFileById), new { fileId = newFileId }, new { success = true, id = newFileId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddFile failed for contentId: {ContentId}", contentId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{contentId}/files/{fileId}/primary")]
        public async Task<IActionResult> SetPrimaryFile(int contentId, int fileId)
        {
            try
            {
                var result = await _contentService.SetPrimaryFileAsync(contentId, fileId);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SetPrimaryFile failed for contentId: {ContentId}, fileId: {FileId}", contentId, fileId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("files/{fileId}")]
        public async Task<IActionResult> DeleteFile(int fileId)
        {
            try
            {
                var result = await _contentService.DeleteContentFileAsync(fileId);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteFile failed for fileId: {FileId}", fileId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("files/{fileId}")]
        public async Task<IActionResult> UpdateFile(int fileId, [FromBody] ContentFileModel file)
        {
            try
            {
                if (file == null) return BadRequest(new { success = false, message = "File model is required" });

                var fileIdProp = file.GetType().GetProperty("FileId");
                if (fileIdProp != null) fileIdProp.SetValue(file, fileId);

                var result = await _contentService.UpdateFileAsync(file);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateFile failed for fileId: {FileId}", fileId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        #endregion

        #region Categories

        [HttpGet("categories")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _contentService.GetAllCategoriesAsync();
                return Ok(new { success = true, data = categories });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetCategories failed");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("categories/tree")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategoryTree([FromQuery] bool includeContentCount = false)
        {
            try
            {
                var tree = await _contentService.GetCategoryTreeAsync(includeContentCount);
                return Ok(new { success = true, data = tree });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetCategoryTree failed");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("categories")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryModel category)
        {
            try
            {
                if (category == null) return BadRequest(new { success = false, message = "Category model is required" });

                var newId = await _contentService.CreateCategoryAsync(category);
                return Ok(new { success = true, id = newId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CreateCategory failed");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("categories/{categoryId}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> UpdateCategory(int categoryId, [FromBody] CategoryModel category)
        {
            try
            {
                var categoryIdProp = category.GetType().GetProperty("CategoryId");
                if (categoryIdProp != null) categoryIdProp.SetValue(category, categoryId);

                var result = await _contentService.UpdateCategoryAsync(category);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateCategory failed for id: {CategoryId}", categoryId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("categories/{categoryId}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> DeleteCategory(int categoryId)
        {
            try
            {
                var result = await _contentService.DeleteCategoryAsync(categoryId);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteCategory failed for id: {CategoryId}", categoryId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{contentId}/categories")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> UpdateContentCategories(int contentId, [FromBody] List<int> categoryIds)
        {
            try
            {
                var result = await _contentService.AssignContentToCategoriesAsync(contentId, categoryIds);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateContentCategories failed for contentId: {ContentId}", contentId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        #endregion

        #region Courses

        [HttpGet("courses/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCourseById(int id)
        {
            try
            {
                var course = await _contentService.GetCourseByIdAsync(id);
                if (course == null) return NotFound(new { success = false, message = "Course not found" });
                return Ok(new { success = true, data = course });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetCourseById failed for id: {Id}", id);
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("courses/{id}/details")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCourseWithDetails(int id)
        {
            try
            {
                int? userId = User.Identity.IsAuthenticated ? (int?)GetUserId() : null;
                var course = await _contentService.GetCourseWithDetailsAsync(id, userId);
                if (course == null) return NotFound(new { success = false, message = "Course not found" });
                return Ok(new { success = true, data = course });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetCourseWithDetails failed for id: {Id}", id);
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("courses")]
        [Authorize(Roles = "Teacher,Instructor")]
        public async Task<IActionResult> CreateCourse([FromBody] CourseModel course)
        {
            try
            {
                var newId = await _contentService.CreateCourseAsync(course);
                return CreatedAtAction(nameof(GetCourseById), new { id = newId }, new { success = true, id = newId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CreateCourse failed");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("courses/my")]
        public async Task<IActionResult> GetMyCourses()
        {
            try
            {
                var userId = GetUserId();
                var result = await _contentService.GetUserCoursesAsync(userId);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetMyCourses failed");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("courses/published")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublishedCourses([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var result = await _contentService.GetPublishedCoursesAsync(page, pageSize);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetPublishedCourses failed");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        #endregion

        #region Progress

        [HttpPost("{contentId}/progress")]
        public async Task<IActionResult> CreateOrUpdateProgress(int contentId, [FromBody] UserProgressModel progress)
        {
            try
            {
                if (progress == null) return BadRequest(new { success = false, message = "Progress model is required" });

                var contentIdProp = progress.GetType().GetProperty("ContentId");
                if (contentIdProp != null) contentIdProp.SetValue(progress, contentId);

                var userIdProp = progress.GetType().GetProperty("UserId");
                if (userIdProp != null) userIdProp.SetValue(progress, GetUserId());

                var newId = await _contentService.CreateOrUpdateProgressAsync(progress);
                return Ok(new { success = true, id = newId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CreateOrUpdateProgress failed for contentId: {ContentId}", contentId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("progress/my")]
        public async Task<IActionResult> GetMyProgress()
        {
            try
            {
                var userId = GetUserId();
                var result = await _contentService.GetUserAllProgressAsync(userId);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetMyProgress failed");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        #endregion

        #region Ratings

        [HttpPost("{contentId}/ratings")]
        public async Task<IActionResult> AddRating(int contentId, [FromBody] RatingReviewModel rating)
        {
            try
            {
                if (rating == null) return BadRequest(new { success = false, message = "Rating model is required" });

                var contentIdProp = rating.GetType().GetProperty("ContentId");
                if (contentIdProp != null) contentIdProp.SetValue(rating, contentId);

                var userIdProp = rating.GetType().GetProperty("UserId");
                if (userIdProp != null) userIdProp.SetValue(rating, GetUserId());

                var newId = await _contentService.AddRatingAsync(rating);
                return Ok(new { success = true, id = newId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddRating failed for contentId: {ContentId}", contentId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{contentId}/ratings")]
        [AllowAnonymous]
        public async Task<IActionResult> GetContentRatings(int contentId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var ratings = await _contentService.GetContentRatingsAsync(contentId, page, pageSize);
                return Ok(new { success = true, data = ratings });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetContentRatings failed for contentId: {ContentId}", contentId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        #endregion

        #region Wishlist

        [HttpPost("{contentId}/wishlist")]
        public async Task<IActionResult> AddToWishlist(int contentId, [FromBody] WishlistItemModel item)
        {
            try
            {
                if (item == null) item = new WishlistItemModel();

                var contentIdProp = item.GetType().GetProperty("ContentId");
                if (contentIdProp != null) contentIdProp.SetValue(item, contentId);

                var userIdProp = item.GetType().GetProperty("UserId");
                if (userIdProp != null) userIdProp.SetValue(item, GetUserId());

                var newId = await _contentService.AddToWishlistAsync(item);
                return Ok(new { success = true, id = newId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddToWishlist failed for contentId: {ContentId}", contentId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{contentId}/wishlist")]
        public async Task<IActionResult> RemoveFromWishlist(int contentId)
        {
            try
            {
                var userId = GetUserId();
                var result = await _contentService.RemoveFromWishlistAsync(contentId, userId);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "RemoveFromWishlist failed for contentId: {ContentId}", contentId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("wishlist/my")]
        public async Task<IActionResult> GetMyWishlist()
        {
            try
            {
                var userId = GetUserId();
                var result = await _contentService.GetUserWishlistAsync(userId);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetMyWishlist failed");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        #endregion

        #region Access Check

        [HttpGet("{contentId}/access")]
        public async Task<IActionResult> CheckAccess(int contentId)
        {
            try
            {
                var userId = GetUserId();
                var hasAccess = await _contentService.HasUserAccessAsync(contentId, userId);
                return Ok(new { success = true, hasAccess });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CheckAccess failed for contentId: {ContentId}", contentId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        #endregion

        [HttpGet("health")]
        [AllowAnonymous]
        public IActionResult HealthCheck()
        {
            return Ok(new
            {
                success = true,
                message = "Content API is running",
                timestamp = DateTime.UtcNow,
                version = "1.0"
            });
        }
    }
}

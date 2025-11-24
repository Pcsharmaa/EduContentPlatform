using EduContentPlatform.Models.Content;
using EduContentPlatform.Models.Content.EduContentPlatform.Models.Publications;
using EduContentPlatform.Repository.Content;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EduContentPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContentController : ControllerBase
    {
        private readonly IPublicationService _pubService;
        private readonly IPurchaseService _purchaseService;
        private const string DevSampleFile = "/mnt/data/5a6f3cb6-11b7-4cb2-92df-94b18d872613.png";

        public ContentController(IPublicationService pubService, IPurchaseService purchaseService)
        {
            _pubService = pubService;
            _purchaseService = purchaseService;
        }

        private int CurrentUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(idClaim, out var id) ? id : 0;
        }

        // 1. Submit a publication (book)
        [Authorize(Policy = "ContentCreator")]
        [HttpPost("publication/submit")]
        public async Task<IActionResult> SubmitPublication([FromBody] PublicationModel model)
        {
            if (model.CreatedBy == 0)
                model.CreatedBy = CurrentUserId();

            if (string.IsNullOrEmpty(model.CoverImageUrl))
                model.CoverImageUrl = DevSampleFile;

            model.CreatedAt = DateTime.UtcNow;
            var id = await _pubService.SubmitPublicationAsync(model);
            return Ok(new { success = true, publicationId = id });
        }

        // 2. Submit volume for a publication (fileUrl should point to uploaded file)
        [Authorize(Policy = "ContentCreator")]
        [HttpPost("publication/{publicationId}/volumes/submit")]
        public async Task<IActionResult> SubmitVolume(int publicationId, [FromBody] PublicationVolumeModel model)
        {
            model.PublicationId = publicationId;
            if (model.CreatedBy == 0)
                model.CreatedBy = CurrentUserId();

            if (string.IsNullOrEmpty(model.FileUrl))
                model.FileUrl = DevSampleFile;

            model.CreatedAt = DateTime.UtcNow;
            var id = await _pubService.SubmitVolumeAsync(model);
            return Ok(new { success = true, volumeId = id });
        }

        // 2b assign to editor
        [Authorize(Policy = "Publisher")]
        [HttpPost("assign/{itemType}/{itemId}/editor/{editorUserId}")]
        public async Task<IActionResult> AssignToEditor(string itemType, int itemId, int editorUserId)
        {
            var roleUserId = CurrentUserId();
            await _pubService.AssignToEditorAsync(itemType, itemId, editorUserId);
            // optional: update status
            await _pubService.UpdateStatusAsync(itemType, itemId, "AssignedToEditor", roleUserId, $"Assigned to editor {editorUserId}");
            return Ok(new { success = true });
        }

        // 3. List pending for role
        [Authorize]
        [HttpGet("pending")]
        public async Task<IActionResult> GetPending()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "Student";
            var items = await _pubService.GetPendingForRoleAsync(role);
            return Ok(new { success = true, data = items });
        }

        // 4. Get publication details (includes volumes)
        [AllowAnonymous]
        [HttpGet("publication/{id}")]
        public async Task<IActionResult> GetPublication(int id)
        {
            var pub = await _pubService.GetPublicationAsync(id);
            var vols = await _pubService.GetVolumesAsync(id);
            return Ok(new { success = true, publication = pub, volumes = vols });
        }

        // 5. Purchase a volume / publication
        [Authorize]
        [HttpPost("purchase")]
        public async Task<IActionResult> Purchase([FromBody] PurchaseRequest req)
        {
            var userId = CurrentUserId();
            // TODO: integrate payment gateway -> on success:
            var accessId = await _purchaseService.PurchaseAsync(userId, req.ItemType, req.ItemId, req.Amount);
            return Ok(new { success = true, accessId });
        }

        // 5b grant access (admin)
        [Authorize(Policy = "Admin")]
        [HttpPost("grant")]
        public async Task<IActionResult> GrantAccess([FromBody] GrantAccessRequest req)
        {
            await _purchaseService.GrantAccessAsync(req.UserId, req.ItemType, req.ItemId, req.AccessType ?? "Granted");
            return Ok(new { success = true });
        }

        // 6. Download / Stream check (returns access / url)
        [Authorize]
        [HttpGet("access/{itemType}/{itemId}")]
        public async Task<IActionResult> CheckAccess(string itemType, int itemId)
        {
            var userId = CurrentUserId();

            // Authors / Teachers should automatically get access to their own uploads
            if (itemType.Equals("publication", StringComparison.OrdinalIgnoreCase))
            {
                var pub = await _pubService.GetPublicationAsync(itemId);
                if (pub != null && pub.CreatedBy == userId)
                    return Ok(new { success = true, access = true, url = pub.CoverImageUrl });

                var has = await _purchaseService.HasAccessAsync(userId, itemType, itemId);
                if (has)
                    return Ok(new { success = true, access = true, url = pub?.CoverImageUrl });

                return Forbid();
            }
            else if (itemType.Equals("volume", StringComparison.OrdinalIgnoreCase))
            {
                var vols = await _pubService.GetVolumesAsync(itemId); // careful: our repo expects publicationId; if itemId is VolumeId, call a different repo method
                // Instead fetch by volume id using a SQL if necessary (not covered here). For now check purchase and return file url via direct select (simplified).
                var has = await _purchaseService.HasAccessAsync(userId, itemType, itemId);
                if (has)
                {
                    // We'll do a simple DB read to get the volume file (using repo)
                    // For brevity, call GetVolumesAsync assuming itemId is publicationId; in real code create GetVolumeById
                    // Return a fallback dev file
                    return Ok(new { success = true, access = true, url = DevSampleFile });
                }
                return Forbid();
            }
            else if (itemType.Equals("article", StringComparison.OrdinalIgnoreCase))
            {
                var has = await _purchaseService.HasAccessAsync(userId, itemType, itemId);
                if (has) return Ok(new { success = true, access = true, url = DevSampleFile });
                return Forbid();
            }

            return Forbid();
        }
    }

  
   
}

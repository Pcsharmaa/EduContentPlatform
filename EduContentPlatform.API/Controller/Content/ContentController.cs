using EduContentPlatform.Models.Content;
using EduContentPlatform.Models.Content.EduContentPlatform.Models.Publications;
using EduContentPlatform.Repository.Content;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/content")]
public class ContentController : ControllerBase
{
    private readonly IPublicationService _pubService;
    private readonly IPurchaseService _purchaseService;
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

    [Authorize(Policy = "ContentCreator")]
    [HttpPost("publication/submit")]
    public async Task<IActionResult> SubmitPublication([FromBody] PublicationModel model)
    {
        if (model.CreatedBy == 0) model.CreatedBy = CurrentUserId();
        model.CreatedAt = DateTime.UtcNow;
        var id = await _pubService.SubmitPublicationAsync(model);
        return Ok(new { success = true, publicationId = id });
    }

    [Authorize(Policy = "ContentCreator")]
    [HttpPost("publication/{publicationId}/volumes/submit")]
    public async Task<IActionResult> SubmitVolume(int publicationId, [FromBody] PublicationVolumeModel model)
    {
        model.PublicationId = publicationId;
        if (model.CreatedBy == 0) model.CreatedBy = CurrentUserId();
        model.CreatedAt = DateTime.UtcNow;
        var id = await _pubService.SubmitVolumeAsync(model);
        return Ok(new { success = true, volumeId = id });
    }

    [Authorize(Policy = "ContentCreator")]
    [HttpPost("publication/{publicationId}/article/submit")]
    public async Task<IActionResult> SubmitArticle(int publicationId, [FromBody] ArticleModel model)
    {
        model.PublicationId = publicationId;
        if (model.CreatedBy == 0) model.CreatedBy = CurrentUserId();
        model.CreatedAt = DateTime.UtcNow;
        var id = await _pubService.SubmitArticleAsync(model);
        return Ok(new { success = true, articleId = id });
    }

    [Authorize(Policy = "Publisher")]
    [HttpPost("assign/{itemType}/{itemId}/editor/{editorUserId}")]
    public async Task<IActionResult> AssignToEditor(string itemType, int itemId, int editorUserId)
    {
        var roleUserId = CurrentUserId();
        await _pubService.AssignToEditorAsync(itemType, itemId, editorUserId);
        await _pubService.UpdateStatusAsync(itemType, itemId, "AssignedToEditor", roleUserId, $"Assigned to editor {editorUserId}");
        return Ok(new { success = true });
    }

    [Authorize]
    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "Student";
        var items = await _pubService.GetPendingForRoleAsync(role);
        return Ok(new { success = true, data = items });
    }

    [AllowAnonymous]
    [HttpGet("publication/{id}")]
    public async Task<IActionResult> GetPublication(int id)
    {
        var pub = await _pubService.GetPublicationAsync(id);
        var vols = await _pubService.GetVolumesAsync(id);
        return Ok(new { success = true, publication = pub, volumes = vols });
    }

    [Authorize]
    [HttpPost("purchase")]
    public async Task<IActionResult> Purchase([FromBody] PurchaseRequest req)
    {
        var userId = CurrentUserId();
        var accessId = await _purchaseService.PurchaseAsync(userId, req.ItemType, req.ItemId, req.Amount);
        return Ok(new { success = true, accessId });
    }

    [Authorize(Policy = "Admin")]
    [HttpPost("grant")]
    public async Task<IActionResult> GrantAccess([FromBody] GrantAccessRequest req)
    {
        await _purchaseService.GrantAccessAsync(req.UserId, req.ItemType, req.ItemId, req.AccessType ?? "Granted");
        return Ok(new { success = true });
    }

    [Authorize]
    [HttpGet("access/{itemType}/{itemId}")]
    public async Task<IActionResult> CheckAccess(string itemType, int itemId)
    {
        var userId = CurrentUserId();

        if (itemType.Equals("publication", StringComparison.OrdinalIgnoreCase))
        {
            var pub = await _pubService.GetPublicationAsync(itemId);
            if (pub != null && pub.CreatedBy == userId) return Ok(new { success = true, access = true, url = pub.CoverImageUrl });
            var has = await _purchaseService.HasAccessAsync(userId, itemType, itemId);
            if (has) return Ok(new { success = true, access = true, url = pub?.CoverImageUrl });
            return Forbid();
        }
        else if (itemType.Equals("volume", StringComparison.OrdinalIgnoreCase))
        {
            var has = await _purchaseService.HasAccessAsync(userId, itemType, itemId);
            if (has)
            {
                // real code: fetch volume file url from repo
                return Ok(new { success = true, access = true, url = "/ContentFiles/PublicationContent/..." });
            }
            return Forbid();
        }
        else if (itemType.Equals("article", StringComparison.OrdinalIgnoreCase))
        {
            var has = await _purchaseService.HasAccessAsync(userId, itemType, itemId);
            if (has) return Ok(new { success = true, access = true, url = "/ContentFiles/PublicationContent/..." });
            return Forbid();
        }

        return Forbid();
    }
}

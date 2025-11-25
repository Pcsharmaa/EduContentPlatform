using EduContentPlatform.Models.Teacher;
using EduContentPlatform.Services.Teacher;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/teacher")]
public class TeacherController : ControllerBase
{
    private readonly ITeacherService _teacherService;
    public TeacherController(ITeacherService teacherService) => _teacherService = teacherService;

    private int CurrentUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(idClaim, out var id) ? id : 0;
    }

    [Authorize(Policy = "Teacher")]
    [HttpPost("courses")]
    public async Task<IActionResult> CreateCourse([FromForm] string courseName, [FromForm] string description)
    {
        int teacherId = CurrentUserId();
        var id = await _teacherService.CreateCourseAsync(teacherId, courseName, description);
        return Ok(new { success = true, courseId = id });
    }

    [Authorize(Policy = "Teacher")]
    [HttpPost("courses/{courseId}/chapters")]
    public async Task<IActionResult> CreateChapter(int courseId, [FromForm] string chapterName, [FromForm] int sortOrder = 0)
    {
        var id = await _teacherService.CreateChapterAsync(courseId, chapterName, sortOrder);
        return Ok(new { success = true, chapterId = id });
    }

    [Authorize(Policy = "Teacher")]
    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] TeacherUploadRequest req)
    {
        int teacherId = CurrentUserId();
        var id = await _teacherService.UploadFileAsync(teacherId, req);
        return Ok(new { success = true, fileId = id });
    }

    [Authorize]
    [HttpGet("chapters/{chapterId}/files")]
    public async Task<IActionResult> GetFiles(int chapterId)
    {
        var files = await _teacherService.GetFilesByChapterAsync(chapterId);
        return Ok(new { success = true, files });
    }
}

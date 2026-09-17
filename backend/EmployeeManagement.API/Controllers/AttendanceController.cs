using EmployeeManagement.Application.DTOs.Attendance;
using EmployeeManagement.Application.DTOs.Common;
using EmployeeManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _attendanceService;

    public AttendanceController(IAttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    /// <summary>
    /// Get paginated attendance records with filtering options.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<AttendanceDto>>> GetAttendanceRecords([FromQuery] AttendanceQueryParameters query)
    {
        var result = await _attendanceService.GetAttendanceRecordsAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get attendance record by ID.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<AttendanceDto>> GetAttendanceById(int id)
    {
        var record = await _attendanceService.GetAttendanceByIdAsync(id);
        if (record == null)
        {
            return NotFound($"Attendance record with ID {id} was not found.");
        }

        return Ok(record);
    }

    /// <summary>
    /// Mark employee attendance.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<AttendanceDto>> MarkAttendance([FromBody] CreateAttendanceDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var record = await _attendanceService.MarkAttendanceAsync(dto);
        return CreatedAtAction(nameof(GetAttendanceById), new { id = record.Id }, record);
    }

    /// <summary>
    /// Update existing attendance record.
    /// </summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<AttendanceDto>> UpdateAttendance(int id, [FromBody] UpdateAttendanceDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updatedRecord = await _attendanceService.UpdateAttendanceAsync(id, dto);
        if (updatedRecord == null)
        {
            return NotFound($"Attendance record with ID {id} was not found.");
        }

        return Ok(updatedRecord);
    }

    /// <summary>
    /// Delete attendance record.
    /// </summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAttendance(int id)
    {
        var success = await _attendanceService.DeleteAttendanceAsync(id);
        if (!success)
        {
            return NotFound($"Attendance record with ID {id} was not found.");
        }

        return NoContent();
    }

    /// <summary>
    /// Get attendance summary for specified date (defaults to today).
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<AttendanceSummaryDto>> GetSummary([FromQuery] DateTime? date)
    {
        var summary = await _attendanceService.GetAttendanceSummaryAsync(date);
        return Ok(summary);
    }
}

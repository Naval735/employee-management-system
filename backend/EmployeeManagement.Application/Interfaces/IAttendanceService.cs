using EmployeeManagement.Application.DTOs.Attendance;
using EmployeeManagement.Application.DTOs.Common;

namespace EmployeeManagement.Application.Interfaces;

public interface IAttendanceService
{
    Task<PaginatedResult<AttendanceDto>> GetAttendanceRecordsAsync(AttendanceQueryParameters query);
    Task<AttendanceDto?> GetAttendanceByIdAsync(int id);
    Task<AttendanceDto> MarkAttendanceAsync(CreateAttendanceDto dto);
    Task<AttendanceDto?> UpdateAttendanceAsync(int id, UpdateAttendanceDto dto);
    Task<bool> DeleteAttendanceAsync(int id);
    Task<AttendanceSummaryDto> GetAttendanceSummaryAsync(DateTime? date);
}

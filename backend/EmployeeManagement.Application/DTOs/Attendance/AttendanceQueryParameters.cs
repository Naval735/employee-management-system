using EmployeeManagement.Domain.Enums;

namespace EmployeeManagement.Application.DTOs.Attendance;

public class AttendanceQueryParameters
{
    public int? EmployeeId { get; set; }
    public int? DepartmentId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public AttendanceStatus? Status { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

using EmployeeManagement.Domain.Common;
using EmployeeManagement.Domain.Enums;

namespace EmployeeManagement.Domain.Entities;

public class Attendance : BaseEntity
{
    public int EmployeeId { get; set; }
    public DateTime Date { get; set; }
    public AttendanceStatus Status { get; set; }
    public string? Remarks { get; set; }

    // Navigation property
    public Employee Employee { get; set; } = null!;
}

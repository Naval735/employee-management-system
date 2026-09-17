using System.ComponentModel.DataAnnotations;
using EmployeeManagement.Domain.Enums;

namespace EmployeeManagement.Application.DTOs.Attendance;

public class UpdateAttendanceDto
{
    [Required(ErrorMessage = "Attendance status is required")]
    public AttendanceStatus Status { get; set; }

    [StringLength(255)]
    public string? Remarks { get; set; }
}

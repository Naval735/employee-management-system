using System.ComponentModel.DataAnnotations;
using EmployeeManagement.Domain.Enums;

namespace EmployeeManagement.Application.DTOs.Attendance;

public class CreateAttendanceDto
{
    [Required(ErrorMessage = "Employee ID is required")]
    public int EmployeeId { get; set; }

    [Required(ErrorMessage = "Date is required")]
    public DateTime Date { get; set; }

    [Required(ErrorMessage = "Attendance status is required")]
    public AttendanceStatus Status { get; set; }

    [StringLength(255, ErrorMessage = "Remarks cannot exceed 255 characters")]
    public string? Remarks { get; set; }
}

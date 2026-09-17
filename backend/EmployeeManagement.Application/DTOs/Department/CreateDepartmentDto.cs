using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.Application.DTOs.Department;

public class CreateDepartmentDto
{
    [Required(ErrorMessage = "Department code is required")]
    [StringLength(20, ErrorMessage = "Code cannot exceed 20 characters")]
    public string Code { get; set; } = string.Empty;

    [Required(ErrorMessage = "Department name is required")]
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    public string Name { get; set; } = string.Empty;

    [StringLength(255, ErrorMessage = "Description cannot exceed 255 characters")]
    public string? Description { get; set; }
}

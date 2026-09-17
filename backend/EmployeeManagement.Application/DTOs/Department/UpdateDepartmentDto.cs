using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.Application.DTOs.Department;

public class UpdateDepartmentDto
{
    [Required(ErrorMessage = "Department code is required")]
    [StringLength(20)]
    public string Code { get; set; } = string.Empty;

    [Required(ErrorMessage = "Department name is required")]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(255)]
    public string? Description { get; set; }
}

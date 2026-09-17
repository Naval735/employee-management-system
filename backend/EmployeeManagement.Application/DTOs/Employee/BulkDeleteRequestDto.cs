using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.Application.DTOs.Employee;

public class BulkDeleteRequestDto
{
    [Required]
    [MinLength(1, ErrorMessage = "At least one employee ID must be specified for bulk deletion.")]
    public List<int> EmployeeIds { get; set; } = new();
}

using EmployeeManagement.Domain.Enums;

namespace EmployeeManagement.Application.DTOs.Employee;

public class EmployeeQueryParameters
{
    public string? Search { get; set; }
    public int? DepartmentId { get; set; }
    public EmploymentStatus? Status { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string SortBy { get; set; } = "CreatedAt";
    public bool SortDescending { get; set; } = true;
}

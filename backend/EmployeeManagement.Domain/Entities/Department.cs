using EmployeeManagement.Domain.Common;

namespace EmployeeManagement.Domain.Entities;

public class Department : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Navigation property
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}

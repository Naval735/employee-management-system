using EmployeeManagement.Domain.Common;
using EmployeeManagement.Domain.Enums;

namespace EmployeeManagement.Domain.Entities;

public class Employee : BaseEntity
{
    public string EmployeeCode { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    public string Address { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public string Designation { get; set; } = string.Empty;
    public DateTime JoiningDate { get; set; }
    public decimal Salary { get; set; }
    public EmploymentStatus EmploymentStatus { get; set; } = EmploymentStatus.FullTime;

    // Navigation properties
    public Department Department { get; set; } = null!;
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    public User? UserAccount { get; set; }

    public string FullName => $"{FirstName} {LastName}".Trim();
}

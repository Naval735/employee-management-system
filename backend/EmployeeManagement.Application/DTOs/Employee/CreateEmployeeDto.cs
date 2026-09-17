using System.ComponentModel.DataAnnotations;
using EmployeeManagement.Domain.Enums;

namespace EmployeeManagement.Application.DTOs.Employee;

public class CreateEmployeeDto
{
    public string? EmployeeCode { get; set; }

    [Required(ErrorMessage = "First name is required")]
    [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required")]
    [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email address is required")]
    [EmailAddress(ErrorMessage = "Invalid email address format")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone number is required")]
    [Phone(ErrorMessage = "Invalid phone number format")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Date of birth is required")]
    public DateTime DateOfBirth { get; set; }

    [Required(ErrorMessage = "Gender is required")]
    public Gender Gender { get; set; }

    [Required(ErrorMessage = "Address is required")]
    public string Address { get; set; } = string.Empty;

    [Required(ErrorMessage = "Department is required")]
    public int DepartmentId { get; set; }

    [Required(ErrorMessage = "Designation is required")]
    public string Designation { get; set; } = string.Empty;

    [Required(ErrorMessage = "Joining date is required")]
    public DateTime JoiningDate { get; set; }

    [Required(ErrorMessage = "Salary is required")]
    [Range(0.01, 10000000.00, ErrorMessage = "Salary must be greater than 0")]
    public decimal Salary { get; set; }

    public EmploymentStatus EmploymentStatus { get; set; } = EmploymentStatus.FullTime;
}

namespace EmployeeManagement.Application.DTOs.Report;

public class SalaryReportDto
{
    public int EmployeeId { get; set; }
    public string EmployeeCode { get; set; } = string.Empty;
    public string EmployeeName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public decimal MonthlySalary { get; set; }
    public decimal AnnualSalary => MonthlySalary * 12;
    public string EmploymentStatus { get; set; } = string.Empty;
    public DateTime JoiningDate { get; set; }
}

public class DepartmentReportDto
{
    public int DepartmentId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int EmployeeCount { get; set; }
    public decimal TotalSalaryExpense { get; set; }
    public decimal AverageSalary { get; set; }
}

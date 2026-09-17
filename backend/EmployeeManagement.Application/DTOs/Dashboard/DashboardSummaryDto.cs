using EmployeeManagement.Application.DTOs.Attendance;
using EmployeeManagement.Application.DTOs.Employee;

namespace EmployeeManagement.Application.DTOs.Dashboard;

public class DashboardSummaryDto
{
    public int TotalEmployees { get; set; }
    public int TotalDepartments { get; set; }
    public int PresentToday { get; set; }
    public int AbsentToday { get; set; }
    public int OnLeaveToday { get; set; }
    public int HalfDayToday { get; set; }
    public decimal TotalMonthlyPayroll { get; set; }
    public decimal AverageSalary { get; set; }

    public List<DepartmentDistributionDto> DepartmentDistribution { get; set; } = new();
    public List<HiringTrendDto> HiringTrends { get; set; } = new();
    public List<SalaryDistributionDto> SalaryDistribution { get; set; } = new();
    public List<EmployeeDto> RecentEmployees { get; set; } = new();
    public List<AttendanceDto> RecentAttendance { get; set; } = new();
}

public class DepartmentDistributionDto
{
    public string DepartmentName { get; set; } = string.Empty;
    public string DepartmentCode { get; set; } = string.Empty;
    public int EmployeeCount { get; set; }
    public double Percentage { get; set; }
}

public class HiringTrendDto
{
    public string MonthYear { get; set; } = string.Empty; // e.g. "Jan 2024"
    public int HiredCount { get; set; }
}

public class SalaryDistributionDto
{
    public string Range { get; set; } = string.Empty; // e.g. "$50k - $75k"
    public int EmployeeCount { get; set; }
}

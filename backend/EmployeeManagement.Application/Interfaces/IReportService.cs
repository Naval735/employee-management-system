using EmployeeManagement.Application.DTOs.Attendance;
using EmployeeManagement.Application.DTOs.Employee;
using EmployeeManagement.Application.DTOs.Report;

namespace EmployeeManagement.Application.Interfaces;

public interface IReportService
{
    Task<IEnumerable<EmployeeDto>> GetEmployeeDirectoryReportAsync();
    Task<IEnumerable<DepartmentReportDto>> GetDepartmentReportAsync();
    Task<IEnumerable<AttendanceDto>> GetAttendanceReportAsync(DateTime? startDate, DateTime? endDate);
    Task<IEnumerable<SalaryReportDto>> GetSalaryReportAsync();
}

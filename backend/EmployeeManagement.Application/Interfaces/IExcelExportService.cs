using EmployeeManagement.Application.DTOs.Attendance;
using EmployeeManagement.Application.DTOs.Employee;
using EmployeeManagement.Application.DTOs.Report;

namespace EmployeeManagement.Application.Interfaces;

public interface IExcelExportService
{
    byte[] ExportEmployeesToExcel(IEnumerable<EmployeeDto> employees);
    byte[] ExportAttendanceToExcel(IEnumerable<AttendanceDto> attendance);
    byte[] ExportSalaryReportToExcel(IEnumerable<SalaryReportDto> salaryData);
    byte[] ExportDepartmentsToExcel(IEnumerable<DepartmentReportDto> departments);
}

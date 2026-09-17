using EmployeeManagement.Application.DTOs.Attendance;
using EmployeeManagement.Application.DTOs.Employee;
using EmployeeManagement.Application.DTOs.Report;

namespace EmployeeManagement.Application.Interfaces;

public interface IPdfExportService
{
    byte[] ExportEmployeesToPdf(IEnumerable<EmployeeDto> employees);
    byte[] ExportAttendanceToPdf(IEnumerable<AttendanceDto> attendance);
    byte[] ExportSalaryReportToPdf(IEnumerable<SalaryReportDto> salaryData);
    byte[] ExportDepartmentsToPdf(IEnumerable<DepartmentReportDto> departments);
}

using EmployeeManagement.Application.DTOs.Attendance;
using EmployeeManagement.Application.DTOs.Employee;
using EmployeeManagement.Application.DTOs.Report;
using EmployeeManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;
    private readonly IExcelExportService _excelExportService;
    private readonly IPdfExportService _pdfExportService;

    public ReportsController(
        IReportService reportService,
        IExcelExportService excelExportService,
        IPdfExportService pdfExportService)
    {
        _reportService = reportService;
        _excelExportService = excelExportService;
        _pdfExportService = pdfExportService;
    }

    [HttpGet("employees")]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetEmployeeDirectory()
    {
        var data = await _reportService.GetEmployeeDirectoryReportAsync();
        return Ok(data);
    }

    [HttpGet("employees/excel")]
    public async Task<IActionResult> ExportEmployeesExcel()
    {
        var data = await _reportService.GetEmployeeDirectoryReportAsync();
        var bytes = _excelExportService.ExportEmployeesToExcel(data);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Employee_Directory_{DateTime.UtcNow:yyyyMMdd}.xlsx");
    }

    [HttpGet("employees/pdf")]
    public async Task<IActionResult> ExportEmployeesPdf()
    {
        var data = await _reportService.GetEmployeeDirectoryReportAsync();
        var bytes = _pdfExportService.ExportEmployeesToPdf(data);
        return File(bytes, "application/pdf", $"Employee_Directory_{DateTime.UtcNow:yyyyMMdd}.pdf");
    }

    [HttpGet("departments")]
    public async Task<ActionResult<IEnumerable<DepartmentReportDto>>> GetDepartmentReport()
    {
        var data = await _reportService.GetDepartmentReportAsync();
        return Ok(data);
    }

    [HttpGet("departments/excel")]
    public async Task<IActionResult> ExportDepartmentsExcel()
    {
        var data = await _reportService.GetDepartmentReportAsync();
        var bytes = _excelExportService.ExportDepartmentsToExcel(data);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Departments_Report_{DateTime.UtcNow:yyyyMMdd}.xlsx");
    }

    [HttpGet("departments/pdf")]
    public async Task<IActionResult> ExportDepartmentsPdf()
    {
        var data = await _reportService.GetDepartmentReportAsync();
        var bytes = _pdfExportService.ExportDepartmentsToPdf(data);
        return File(bytes, "application/pdf", $"Departments_Report_{DateTime.UtcNow:yyyyMMdd}.pdf");
    }

    [HttpGet("attendance")]
    public async Task<ActionResult<IEnumerable<AttendanceDto>>> GetAttendanceReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var data = await _reportService.GetAttendanceReportAsync(startDate, endDate);
        return Ok(data);
    }

    [HttpGet("attendance/excel")]
    public async Task<IActionResult> ExportAttendanceExcel([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var data = await _reportService.GetAttendanceReportAsync(startDate, endDate);
        var bytes = _excelExportService.ExportAttendanceToExcel(data);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Attendance_Report_{DateTime.UtcNow:yyyyMMdd}.xlsx");
    }

    [HttpGet("attendance/pdf")]
    public async Task<IActionResult> ExportAttendancePdf([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var data = await _reportService.GetAttendanceReportAsync(startDate, endDate);
        var bytes = _pdfExportService.ExportAttendanceToPdf(data);
        return File(bytes, "application/pdf", $"Attendance_Report_{DateTime.UtcNow:yyyyMMdd}.pdf");
    }

    [HttpGet("salary")]
    public async Task<ActionResult<IEnumerable<SalaryReportDto>>> GetSalaryReport()
    {
        var data = await _reportService.GetSalaryReportAsync();
        return Ok(data);
    }

    [HttpGet("salary/excel")]
    public async Task<IActionResult> ExportSalaryExcel()
    {
        var data = await _reportService.GetSalaryReportAsync();
        var bytes = _excelExportService.ExportSalaryReportToExcel(data);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Payroll_Salary_Report_{DateTime.UtcNow:yyyyMMdd}.xlsx");
    }

    [HttpGet("salary/pdf")]
    public async Task<IActionResult> ExportSalaryPdf()
    {
        var data = await _reportService.GetSalaryReportAsync();
        var bytes = _pdfExportService.ExportSalaryReportToPdf(data);
        return File(bytes, "application/pdf", $"Payroll_Salary_Report_{DateTime.UtcNow:yyyyMMdd}.pdf");
    }
}

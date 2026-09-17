using ClosedXML.Excel;
using EmployeeManagement.Application.DTOs.Attendance;
using EmployeeManagement.Application.DTOs.Employee;
using EmployeeManagement.Application.DTOs.Report;
using EmployeeManagement.Application.Interfaces;

namespace EmployeeManagement.Infrastructure.Services;

public class ExcelExportService : IExcelExportService
{
    public byte[] ExportEmployeesToExcel(IEnumerable<EmployeeDto> employees)
    {
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Employee Directory");

        // Headers
        worksheet.Cell(1, 1).Value = "Employee Code";
        worksheet.Cell(1, 2).Value = "Full Name";
        worksheet.Cell(1, 3).Value = "Email";
        worksheet.Cell(1, 4).Value = "Phone";
        worksheet.Cell(1, 5).Value = "Department";
        worksheet.Cell(1, 6).Value = "Designation";
        worksheet.Cell(1, 7).Value = "Joining Date";
        worksheet.Cell(1, 8).Value = "Salary ($)";
        worksheet.Cell(1, 9).Value = "Employment Status";

        // Style Header Row
        var headerRange = worksheet.Range("A1:I1");
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#1E3A8A");
        headerRange.Style.Font.FontColor = XLColor.White;

        int row = 2;
        foreach (var emp in employees)
        {
            worksheet.Cell(row, 1).Value = emp.EmployeeCode;
            worksheet.Cell(row, 2).Value = emp.FullName;
            worksheet.Cell(row, 3).Value = emp.Email;
            worksheet.Cell(row, 4).Value = emp.Phone;
            worksheet.Cell(row, 5).Value = emp.DepartmentName;
            worksheet.Cell(row, 6).Value = emp.Designation;
            worksheet.Cell(row, 7).Value = emp.JoiningDate.ToString("yyyy-MM-dd");
            worksheet.Cell(row, 8).Value = emp.Salary;
            worksheet.Cell(row, 8).Style.NumberFormat.Format = "$#,##0.00";
            worksheet.Cell(row, 9).Value = emp.EmploymentStatus;
            row++;
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    public byte[] ExportAttendanceToExcel(IEnumerable<AttendanceDto> attendance)
    {
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Attendance Records");

        worksheet.Cell(1, 1).Value = "Date";
        worksheet.Cell(1, 2).Value = "Employee Code";
        worksheet.Cell(1, 3).Value = "Employee Name";
        worksheet.Cell(1, 4).Value = "Department";
        worksheet.Cell(1, 5).Value = "Status";
        worksheet.Cell(1, 6).Value = "Remarks";

        var headerRange = worksheet.Range("A1:F1");
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#065F46");
        headerRange.Style.Font.FontColor = XLColor.White;

        int row = 2;
        foreach (var att in attendance)
        {
            worksheet.Cell(row, 1).Value = att.Date.ToString("yyyy-MM-dd");
            worksheet.Cell(row, 2).Value = att.EmployeeCode;
            worksheet.Cell(row, 3).Value = att.EmployeeName;
            worksheet.Cell(row, 4).Value = att.DepartmentName;
            worksheet.Cell(row, 5).Value = att.Status;
            worksheet.Cell(row, 6).Value = att.Remarks ?? "-";
            row++;
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    public byte[] ExportSalaryReportToExcel(IEnumerable<SalaryReportDto> salaryData)
    {
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Salary & Payroll Report");

        worksheet.Cell(1, 1).Value = "Employee Code";
        worksheet.Cell(1, 2).Value = "Employee Name";
        worksheet.Cell(1, 3).Value = "Department";
        worksheet.Cell(1, 4).Value = "Designation";
        worksheet.Cell(1, 5).Value = "Monthly Salary";
        worksheet.Cell(1, 6).Value = "Annual Salary";
        worksheet.Cell(1, 7).Value = "Employment Status";

        var headerRange = worksheet.Range("A1:G1");
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#7C2D12");
        headerRange.Style.Font.FontColor = XLColor.White;

        int row = 2;
        foreach (var s in salaryData)
        {
            worksheet.Cell(row, 1).Value = s.EmployeeCode;
            worksheet.Cell(row, 2).Value = s.EmployeeName;
            worksheet.Cell(row, 3).Value = s.DepartmentName;
            worksheet.Cell(row, 4).Value = s.Designation;
            worksheet.Cell(row, 5).Value = s.MonthlySalary;
            worksheet.Cell(row, 5).Style.NumberFormat.Format = "$#,##0.00";
            worksheet.Cell(row, 6).Value = s.AnnualSalary;
            worksheet.Cell(row, 6).Style.NumberFormat.Format = "$#,##0.00";
            worksheet.Cell(row, 7).Value = s.EmploymentStatus;
            row++;
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    public byte[] ExportDepartmentsToExcel(IEnumerable<DepartmentReportDto> departments)
    {
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Departments Summary");

        worksheet.Cell(1, 1).Value = "Code";
        worksheet.Cell(1, 2).Value = "Department Name";
        worksheet.Cell(1, 3).Value = "Total Employees";
        worksheet.Cell(1, 4).Value = "Total Salary Expense";
        worksheet.Cell(1, 5).Value = "Average Salary";

        var headerRange = worksheet.Range("A1:E1");
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#4C1D95");
        headerRange.Style.Font.FontColor = XLColor.White;

        int row = 2;
        foreach (var d in departments)
        {
            worksheet.Cell(row, 1).Value = d.Code;
            worksheet.Cell(row, 2).Value = d.Name;
            worksheet.Cell(row, 3).Value = d.EmployeeCount;
            worksheet.Cell(row, 4).Value = d.TotalSalaryExpense;
            worksheet.Cell(row, 4).Style.NumberFormat.Format = "$#,##0.00";
            worksheet.Cell(row, 5).Value = d.AverageSalary;
            worksheet.Cell(row, 5).Style.NumberFormat.Format = "$#,##0.00";
            row++;
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}

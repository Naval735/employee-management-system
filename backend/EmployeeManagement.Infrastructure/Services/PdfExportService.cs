using EmployeeManagement.Application.DTOs.Attendance;
using EmployeeManagement.Application.DTOs.Employee;
using EmployeeManagement.Application.DTOs.Report;
using EmployeeManagement.Application.Interfaces;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace EmployeeManagement.Infrastructure.Services;

public class PdfExportService : IPdfExportService
{
    static PdfExportService()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public byte[] ExportEmployeesToPdf(IEnumerable<EmployeeDto> employees)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(1, Unit.Centimetre);
                page.PageColor(Colors.White);

                page.Header().Row(row =>
                {
                    row.RelativeItem().Column(column =>
                    {
                        column.Item().Text("EMPLOYEE MANAGEMENT SYSTEM").FontSize(18).Bold().FontColor("#1E3A8A");
                        column.Item().Text($"Employee Directory Report - Generated on {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC").FontSize(10).FontColor(Colors.Grey.Medium);
                    });
                });

                page.Content().PaddingVertical(10).Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(70);
                        columns.RelativeColumn(2);
                        columns.RelativeColumn(2);
                        columns.RelativeColumn(1.5f);
                        columns.RelativeColumn(1.5f);
                        columns.ConstantColumn(80);
                        columns.ConstantColumn(80);
                    });

                    table.Header(header =>
                    {
                        header.Cell().Background("#1E3A8A").Padding(5).Text("Code").Bold().FontColor(Colors.White);
                        header.Cell().Background("#1E3A8A").Padding(5).Text("Name").Bold().FontColor(Colors.White);
                        header.Cell().Background("#1E3A8A").Padding(5).Text("Email").Bold().FontColor(Colors.White);
                        header.Cell().Background("#1E3A8A").Padding(5).Text("Department").Bold().FontColor(Colors.White);
                        header.Cell().Background("#1E3A8A").Padding(5).Text("Designation").Bold().FontColor(Colors.White);
                        header.Cell().Background("#1E3A8A").Padding(5).Text("Salary").Bold().FontColor(Colors.White);
                        header.Cell().Background("#1E3A8A").Padding(5).Text("Status").Bold().FontColor(Colors.White);
                    });

                    foreach (var emp in employees)
                    {
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(emp.EmployeeCode);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(emp.FullName);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(emp.Email);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(emp.DepartmentName);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(emp.Designation);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text($"${emp.Salary:N2}");
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(emp.EmploymentStatus);
                    }
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Page ");
                    x.CurrentPageNumber();
                    x.Span(" of ");
                    x.TotalPages();
                });
            });
        }).GeneratePdf();
    }

    public byte[] ExportAttendanceToPdf(IEnumerable<AttendanceDto> attendance)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1, Unit.Centimetre);

                page.Header().Column(column =>
                {
                    column.Item().Text("EMPLOYEE MANAGEMENT SYSTEM").FontSize(18).Bold().FontColor("#065F46");
                    column.Item().Text($"Attendance Report - Generated on {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC").FontSize(10).FontColor(Colors.Grey.Medium);
                });

                page.Content().PaddingVertical(10).Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(80);
                        columns.ConstantColumn(70);
                        columns.RelativeColumn(2);
                        columns.RelativeColumn(1.5f);
                        columns.ConstantColumn(70);
                        columns.RelativeColumn(1.5f);
                    });

                    table.Header(header =>
                    {
                        header.Cell().Background("#065F46").Padding(5).Text("Date").Bold().FontColor(Colors.White);
                        header.Cell().Background("#065F46").Padding(5).Text("Code").Bold().FontColor(Colors.White);
                        header.Cell().Background("#065F46").Padding(5).Text("Employee").Bold().FontColor(Colors.White);
                        header.Cell().Background("#065F46").Padding(5).Text("Department").Bold().FontColor(Colors.White);
                        header.Cell().Background("#065F46").Padding(5).Text("Status").Bold().FontColor(Colors.White);
                        header.Cell().Background("#065F46").Padding(5).Text("Remarks").Bold().FontColor(Colors.White);
                    });

                    foreach (var att in attendance)
                    {
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(att.Date.ToString("yyyy-MM-dd"));
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(att.EmployeeCode);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(att.EmployeeName);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(att.DepartmentName);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(att.Status);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(att.Remarks ?? "-");
                    }
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Page ");
                    x.CurrentPageNumber();
                    x.Span(" of ");
                    x.TotalPages();
                });
            });
        }).GeneratePdf();
    }

    public byte[] ExportSalaryReportToPdf(IEnumerable<SalaryReportDto> salaryData)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1, Unit.Centimetre);

                page.Header().Column(column =>
                {
                    column.Item().Text("EMPLOYEE MANAGEMENT SYSTEM").FontSize(18).Bold().FontColor("#7C2D12");
                    column.Item().Text($"Payroll & Salary Summary Report - Generated on {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC").FontSize(10).FontColor(Colors.Grey.Medium);
                });

                page.Content().PaddingVertical(10).Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(70);
                        columns.RelativeColumn(2);
                        columns.RelativeColumn(1.5f);
                        columns.RelativeColumn(1.5f);
                        columns.ConstantColumn(85);
                        columns.ConstantColumn(85);
                    });

                    table.Header(header =>
                    {
                        header.Cell().Background("#7C2D12").Padding(5).Text("Code").Bold().FontColor(Colors.White);
                        header.Cell().Background("#7C2D12").Padding(5).Text("Employee").Bold().FontColor(Colors.White);
                        header.Cell().Background("#7C2D12").Padding(5).Text("Department").Bold().FontColor(Colors.White);
                        header.Cell().Background("#7C2D12").Padding(5).Text("Designation").Bold().FontColor(Colors.White);
                        header.Cell().Background("#7C2D12").Padding(5).Text("Monthly").Bold().FontColor(Colors.White);
                        header.Cell().Background("#7C2D12").Padding(5).Text("Annual").Bold().FontColor(Colors.White);
                    });

                    foreach (var s in salaryData)
                    {
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(s.EmployeeCode);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(s.EmployeeName);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(s.DepartmentName);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(s.Designation);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text($"${s.MonthlySalary:N2}");
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text($"${s.AnnualSalary:N2}");
                    }
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Page ");
                    x.CurrentPageNumber();
                    x.Span(" of ");
                    x.TotalPages();
                });
            });
        }).GeneratePdf();
    }

    public byte[] ExportDepartmentsToPdf(IEnumerable<DepartmentReportDto> departments)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1, Unit.Centimetre);

                page.Header().Column(column =>
                {
                    column.Item().Text("EMPLOYEE MANAGEMENT SYSTEM").FontSize(18).Bold().FontColor("#4C1D95");
                    column.Item().Text($"Departments Overview Report - Generated on {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC").FontSize(10).FontColor(Colors.Grey.Medium);
                });

                page.Content().PaddingVertical(10).Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(70);
                        columns.RelativeColumn(2);
                        columns.ConstantColumn(90);
                        columns.ConstantColumn(110);
                        columns.ConstantColumn(100);
                    });

                    table.Header(header =>
                    {
                        header.Cell().Background("#4C1D95").Padding(5).Text("Code").Bold().FontColor(Colors.White);
                        header.Cell().Background("#4C1D95").Padding(5).Text("Department").Bold().FontColor(Colors.White);
                        header.Cell().Background("#4C1D95").Padding(5).Text("Employees").Bold().FontColor(Colors.White);
                        header.Cell().Background("#4C1D95").Padding(5).Text("Total Payroll").Bold().FontColor(Colors.White);
                        header.Cell().Background("#4C1D95").Padding(5).Text("Avg Salary").Bold().FontColor(Colors.White);
                    });

                    foreach (var d in departments)
                    {
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(d.Code);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(d.Name);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(d.EmployeeCount.ToString());
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text($"${d.TotalSalaryExpense:N2}");
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text($"${d.AverageSalary:N2}");
                    }
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Page ");
                    x.CurrentPageNumber();
                    x.Span(" of ");
                    x.TotalPages();
                });
            });
        }).GeneratePdf();
    }
}

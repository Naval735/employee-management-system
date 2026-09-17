using EmployeeManagement.Application.DTOs.Attendance;
using EmployeeManagement.Application.DTOs.Dashboard;
using EmployeeManagement.Application.DTOs.Employee;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IApplicationDbContext _context;

    public DashboardService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
    {
        var today = DateTime.UtcNow.Date;

        // 1. Basic Counts
        var totalEmployees = await _context.Employees.CountAsync(e => e.EmploymentStatus != EmploymentStatus.Terminated);
        var totalDepartments = await _context.Departments.CountAsync();

        // 2. Today's Attendance
        var todayAttendance = await _context.Attendances
            .Where(a => a.Date.Date == today)
            .AsNoTracking()
            .ToListAsync();

        int presentToday = todayAttendance.Count(a => a.Status == AttendanceStatus.Present);
        int absentToday = todayAttendance.Count(a => a.Status == AttendanceStatus.Absent);
        int onLeaveToday = todayAttendance.Count(a => a.Status == AttendanceStatus.Leave);
        int halfDayToday = todayAttendance.Count(a => a.Status == AttendanceStatus.HalfDay);

        // 3. Payroll Totals
        var activeEmployees = await _context.Employees
            .Where(e => e.EmploymentStatus != EmploymentStatus.Terminated)
            .AsNoTracking()
            .ToListAsync();

        decimal totalPayroll = activeEmployees.Sum(e => e.Salary);
        decimal avgSalary = activeEmployees.Any() ? Math.Round(activeEmployees.Average(e => e.Salary), 2) : 0;

        // 4. Department Distribution
        var depts = await _context.Departments
            .Include(d => d.Employees)
            .AsNoTracking()
            .ToListAsync();

        var deptDistribution = depts.Select(d => new DepartmentDistributionDto
        {
            DepartmentCode = d.Code,
            DepartmentName = d.Name,
            EmployeeCount = d.Employees.Count(e => e.EmploymentStatus != EmploymentStatus.Terminated),
            Percentage = totalEmployees == 0 ? 0 : Math.Round(((double)d.Employees.Count(e => e.EmploymentStatus != EmploymentStatus.Terminated) / totalEmployees) * 100, 1)
        }).OrderByDescending(d => d.EmployeeCount).ToList();

        // 5. Hiring Trends (grouped by month/year for past 12 months)
        var twelveMonthsAgo = DateTime.UtcNow.AddMonths(-11);
        var hiringTrends = activeEmployees
            .Where(e => e.JoiningDate >= new DateTime(twelveMonthsAgo.Year, twelveMonthsAgo.Month, 1))
            .GroupBy(e => new { e.JoiningDate.Year, e.JoiningDate.Month })
            .Select(g => new HiringTrendDto
            {
                MonthYear = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
                HiredCount = g.Count()
            })
            .OrderBy(h => DateTime.ParseExact(h.MonthYear, "MMM yyyy", null))
            .ToList();

        // 6. Salary Distribution Ranges
        var salaryRanges = new List<SalaryDistributionDto>
        {
            new() { Range = "< $50k", EmployeeCount = activeEmployees.Count(e => e.Salary < 50000) },
            new() { Range = "$50k - $80k", EmployeeCount = activeEmployees.Count(e => e.Salary >= 50000 && e.Salary < 80000) },
            new() { Range = "$80k - $110k", EmployeeCount = activeEmployees.Count(e => e.Salary >= 80000 && e.Salary < 110000) },
            new() { Range = "$110k+", EmployeeCount = activeEmployees.Count(e => e.Salary >= 110000) }
        };

        // 7. Recent 5 Employees
        var recentEmployees = await _context.Employees
            .Include(e => e.Department)
            .AsNoTracking()
            .OrderByDescending(e => e.CreatedAt)
            .Take(5)
            .Select(e => new EmployeeDto
            {
                Id = e.Id,
                EmployeeCode = e.EmployeeCode,
                FirstName = e.FirstName,
                LastName = e.LastName,
                FullName = e.FullName,
                Email = e.Email,
                Phone = e.Phone,
                DepartmentName = e.Department.Name,
                Designation = e.Designation,
                JoiningDate = e.JoiningDate,
                Salary = e.Salary,
                EmploymentStatus = e.EmploymentStatus.ToString()
            })
            .ToListAsync();

        // 8. Recent 5 Attendance Records
        var recentAttendance = await _context.Attendances
            .Include(a => a.Employee)
                .ThenInclude(e => e.Department)
            .AsNoTracking()
            .OrderByDescending(a => a.Date)
            .ThenByDescending(a => a.Id)
            .Take(5)
            .Select(a => new AttendanceDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeCode = a.Employee.EmployeeCode,
                EmployeeName = a.Employee.FullName,
                DepartmentName = a.Employee.Department.Name,
                Date = a.Date,
                Status = a.Status.ToString(),
                Remarks = a.Remarks
            })
            .ToListAsync();

        return new DashboardSummaryDto
        {
            TotalEmployees = totalEmployees,
            TotalDepartments = totalDepartments,
            PresentToday = presentToday,
            AbsentToday = absentToday,
            OnLeaveToday = onLeaveToday,
            HalfDayToday = halfDayToday,
            TotalMonthlyPayroll = totalPayroll,
            AverageSalary = avgSalary,
            DepartmentDistribution = deptDistribution,
            HiringTrends = hiringTrends,
            SalaryDistribution = salaryRanges,
            RecentEmployees = recentEmployees,
            RecentAttendance = recentAttendance
        };
    }
}

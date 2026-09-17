using EmployeeManagement.Application.DTOs.Attendance;
using EmployeeManagement.Application.DTOs.Employee;
using EmployeeManagement.Application.DTOs.Report;
using EmployeeManagement.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Services;

public class ReportService : IReportService
{
    private readonly IApplicationDbContext _context;

    public ReportService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<EmployeeDto>> GetEmployeeDirectoryReportAsync()
    {
        return await _context.Employees
            .Include(e => e.Department)
            .AsNoTracking()
            .OrderBy(e => e.EmployeeCode)
            .Select(e => new EmployeeDto
            {
                Id = e.Id,
                EmployeeCode = e.EmployeeCode,
                FirstName = e.FirstName,
                LastName = e.LastName,
                FullName = e.FullName,
                Email = e.Email,
                Phone = e.Phone,
                DateOfBirth = e.DateOfBirth,
                Gender = e.Gender.ToString(),
                Address = e.Address,
                DepartmentId = e.DepartmentId,
                DepartmentName = e.Department.Name,
                DepartmentCode = e.Department.Code,
                Designation = e.Designation,
                JoiningDate = e.JoiningDate,
                Salary = e.Salary,
                EmploymentStatus = e.EmploymentStatus.ToString(),
                CreatedAt = e.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<DepartmentReportDto>> GetDepartmentReportAsync()
    {
        var depts = await _context.Departments
            .Include(d => d.Employees)
            .AsNoTracking()
            .ToListAsync();

        return depts.Select(d =>
        {
            var count = d.Employees.Count;
            var totalSalary = d.Employees.Sum(e => e.Salary);
            var avgSalary = count == 0 ? 0 : Math.Round(totalSalary / count, 2);

            return new DepartmentReportDto
            {
                DepartmentId = d.Id,
                Code = d.Code,
                Name = d.Name,
                EmployeeCount = count,
                TotalSalaryExpense = totalSalary,
                AverageSalary = avgSalary
            };
        }).OrderBy(d => d.Name).ToList();
    }

    public async Task<IEnumerable<AttendanceDto>> GetAttendanceReportAsync(DateTime? startDate, DateTime? endDate)
    {
        var query = _context.Attendances
            .Include(a => a.Employee)
                .ThenInclude(e => e.Department)
            .AsNoTracking()
            .AsQueryable();

        if (startDate.HasValue)
        {
            query = query.Where(a => a.Date >= startDate.Value.Date);
        }

        if (endDate.HasValue)
        {
            var end = endDate.Value.Date.AddDays(1).AddTicks(-1);
            query = query.Where(a => a.Date <= end);
        }

        return await query
            .OrderByDescending(a => a.Date)
            .ThenBy(a => a.Employee.FirstName)
            .Select(a => new AttendanceDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeCode = a.Employee.EmployeeCode,
                EmployeeName = a.Employee.FullName,
                DepartmentName = a.Employee.Department.Name,
                Date = a.Date,
                Status = a.Status.ToString(),
                Remarks = a.Remarks,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<SalaryReportDto>> GetSalaryReportAsync()
    {
        return await _context.Employees
            .Include(e => e.Department)
            .AsNoTracking()
            .OrderByDescending(e => e.Salary)
            .Select(e => new SalaryReportDto
            {
                EmployeeId = e.Id,
                EmployeeCode = e.EmployeeCode,
                EmployeeName = e.FullName,
                DepartmentName = e.Department.Name,
                Designation = e.Designation,
                MonthlySalary = e.Salary,
                EmploymentStatus = e.EmploymentStatus.ToString(),
                JoiningDate = e.JoiningDate
            })
            .ToListAsync();
    }
}

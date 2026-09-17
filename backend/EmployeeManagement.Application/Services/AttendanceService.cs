using EmployeeManagement.Application.DTOs.Attendance;
using EmployeeManagement.Application.DTOs.Common;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Services;

public class AttendanceService : IAttendanceService
{
    private readonly IApplicationDbContext _context;

    public AttendanceService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResult<AttendanceDto>> GetAttendanceRecordsAsync(AttendanceQueryParameters query)
    {
        var dbQuery = _context.Attendances
            .Include(a => a.Employee)
                .ThenInclude(e => e.Department)
            .AsNoTracking()
            .AsQueryable();

        // Filter by Employee
        if (query.EmployeeId.HasValue && query.EmployeeId.Value > 0)
        {
            dbQuery = dbQuery.Where(a => a.EmployeeId == query.EmployeeId.Value);
        }

        // Filter by Department
        if (query.DepartmentId.HasValue && query.DepartmentId.Value > 0)
        {
            dbQuery = dbQuery.Where(a => a.Employee.DepartmentId == query.DepartmentId.Value);
        }

        // Filter by Date Range
        if (query.StartDate.HasValue)
        {
            var start = query.StartDate.Value.Date;
            dbQuery = dbQuery.Where(a => a.Date >= start);
        }

        if (query.EndDate.HasValue)
        {
            var end = query.EndDate.Value.Date.AddDays(1).AddTicks(-1);
            dbQuery = dbQuery.Where(a => a.Date <= end);
        }

        // Filter by Status
        if (query.Status.HasValue)
        {
            dbQuery = dbQuery.Where(a => a.Status == query.Status.Value);
        }

        var totalCount = await dbQuery.CountAsync();

        var pageNumber = query.PageNumber < 1 ? 1 : query.PageNumber;
        var pageSize = query.PageSize < 1 ? 10 : query.PageSize;

        var items = await dbQuery
            .OrderByDescending(a => a.Date)
            .ThenBy(a => a.Employee.FirstName)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(a => MapToDto(a))
            .ToListAsync();

        return new PaginatedResult<AttendanceDto>(items, totalCount, pageNumber, pageSize);
    }

    public async Task<AttendanceDto?> GetAttendanceByIdAsync(int id)
    {
        var attendance = await _context.Attendances
            .Include(a => a.Employee)
                .ThenInclude(e => e.Department)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);

        return attendance == null ? null : MapToDto(attendance);
    }

    public async Task<AttendanceDto> MarkAttendanceAsync(CreateAttendanceDto dto)
    {
        var employee = await _context.Employees.FindAsync(dto.EmployeeId);
        if (employee == null)
        {
            throw new ArgumentException($"Employee with ID {dto.EmployeeId} does not exist.");
        }

        var attendanceDate = dto.Date.Date;

        // Prevent Duplicate Attendance Entry for Same Employee & Date
        var duplicateExists = await _context.Attendances.AnyAsync(a =>
            a.EmployeeId == dto.EmployeeId && a.Date.Date == attendanceDate);

        if (duplicateExists)
        {
            throw new InvalidOperationException(
                $"Attendance for employee '{employee.FullName}' on date {attendanceDate:yyyy-MM-dd} has already been marked.");
        }

        var attendance = new Attendance
        {
            EmployeeId = dto.EmployeeId,
            Date = attendanceDate,
            Status = dto.Status,
            Remarks = dto.Remarks?.Trim()
        };

        await _context.Attendances.AddAsync(attendance);
        await _context.SaveChangesAsync();

        return (await GetAttendanceByIdAsync(attendance.Id))!;
    }

    public async Task<AttendanceDto?> UpdateAttendanceAsync(int id, UpdateAttendanceDto dto)
    {
        var attendance = await _context.Attendances.FindAsync(id);
        if (attendance == null) return null;

        attendance.Status = dto.Status;
        attendance.Remarks = dto.Remarks?.Trim();

        await _context.SaveChangesAsync();

        return (await GetAttendanceByIdAsync(id))!;
    }

    public async Task<bool> DeleteAttendanceAsync(int id)
    {
        var attendance = await _context.Attendances.FindAsync(id);
        if (attendance == null) return false;

        _context.Attendances.Remove(attendance);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<AttendanceSummaryDto> GetAttendanceSummaryAsync(DateTime? date)
    {
        var targetDate = (date ?? DateTime.UtcNow).Date;
        var totalEmployees = await _context.Employees.CountAsync(e => e.EmploymentStatus != EmploymentStatus.Terminated);

        var records = await _context.Attendances
            .Where(a => a.Date.Date == targetDate)
            .AsNoTracking()
            .ToListAsync();

        int present = records.Count(r => r.Status == AttendanceStatus.Present);
        int absent = records.Count(r => r.Status == AttendanceStatus.Absent);
        int leave = records.Count(r => r.Status == AttendanceStatus.Leave);
        int halfDay = records.Count(r => r.Status == AttendanceStatus.HalfDay);

        return new AttendanceSummaryDto
        {
            Date = targetDate,
            TotalEmployees = totalEmployees,
            PresentCount = present,
            AbsentCount = absent,
            LeaveCount = leave,
            HalfDayCount = halfDay
        };
    }

    private static AttendanceDto MapToDto(Attendance a)
    {
        return new AttendanceDto
        {
            Id = a.Id,
            EmployeeId = a.EmployeeId,
            EmployeeCode = a.Employee != null ? a.Employee.EmployeeCode : string.Empty,
            EmployeeName = a.Employee != null ? a.Employee.FullName : string.Empty,
            DepartmentName = a.Employee?.Department != null ? a.Employee.Department.Name : string.Empty,
            Date = a.Date,
            Status = a.Status.ToString(),
            Remarks = a.Remarks,
            CreatedAt = a.CreatedAt,
            UpdatedAt = a.UpdatedAt
        };
    }
}

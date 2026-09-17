using EmployeeManagement.Application.DTOs.Common;
using EmployeeManagement.Application.DTOs.Employee;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IApplicationDbContext _context;

    public EmployeeService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResult<EmployeeDto>> GetEmployeesAsync(EmployeeQueryParameters query)
    {
        var dbQuery = _context.Employees
            .Include(e => e.Department)
            .AsNoTracking()
            .AsQueryable();

        // 1. Search Filter (Name, Email, EmployeeCode)
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchTerm = query.Search.Trim().ToLower();
            dbQuery = dbQuery.Where(e =>
                e.FirstName.ToLower().Contains(searchTerm) ||
                e.LastName.ToLower().Contains(searchTerm) ||
                (e.FirstName + " " + e.LastName).ToLower().Contains(searchTerm) ||
                e.Email.ToLower().Contains(searchTerm) ||
                e.EmployeeCode.ToLower().Contains(searchTerm));
        }

        // 2. Department Filter
        if (query.DepartmentId.HasValue && query.DepartmentId.Value > 0)
        {
            dbQuery = dbQuery.Where(e => e.DepartmentId == query.DepartmentId.Value);
        }

        // 3. Status Filter
        if (query.Status.HasValue)
        {
            dbQuery = dbQuery.Where(e => e.EmploymentStatus == query.Status.Value);
        }

        // 4. Total Count before pagination
        var totalCount = await dbQuery.CountAsync();

        // 5. Sorting
        dbQuery = query.SortBy?.ToLower() switch
        {
            "firstname" => query.SortDescending ? dbQuery.OrderByDescending(e => e.FirstName) : dbQuery.OrderBy(e => e.FirstName),
            "lastname" => query.SortDescending ? dbQuery.OrderByDescending(e => e.LastName) : dbQuery.OrderBy(e => e.LastName),
            "email" => query.SortDescending ? dbQuery.OrderByDescending(e => e.Email) : dbQuery.OrderBy(e => e.Email),
            "employeecode" => query.SortDescending ? dbQuery.OrderByDescending(e => e.EmployeeCode) : dbQuery.OrderBy(e => e.EmployeeCode),
            "salary" => query.SortDescending ? dbQuery.OrderByDescending(e => e.Salary) : dbQuery.OrderBy(e => e.Salary),
            "joiningdate" => query.SortDescending ? dbQuery.OrderByDescending(e => e.JoiningDate) : dbQuery.OrderBy(e => e.JoiningDate),
            _ => query.SortDescending ? dbQuery.OrderByDescending(e => e.CreatedAt) : dbQuery.OrderBy(e => e.CreatedAt)
        };

        // 6. Pagination
        var pageNumber = query.PageNumber < 1 ? 1 : query.PageNumber;
        var pageSize = query.PageSize < 1 ? 10 : query.PageSize;

        var items = await dbQuery
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(e => MapToDto(e))
            .ToListAsync();

        return new PaginatedResult<EmployeeDto>(items, totalCount, pageNumber, pageSize);
    }

    public async Task<EmployeeDto?> GetEmployeeByIdAsync(int id)
    {
        var employee = await _context.Employees
            .Include(e => e.Department)
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id);

        return employee == null ? null : MapToDto(employee);
    }

    public async Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto dto)
    {
        // 1. Verify Department exists
        var department = await _context.Departments.FindAsync(dto.DepartmentId);
        if (department == null)
        {
            throw new ArgumentException($"Department with ID {dto.DepartmentId} does not exist.");
        }

        // 2. Check duplicate email
        var emailExists = await _context.Employees.AnyAsync(e => e.Email.ToLower() == dto.Email.Trim().ToLower());
        if (emailExists)
        {
            throw new InvalidOperationException($"An employee with email '{dto.Email}' already exists.");
        }

        // 3. Generate or validate EmployeeCode
        string employeeCode = dto.EmployeeCode?.Trim().ToUpper() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(employeeCode))
        {
            var maxId = await _context.Employees.AnyAsync() ? await _context.Employees.MaxAsync(e => e.Id) : 0;
            employeeCode = $"EMP-{(maxId + 1):D3}";
        }
        else
        {
            var codeExists = await _context.Employees.AnyAsync(e => e.EmployeeCode.ToLower() == employeeCode.ToLower());
            if (codeExists)
            {
                throw new InvalidOperationException($"An employee with code '{employeeCode}' already exists.");
            }
        }

        var employee = new Employee
        {
            EmployeeCode = employeeCode,
            FirstName = dto.FirstName.Trim(),
            LastName = dto.LastName.Trim(),
            Email = dto.Email.Trim(),
            Phone = dto.Phone.Trim(),
            DateOfBirth = dto.DateOfBirth,
            Gender = dto.Gender,
            Address = dto.Address.Trim(),
            DepartmentId = dto.DepartmentId,
            Designation = dto.Designation.Trim(),
            JoiningDate = dto.JoiningDate,
            Salary = dto.Salary,
            EmploymentStatus = dto.EmploymentStatus
        };

        await _context.Employees.AddAsync(employee);
        await _context.SaveChangesAsync();

        // Reload with Department
        return (await GetEmployeeByIdAsync(employee.Id))!;
    }

    public async Task<EmployeeDto?> UpdateEmployeeAsync(int id, UpdateEmployeeDto dto)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null) return null;

        var department = await _context.Departments.FindAsync(dto.DepartmentId);
        if (department == null)
        {
            throw new ArgumentException($"Department with ID {dto.DepartmentId} does not exist.");
        }

        // Check duplicate email (excluding current employee)
        var emailExists = await _context.Employees.AnyAsync(e => e.Id != id && e.Email.ToLower() == dto.Email.Trim().ToLower());
        if (emailExists)
        {
            throw new InvalidOperationException($"An employee with email '{dto.Email}' already exists.");
        }

        employee.FirstName = dto.FirstName.Trim();
        employee.LastName = dto.LastName.Trim();
        employee.Email = dto.Email.Trim();
        employee.Phone = dto.Phone.Trim();
        employee.DateOfBirth = dto.DateOfBirth;
        employee.Gender = dto.Gender;
        employee.Address = dto.Address.Trim();
        employee.DepartmentId = dto.DepartmentId;
        employee.Designation = dto.Designation.Trim();
        employee.JoiningDate = dto.JoiningDate;
        employee.Salary = dto.Salary;
        employee.EmploymentStatus = dto.EmploymentStatus;

        await _context.SaveChangesAsync();

        return (await GetEmployeeByIdAsync(employee.Id))!;
    }

    public async Task<bool> DeleteEmployeeAsync(int id)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null) return false;

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> BulkDeleteEmployeesAsync(List<int> ids)
    {
        if (ids == null || !ids.Any()) return 0;

        var employees = await _context.Employees
            .Where(e => ids.Contains(e.Id))
            .ToListAsync();

        if (!employees.Any()) return 0;

        _context.Employees.RemoveRange(employees);
        await _context.SaveChangesAsync();
        return employees.Count;
    }

    private static EmployeeDto MapToDto(Employee e)
    {
        return new EmployeeDto
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
            DepartmentName = e.Department != null ? e.Department.Name : string.Empty,
            DepartmentCode = e.Department != null ? e.Department.Code : string.Empty,
            Designation = e.Designation,
            JoiningDate = e.JoiningDate,
            Salary = e.Salary,
            EmploymentStatus = e.EmploymentStatus.ToString(),
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt
        };
    }
}

using EmployeeManagement.Application.DTOs.Department;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Services;

public class DepartmentService : IDepartmentService
{
    private readonly IApplicationDbContext _context;

    public DepartmentService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DepartmentDto>> GetAllDepartmentsAsync()
    {
        return await _context.Departments
            .Include(d => d.Employees)
            .AsNoTracking()
            .OrderBy(d => d.Name)
            .Select(d => new DepartmentDto
            {
                Id = d.Id,
                Code = d.Code,
                Name = d.Name,
                Description = d.Description,
                EmployeeCount = d.Employees.Count,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<DepartmentDto?> GetDepartmentByIdAsync(int id)
    {
        var department = await _context.Departments
            .Include(d => d.Employees)
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == id);

        if (department == null) return null;

        return new DepartmentDto
        {
            Id = department.Id,
            Code = department.Code,
            Name = department.Name,
            Description = department.Description,
            EmployeeCount = department.Employees.Count,
            CreatedAt = department.CreatedAt,
            UpdatedAt = department.UpdatedAt
        };
    }

    public async Task<DepartmentDto> CreateDepartmentAsync(CreateDepartmentDto dto)
    {
        var codeTrimmed = dto.Code.Trim().ToUpper();
        var nameTrimmed = dto.Name.Trim();

        var codeExists = await _context.Departments.AnyAsync(d => d.Code.ToUpper() == codeTrimmed);
        if (codeExists)
        {
            throw new InvalidOperationException($"Department code '{codeTrimmed}' is already in use.");
        }

        var nameExists = await _context.Departments.AnyAsync(d => d.Name.ToLower() == nameTrimmed.ToLower());
        if (nameExists)
        {
            throw new InvalidOperationException($"Department with name '{nameTrimmed}' already exists.");
        }

        var department = new Department
        {
            Code = codeTrimmed,
            Name = nameTrimmed,
            Description = dto.Description?.Trim()
        };

        await _context.Departments.AddAsync(department);
        await _context.SaveChangesAsync();

        return new DepartmentDto
        {
            Id = department.Id,
            Code = department.Code,
            Name = department.Name,
            Description = department.Description,
            EmployeeCount = 0,
            CreatedAt = department.CreatedAt,
            UpdatedAt = department.UpdatedAt
        };
    }

    public async Task<DepartmentDto?> UpdateDepartmentAsync(int id, UpdateDepartmentDto dto)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department == null) return null;

        var codeTrimmed = dto.Code.Trim().ToUpper();
        var nameTrimmed = dto.Name.Trim();

        var codeExists = await _context.Departments.AnyAsync(d => d.Id != id && d.Code.ToUpper() == codeTrimmed);
        if (codeExists)
        {
            throw new InvalidOperationException($"Department code '{codeTrimmed}' is already in use.");
        }

        var nameExists = await _context.Departments.AnyAsync(d => d.Id != id && d.Name.ToLower() == nameTrimmed.ToLower());
        if (nameExists)
        {
            throw new InvalidOperationException($"Department with name '{nameTrimmed}' already exists.");
        }

        department.Code = codeTrimmed;
        department.Name = nameTrimmed;
        department.Description = dto.Description?.Trim();

        await _context.SaveChangesAsync();

        return await GetDepartmentByIdAsync(id);
    }

    public async Task<bool> DeleteDepartmentAsync(int id)
    {
        var department = await _context.Departments
            .Include(d => d.Employees)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (department == null) return false;

        if (department.Employees.Any())
        {
            throw new InvalidOperationException($"Cannot delete department '{department.Name}' because it has {department.Employees.Count} active employee(s). Reassign or remove employees first.");
        }

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();
        return true;
    }
}

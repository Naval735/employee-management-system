using EmployeeManagement.Application.DTOs.Department;

namespace EmployeeManagement.Application.Interfaces;

public interface IDepartmentService
{
    Task<IEnumerable<DepartmentDto>> GetAllDepartmentsAsync();
    Task<DepartmentDto?> GetDepartmentByIdAsync(int id);
    Task<DepartmentDto> CreateDepartmentAsync(CreateDepartmentDto dto);
    Task<DepartmentDto?> UpdateDepartmentAsync(int id, UpdateDepartmentDto dto);
    Task<bool> DeleteDepartmentAsync(int id);
}

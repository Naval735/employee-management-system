using EmployeeManagement.Application.DTOs.Common;
using EmployeeManagement.Application.DTOs.Employee;

namespace EmployeeManagement.Application.Interfaces;

public interface IEmployeeService
{
    Task<PaginatedResult<EmployeeDto>> GetEmployeesAsync(EmployeeQueryParameters query);
    Task<EmployeeDto?> GetEmployeeByIdAsync(int id);
    Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto dto);
    Task<EmployeeDto?> UpdateEmployeeAsync(int id, UpdateEmployeeDto dto);
    Task<bool> DeleteEmployeeAsync(int id);
    Task<int> BulkDeleteEmployeesAsync(List<int> ids);
}

using EmployeeManagement.Application.DTOs.Common;
using EmployeeManagement.Application.DTOs.Employee;
using EmployeeManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _employeeService;

    public EmployeesController(IEmployeeService employeeService)
    {
        _employeeService = employeeService;
    }

    /// <summary>
    /// Get paginated list of employees with search and filter options.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<EmployeeDto>>> GetEmployees([FromQuery] EmployeeQueryParameters query)
    {
        var result = await _employeeService.GetEmployeesAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get employee details by ID.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<EmployeeDto>> GetEmployeeById(int id)
    {
        var employee = await _employeeService.GetEmployeeByIdAsync(id);
        if (employee == null)
        {
            return NotFound($"Employee with ID {id} was not found.");
        }
        return Ok(employee);
    }

    /// <summary>
    /// Create a new employee.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<EmployeeDto>> CreateEmployee([FromBody] CreateEmployeeDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var createdEmployee = await _employeeService.CreateEmployeeAsync(dto);
        return CreatedAtAction(nameof(GetEmployeeById), new { id = createdEmployee.Id }, createdEmployee);
    }

    /// <summary>
    /// Update existing employee details.
    /// </summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<EmployeeDto>> UpdateEmployee(int id, [FromBody] UpdateEmployeeDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updatedEmployee = await _employeeService.UpdateEmployeeAsync(id, dto);
        if (updatedEmployee == null)
        {
            return NotFound($"Employee with ID {id} was not found.");
        }

        return Ok(updatedEmployee);
    }

    /// <summary>
    /// Delete single employee by ID.
    /// </summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        var success = await _employeeService.DeleteEmployeeAsync(id);
        if (!success)
        {
            return NotFound($"Employee with ID {id} was not found.");
        }

        return NoContent();
    }

    /// <summary>
    /// Bulk delete multiple employees by IDs.
    /// </summary>
    [HttpPost("bulk-delete")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<object>> BulkDelete([FromBody] BulkDeleteRequestDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var deletedCount = await _employeeService.BulkDeleteEmployeesAsync(dto.EmployeeIds);
        return Ok(new { message = $"Successfully deleted {deletedCount} employee(s).", count = deletedCount });
    }
}

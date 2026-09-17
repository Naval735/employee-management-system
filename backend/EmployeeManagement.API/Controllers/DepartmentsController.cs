using EmployeeManagement.Application.DTOs.Department;
using EmployeeManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DepartmentsController : ControllerBase
{
    private readonly IDepartmentService _departmentService;

    public DepartmentsController(IDepartmentService departmentService)
    {
        _departmentService = departmentService;
    }

    /// <summary>
    /// Get all departments with employee counts.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetDepartments()
    {
        var departments = await _departmentService.GetAllDepartmentsAsync();
        return Ok(departments);
    }

    /// <summary>
    /// Get single department by ID.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<DepartmentDto>> GetDepartmentById(int id)
    {
        var department = await _departmentService.GetDepartmentByIdAsync(id);
        if (department == null)
        {
            return NotFound($"Department with ID {id} was not found.");
        }

        return Ok(department);
    }

    /// <summary>
    /// Add a new department.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<DepartmentDto>> CreateDepartment([FromBody] CreateDepartmentDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var department = await _departmentService.CreateDepartmentAsync(dto);
        return CreatedAtAction(nameof(GetDepartmentById), new { id = department.Id }, department);
    }

    /// <summary>
    /// Update existing department details.
    /// </summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<DepartmentDto>> UpdateDepartment(int id, [FromBody] UpdateDepartmentDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updatedDepartment = await _departmentService.UpdateDepartmentAsync(id, dto);
        if (updatedDepartment == null)
        {
            return NotFound($"Department with ID {id} was not found.");
        }

        return Ok(updatedDepartment);
    }

    /// <summary>
    /// Delete department by ID (must have 0 assigned employees).
    /// </summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteDepartment(int id)
    {
        var success = await _departmentService.DeleteDepartmentAsync(id);
        if (!success)
        {
            return NotFound($"Department with ID {id} was not found.");
        }

        return NoContent();
    }
}

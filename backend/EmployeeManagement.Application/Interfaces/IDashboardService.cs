using EmployeeManagement.Application.DTOs.Dashboard;

namespace EmployeeManagement.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetDashboardSummaryAsync();
}

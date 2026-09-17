using EmployeeManagement.Application.DTOs.Auth;

namespace EmployeeManagement.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
    Task<UserDto?> GetCurrentUserAsync(int userId);
}

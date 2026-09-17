using EmployeeManagement.Application.DTOs.Auth;
using EmployeeManagement.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Services;

public class AuthService : IAuthService
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        IApplicationDbContext context,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
    {
        var input = request.UsernameOrEmail.Trim().ToLower();
        var user = await _context.Users
            .Include(u => u.Employee)
            .FirstOrDefaultAsync(u => u.Username.ToLower() == input || u.Email.ToLower() == input);

        if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid username/email or password.");
        }

        var (token, expiration) = _jwtTokenGenerator.GenerateToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Expiration = expiration,
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString(),
                EmployeeId = user.EmployeeId,
                FullName = user.Employee?.FullName
            }
        };
    }

    public async Task<UserDto?> GetCurrentUserAsync(int userId)
    {
        var user = await _context.Users
            .Include(u => u.Employee)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role.ToString(),
            EmployeeId = user.EmployeeId,
            FullName = user.Employee?.FullName
        };
    }
}

using EmployeeManagement.Domain.Entities;

namespace EmployeeManagement.Application.Interfaces;

public interface IJwtTokenGenerator
{
    (string token, DateTime expiration) GenerateToken(User user);
}

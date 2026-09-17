using EmployeeManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Department> Departments { get; }
    DbSet<Employee> Employees { get; }
    DbSet<Attendance> Attendances { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

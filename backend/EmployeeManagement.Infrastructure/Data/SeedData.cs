using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace EmployeeManagement.Infrastructure.Data;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await context.Database.EnsureCreatedAsync();

        // 1. Seed Departments
        if (!await context.Departments.AnyAsync())
        {
            var departments = new List<Department>
            {
                new Department { Code = "ENG", Name = "Engineering", Description = "Software Engineering, Infrastructure & QA" },
                new Department { Code = "HR", Name = "Human Resources", Description = "Talent Acquisition, Employee Welfare & HR Operations" },
                new Department { Code = "FIN", Name = "Finance & Accounting", Description = "Payroll, Financial Planning & Accounts" },
                new Department { Code = "MKT", Name = "Marketing", Description = "Brand Management, Digital Marketing & PR" },
                new Department { Code = "OPS", Name = "Operations", Description = "Business Operations, Logistics & Support" }
            };

            await context.Departments.AddRangeAsync(departments);
            await context.SaveChangesAsync();
        }

        var engDept = await context.Departments.FirstAsync(d => d.Code == "ENG");
        var hrDept = await context.Departments.FirstAsync(d => d.Code == "HR");
        var finDept = await context.Departments.FirstAsync(d => d.Code == "FIN");
        var mktDept = await context.Departments.FirstAsync(d => d.Code == "MKT");
        var opsDept = await context.Departments.FirstAsync(d => d.Code == "OPS");

        // 2. Seed Employees
        if (!await context.Employees.AnyAsync())
        {
            var employees = new List<Employee>
            {
                new Employee
                {
                    EmployeeCode = "EMP-001",
                    FirstName = "Alex",
                    LastName = "Morgan",
                    Email = "alex.morgan@company.com",
                    Phone = "+1 (555) 123-4567",
                    DateOfBirth = new DateTime(1990, 4, 15),
                    Gender = Gender.Male,
                    Address = "100 Tech Plaza, San Francisco, CA",
                    DepartmentId = engDept.Id,
                    Designation = "Senior Software Engineer",
                    JoiningDate = new DateTime(2022, 1, 15),
                    Salary = 115000.00m,
                    EmploymentStatus = EmploymentStatus.FullTime
                },
                new Employee
                {
                    EmployeeCode = "EMP-002",
                    FirstName = "Sarah",
                    LastName = "Jenkins",
                    Email = "sarah.jenkins@company.com",
                    Phone = "+1 (555) 234-5678",
                    DateOfBirth = new DateTime(1993, 8, 22),
                    Gender = Gender.Female,
                    Address = "456 Market St, San Francisco, CA",
                    DepartmentId = hrDept.Id,
                    Designation = "HR Manager",
                    JoiningDate = new DateTime(2021, 6, 1),
                    Salary = 92000.00m,
                    EmploymentStatus = EmploymentStatus.FullTime
                },
                new Employee
                {
                    EmployeeCode = "EMP-003",
                    FirstName = "David",
                    LastName = "Chen",
                    Email = "david.chen@company.com",
                    Phone = "+1 (555) 345-6789",
                    DateOfBirth = new DateTime(1988, 11, 30),
                    Gender = Gender.Male,
                    Address = "789 Financial Way, New York, NY",
                    DepartmentId = finDept.Id,
                    Designation = "Lead Financial Analyst",
                    JoiningDate = new DateTime(2020, 3, 10),
                    Salary = 105000.00m,
                    EmploymentStatus = EmploymentStatus.FullTime
                },
                new Employee
                {
                    EmployeeCode = "EMP-004",
                    FirstName = "Emily",
                    LastName = "Watson",
                    Email = "emily.watson@company.com",
                    Phone = "+1 (555) 456-7890",
                    DateOfBirth = new DateTime(1995, 2, 14),
                    Gender = Gender.Female,
                    Address = "321 Creative Ave, Austin, TX",
                    DepartmentId = mktDept.Id,
                    Designation = "Marketing Specialist",
                    JoiningDate = new DateTime(2023, 2, 20),
                    Salary = 78000.00m,
                    EmploymentStatus = EmploymentStatus.FullTime
                },
                new Employee
                {
                    EmployeeCode = "EMP-005",
                    FirstName = "Robert",
                    LastName = "Taylor",
                    Email = "robert.taylor@company.com",
                    Phone = "+1 (555) 567-8901",
                    DateOfBirth = new DateTime(1992, 9, 5),
                    Gender = Gender.Male,
                    Address = "654 Operations Rd, Chicago, IL",
                    DepartmentId = opsDept.Id,
                    Designation = "Operations Coordinator",
                    JoiningDate = new DateTime(2023, 8, 12),
                    Salary = 72000.00m,
                    EmploymentStatus = EmploymentStatus.FullTime
                },
                new Employee
                {
                    EmployeeCode = "EMP-006",
                    FirstName = "Jessica",
                    LastName = "Alba",
                    Email = "jessica.alba@company.com",
                    Phone = "+1 (555) 678-9012",
                    DateOfBirth = new DateTime(1996, 5, 18),
                    Gender = Gender.Female,
                    Address = "987 Backend St, Seattle, WA",
                    DepartmentId = engDept.Id,
                    Designation = "Full Stack Developer",
                    JoiningDate = new DateTime(2024, 1, 10),
                    Salary = 98000.00m,
                    EmploymentStatus = EmploymentStatus.FullTime
                }
            };

            await context.Employees.AddRangeAsync(employees);
            await context.SaveChangesAsync();
        }

        // 3. Seed Admin & HR Users
        if (!await context.Users.AnyAsync())
        {
            var adminEmployee = await context.Employees.FirstAsync(e => e.EmployeeCode == "EMP-001");
            var hrEmployee = await context.Employees.FirstAsync(e => e.EmployeeCode == "EMP-002");

            string hashedAdminPassword = BCrypt.Net.BCrypt.HashPassword("Admin@123");
            string hashedHrPassword = BCrypt.Net.BCrypt.HashPassword("Hr@123");

            var users = new List<User>
            {
                new User
                {
                    Username = "admin",
                    Email = "admin@company.com",
                    PasswordHash = hashedAdminPassword,
                    Role = UserRole.Admin,
                    EmployeeId = adminEmployee.Id
                },
                new User
                {
                    Username = "hr",
                    Email = "hr@company.com",
                    PasswordHash = hashedHrPassword,
                    Role = UserRole.HR,
                    EmployeeId = hrEmployee.Id
                }
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
        }

        // 4. Seed Attendance Records for Today and Past 7 Days
        if (!await context.Attendances.AnyAsync())
        {
            var allEmployees = await context.Employees.ToListAsync();
            var attendances = new List<Attendance>();
            var today = DateTime.UtcNow.Date;

            for (int i = 0; i < 7; i++)
            {
                var date = today.AddDays(-i);
                if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                    continue;

                foreach (var emp in allEmployees)
                {
                    AttendanceStatus status;
                    string? remarks = null;

                    if (emp.EmployeeCode == "EMP-001" || emp.EmployeeCode == "EMP-002" || emp.EmployeeCode == "EMP-003")
                    {
                        status = AttendanceStatus.Present;
                        remarks = "On time";
                    }
                    else if (emp.EmployeeCode == "EMP-004" && i == 0)
                    {
                        status = AttendanceStatus.Leave;
                        remarks = "Casual Leave";
                    }
                    else if (emp.EmployeeCode == "EMP-005" && i == 1)
                    {
                        status = AttendanceStatus.HalfDay;
                        remarks = "Medical appointment in morning";
                    }
                    else if (emp.EmployeeCode == "EMP-006" && i == 2)
                    {
                        status = AttendanceStatus.Absent;
                        remarks = "Uninformed absence";
                    }
                    else
                    {
                        status = AttendanceStatus.Present;
                        remarks = "Regular shift";
                    }

                    attendances.Add(new Attendance
                    {
                        EmployeeId = emp.Id,
                        Date = date,
                        Status = status,
                        Remarks = remarks
                    });
                }
            }

            await context.Attendances.AddRangeAsync(attendances);
            await context.SaveChangesAsync();
        }
    }
}

-- ====================================================================
-- Employee Management System - Seed Data Script (MySQL)
-- ====================================================================

USE `employeemanagement`;

-- 1. Seed Departments
INSERT IGNORE INTO `Departments` (`Id`, `Code`, `Name`, `Description`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'ENG', 'Engineering', 'Software Engineering, Infrastructure & QA', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(2, 'HR', 'Human Resources', 'Talent Acquisition, Employee Welfare & HR Operations', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(3, 'FIN', 'Finance & Accounting', 'Payroll, Financial Planning & Accounts', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(4, 'MKT', 'Marketing', 'Brand Management, Digital Marketing & PR', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(5, 'OPS', 'Operations', 'Business Operations, Logistics & Support', UTC_TIMESTAMP(), UTC_TIMESTAMP());

-- 2. Seed Employees
INSERT IGNORE INTO `Employees` (`Id`, `EmployeeCode`, `FirstName`, `LastName`, `Email`, `Phone`, `DateOfBirth`, `Gender`, `Address`, `DepartmentId`, `Designation`, `JoiningDate`, `Salary`, `EmploymentStatus`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'EMP-001', 'Alex', 'Morgan', 'alex.morgan@company.com', '+1 (555) 123-4567', '1990-04-15', 'Male', '100 Tech Plaza, San Francisco, CA', 1, 'Senior Software Engineer', '2022-01-15', 115000.00, 'FullTime', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(2, 'EMP-002', 'Sarah', 'Jenkins', 'sarah.jenkins@company.com', '+1 (555) 234-5678', '1993-08-22', 'Female', '456 Market St, San Francisco, CA', 2, 'HR Manager', '2021-06-01', 92000.00, 'FullTime', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(3, 'EMP-003', 'David', 'Chen', 'david.chen@company.com', '+1 (555) 345-6789', '1988-11-30', 'Male', '789 Financial Way, New York, NY', 3, 'Lead Financial Analyst', '2020-03-10', 105000.00, 'FullTime', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(4, 'EMP-004', 'Emily', 'Watson', 'emily.watson@company.com', '+1 (555) 456-7890', '1995-02-14', 'Female', '321 Creative Ave, Austin, TX', 4, 'Marketing Specialist', '2023-02-20', 78000.00, 'FullTime', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(5, 'EMP-005', 'Robert', 'Taylor', 'robert.taylor@company.com', '+1 (555) 567-8901', '1992-09-05', 'Male', '654 Operations Rd, Chicago, IL', 5, 'Operations Coordinator', '2023-08-12', 72000.00, 'FullTime', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(6, 'EMP-006', 'Jessica', 'Alba', 'jessica.alba@company.com', '+1 (555) 678-9012', '1996-05-18', 'Female', '987 Backend St, Seattle, WA', 1, 'Full Stack Developer', '2024-01-10', 98000.00, 'FullTime', UTC_TIMESTAMP(), UTC_TIMESTAMP());

-- 3. Seed Users (BCrypt Hashes: 'Admin@123' and 'Hr@123')
INSERT IGNORE INTO `Users` (`Id`, `Username`, `Email`, `PasswordHash`, `Role`, `EmployeeId`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'admin', 'admin@company.com', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 1, UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(2, 'hr', 'hr@company.com', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'HR', 2, UTC_TIMESTAMP(), UTC_TIMESTAMP());

-- 4. Seed Attendance Logs
INSERT IGNORE INTO `Attendance` (`EmployeeId`, `Date`, `Status`, `Remarks`, `CreatedAt`, `UpdatedAt`) VALUES
(1, CURRENT_DATE(), 'Present', 'On time', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(2, CURRENT_DATE(), 'Present', 'On time', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(3, CURRENT_DATE(), 'Present', 'On time', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(4, CURRENT_DATE(), 'Leave', 'Casual Leave', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(5, CURRENT_DATE(), 'Present', 'Regular shift', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(6, CURRENT_DATE(), 'Present', 'Regular shift', UTC_TIMESTAMP(), UTC_TIMESTAMP());

# Employee Management System (EMS)

A complete, production-grade **Employee Management System** built with **ASP.NET Core 8 Web API**, **Entity Framework Core**, **MySQL**, **React 18**, **TypeScript**, **Vite**, **Bootstrap 5**, and **Recharts**.

Designed and structured according to **Clean Architecture** principles to demonstrate enterprise development standards, security, automated data validation, document generation (PDF & Excel), and executive analytics.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Architecture & Design](#architecture--design)
5. [Database Schema & ERD](#database-schema--erd)
6. [Demo Credentials](#demo-credentials)
7. [Prerequisites](#prerequisites)
8. [Setup & Running Locally](#setup--running-locally)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
   - [MySQL Database Setup](#mysql-database-setup)
9. [API Documentation (Swagger)](#api-documentation-swagger)
10. [Automated Integration Testing](#automated-integration-testing)
11. [Reports & Document Generation](#reports--document-generation)
12. [Bonus Features](#bonus-features)
13. [Loom Video Presentation Script](#loom-video-presentation-script)

---

## Project Overview

The **Employee Management System** replaces manual HR spreadsheets and paper-based tracking with a secure digital portal. The system automates workforce record keeping, department structuring, daily attendance turnout tracking, salary/compensation oversight, and multi-format reporting with one-click PDF & Excel exports.

---

## Features

### 1. Security & Authentication
- **BCrypt Password Hashing**: Salt-hashed passwords stored in the database; zero plain-text storage.
- **JWT Authentication**: HMAC-SHA256 bearer tokens with user ID, username, email, and role claims.
- **Role-Based Access Control (RBAC)**: Supports `Admin` and `HR` roles with endpoint authorization guards.
- **Global Exception Handling**: Centralized error middleware returning clean standardized JSON responses for `401 Unauthorized`, `400 Bad Request`, `404 Not Found`, etc.
- **Client Security**: Axios request & response interceptors with automatic token attachment and 401 token-expiry redirection to `/login`.

### 2. Employee Management
- **Full CRUD Operations**: Add, view, edit, single delete, and bulk delete.
- **Multi-Field Search**: Instant server-side search across Employee Name, Email, and Employee Code.
- **Filtering & Pagination**: Department filter, employment status filter, sorting, and pagination.
- **Auto Code Generation**: Automatic sequential employee IDs (e.g. `EMP-007`) if left unspecified.
- **Validation**: Email syntax, phone validation, salary positive range, and duplicate email prevention.

### 3. Department Management
- Add, edit, and list departments with automated employee headcount badges.
- **Referential Safety**: Strict deletion protection prevents removing departments with active employees.

### 4. Daily Attendance Tracking
- Mark attendance status (`Present`, `Absent`, `Leave`, `HalfDay`) with optional remarks.
- **Duplicate Prevention**: Database and application-level unique constraint on `(EmployeeId, Date)`.
- **Real-Time Turnout Widget**: Live statistics tracking Active Count, Present, Absent, Leaves, and turnout rate (`%`).
- **Date Range Filters**: Filter attendance records by employee, status, or date range.

### 5. Document Reports & Exports
- **Employee Directory Report**: Full staff roster.
- **Department Summary Report**: Headcount, payroll expense, and average department salary.
- **Attendance Log Report**: Turnout logs with custom date range filters.
- **Salary & Payroll Report**: Monthly and annual payroll expense breakdowns.
- **Exports**:
  - **Excel (`.xlsx`)**: Formatted spreadsheets via **ClosedXML** with branded headers, currency formats, and auto-sized columns.
  - **PDF (`.pdf`)**: Printable document generation via **QuestPDF** with tables, headers, footers, and page numbers.

### 6. Executive HR Dashboard & Analytics
- **KPI Metrics**: Total Employees, Total Departments, Present Today, On Leave Today, Monthly Payroll, Average Salary.
- **Interactive Visualizations (Recharts)**:
  - *Employees by Department* (Donut/Pie Chart with legend)
  - *Salary Distribution* (Bar Chart across compensation tiers)
  - *Today's Attendance Breakdown* (Turnout status pie chart)
  - *Hiring Trends Analysis* (Line chart tracking monthly hiring trends)
- **Live Activity Feeds**: Recently onboarded employees and today's latest check-in logs.

---

## Technology Stack

### Backend
- **Framework**: ASP.NET Core 8 / 9 Web API (C#)
- **ORM**: Entity Framework Core
- **Database**: MySQL 8.0+ (Auto-fallbacks to SQLite `employeemanagement.db` if MySQL server is stopped)
- **Authentication**: JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- **Password Hashing**: `BCrypt.Net-Next`
- **Spreadsheets**: `ClosedXML`
- **PDF Generation**: `QuestPDF`
- **API Documentation**: `Swashbuckle.AspNetCore` (Swagger OpenAPI v1)

### Frontend
- **Framework**: React 18 + TypeScript
- **Tooling**: Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with Request & Response Interceptors
- **Styling**: Bootstrap 5 + Bootstrap Icons
- **Data Visualization**: Recharts

---

## Architecture & Design

The backend uses a **Clean 4-Layer Architecture** to enforce separation of concerns, testability, and maintainability:

```
EmployeeManagement/
│
├── backend/
│   ├── EmployeeManagement.API/              # Controllers, Middleware, Swagger, Program.cs
│   ├── EmployeeManagement.Application/      # DTOs, Service Interfaces, Business Logic
│   ├── EmployeeManagement.Domain/           # Entities, Enums, BaseEntity
│   └── EmployeeManagement.Infrastructure/   # DbContext, Migrations, BCrypt, ClosedXML, QuestPDF
│
├── frontend/
│   └── employee-management-ui/              # React 18 + TypeScript + Vite + Bootstrap UI
│
├── database/
│   └── scripts/                             # schema.sql & seed.sql
│
├── docs/                                    # Loom video script & documentation
├── test_e2e.ps1                             # Automated 15-point E2E integration test suite
├── README.md
└── .gitignore
```

---

## Database Schema & ERD

```
┌─────────────────┐       1 : N       ┌─────────────────┐
│   Department    ├───────────────────<    Employee     │
└─────────────────┘                   └────────┬────────┘
                                               │
                                       1 : N   │   0..1 : 1
                                               │
                                      ┌────────┴────────┐       ┌─────────────────┐
                                      │   Attendance    │       │      User       │
                                      └─────────────────┘       └─────────────────┘
```

1. **`Users`**: `Id`, `Username` (UQ), `Email` (UQ), `PasswordHash`, `Role` (`Admin`/`HR`), `EmployeeId` (FK), `CreatedAt`, `UpdatedAt`.
2. **`Departments`**: `Id`, `Code` (UQ), `Name`, `Description`, `CreatedAt`, `UpdatedAt`.
3. **`Employees`**: `Id`, `EmployeeCode` (UQ), `FirstName`, `LastName`, `Email` (UQ), `Phone`, `DateOfBirth`, `Gender`, `Address`, `DepartmentId` (FK), `Designation`, `JoiningDate`, `Salary`, `EmploymentStatus`, `CreatedAt`, `UpdatedAt`.
4. **`Attendance`**: `Id`, `EmployeeId` (FK), `Date`, `Status` (`Present`/`Absent`/`Leave`/`HalfDay`), `Remarks`, `CreatedAt`, `UpdatedAt`. *(Unique index on `EmployeeId` + `Date`)*.

---

## Demo Credentials

The database automatically seeds two pre-configured accounts:

| Role | Username | Email | Password | Permissions |
|---|---|---|---|---|
| **Administrator** | `admin` | `admin@company.com` | `Admin@123` | Full access: CRUD, Bulk Delete, Department Management |
| **HR Specialist** | `hr` | `hr@company.com` | `Hr@123` | Staff Management, Attendance, Reports, Profile |

> **Note**: The login screen features **Quick Demo Credentials** buttons to instantly autofill either account for testing.

---

## Prerequisites

- [.NET 8 or 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js (v18+) & npm](https://nodejs.org/)
- [MySQL Server 8.0+](https://dev.mysql.com/downloads/mysql/) *(Optional - automatic SQLite fallback is included)*

---

## Setup & Running Locally

### Backend Setup

1. Open a terminal in the project directory:
   ```bash
   cd backend
   ```
2. Build the solution:
   ```bash
   dotnet build EmployeeManagement.sln
   ```
3. Run the Web API:
   ```bash
   dotnet run --project EmployeeManagement.API/EmployeeManagement.API.csproj --urls http://localhost:5000
   ```
   *The API will start listening on `http://localhost:5000` and seed default demo data automatically on first launch.*

### Frontend Setup

1. Open a second terminal window:
   ```bash
   cd frontend/employee-management-ui
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### MySQL Database Setup

If using MySQL:
1. Ensure MySQL Server is running on `localhost:3306`.
2. Update connection string in `backend/EmployeeManagement.API/appsettings.json` if your root password differs:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=employeemanagement;User=root;Password=YOUR_PASSWORD;"
   }
   ```
3. Alternatively, you can execute the SQL scripts directly in MySQL Workbench:
   ```bash
   mysql -u root -p < database/scripts/schema.sql
   mysql -u root -p < database/scripts/seed.sql
   ```

---

## API Documentation (Swagger)

When the backend API is running, interactive OpenAPI/Swagger documentation is available at:

```
http://localhost:5000/swagger
```

### Key Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate & retrieve JWT Bearer token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/employees` | Search, filter, and paginate employee records |
| `POST` | `/api/employees` | Create employee (auto code generation) |
| `PUT` | `/api/employees/{id}` | Update employee |
| `DELETE` | `/api/employees/{id}` | Delete employee |
| `POST` | `/api/employees/bulk-delete` | Delete multiple employees by ID list |
| `GET` | `/api/departments` | List departments with employee count |
| `POST` | `/api/departments` | Add department |
| `DELETE` | `/api/departments/{id}` | Delete department (validates active headcount) |
| `GET` | `/api/attendance` | Filter attendance by date range or employee |
| `POST` | `/api/attendance` | Mark attendance (duplicate entry protection) |
| `GET` | `/api/attendance/summary` | Today's turnout summary and rates |
| `GET` | `/api/dashboard/summary` | Executive KPI cards and charts analytics |
| `GET` | `/api/reports/employees/excel` | Export employee directory as ClosedXML Excel |
| `GET` | `/api/reports/employees/pdf` | Export employee directory as QuestPDF document |
| `GET` | `/api/reports/attendance/excel` | Export attendance report as Excel |
| `GET` | `/api/reports/attendance/pdf` | Export attendance report as PDF |
| `GET` | `/api/reports/salary/excel` | Export payroll summary as Excel |
| `GET` | `/api/reports/salary/pdf` | Export payroll summary as PDF |

---

## Automated Integration Testing

An automated 15-test integration suite is included in [`test_e2e.ps1`](file:///E:/Desktop/kamal%20web/Employee%20management%20system/test_e2e.ps1).

With the backend running on `http://localhost:5000`, run:

```powershell
powershell -ExecutionPolicy Bypass -File test_e2e.ps1
```

**Results**:
```
==========================================================
 Starting End-to-End Integration Verification Tests 
==========================================================
[PASS] Unauthorized API access blocked
[PASS] Admin Login returns JWT token
[PASS] Get Authenticated Profile (/api/auth/me)
[PASS] Get Departments with EmployeeCount
[PASS] Search Employee by Name
[PASS] Create New Employee
[PASS] Duplicate Email Validation prevents conflict
[PASS] Update Employee Record
[PASS] Mark Attendance Record
[PASS] Prevent Duplicate Attendance for same date
[PASS] Department Deletion Safety Rule (Prevent deleting dept with active employees)
[PASS] Dashboard Analytics Summary
[PASS] Excel Report Generation (.xlsx)
[PASS] PDF Report Generation (.pdf)
[PASS] Delete Employee Record (Admin only)
==========================================================
 Verification Completed: 15 PASSED, 0 FAILED 
==========================================================
```

---

## Reports & Document Generation

The system features real-time generation of binary document formats:

- **Excel (`.xlsx`)**: Generated dynamically in-memory using **ClosedXML**, with navy and emerald headers, borders, number/currency formatting, and column width auto-fit.
- **PDF (`.pdf`)**: Generated dynamically via **QuestPDF** with professional tabular formatting, corporate headers, page numbering (`Page X of Y`), and timestamps.

---

## Bonus Features

- **Hiring Trend Analysis**: Dynamic monthly hiring velocity chart rendered on the dashboard.
- **Salary Tier Distribution**: Headcount breakdown across compensation bands.
- **Turnout Percentage Calculation**: Automatic daily attendance rate percentage computation.
- **Bulk Employee Deletion**: Multi-record selection and deletion for administrators.
- **Auto-Failover Database Architecture**: Seamless fallback to local SQLite if MySQL server is offline during interview evaluations.

---

## Loom Video Presentation Script

For a structured walkthrough to accompany video presentations, refer to [`docs/loom_script.md`](file:///E:/Desktop/kamal%20web/Employee%20management%20system/docs/loom_script.md).

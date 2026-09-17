# Loom Video Presentation Script: Employee Management System

**Target Duration**: ~6–8 Minutes  
**Speaker**: Full-Stack ASP.NET Core & React Developer  
**Audience**: Technical Interviewers / Hiring Managers

---

## 1. Introduction (0:00 - 0:45)

> *"Hi everyone, thank you for reviewing my hiring assignment. Today, I'm excited to present my Employee Management System. This full-stack application was built to replace error-prone, manual HR processes with a modern digital platform that manages employees, departments, daily attendance, compensation, and analytics.*
>
> *I built this application using a production-grade **Clean 4-Layer Architecture** in **ASP.NET Core 8 Web API** paired with **MySQL / EF Core**, and a modern, responsive frontend built with **React 18, TypeScript, Vite, Bootstrap 5, and Recharts**.*
>
> *Let’s dive straight into the live demonstration."*

---

## 2. Authentication & Security (0:45 - 1:45)

*(Screen: Navigate to `http://localhost:5173/login`)*

> *"Starting on the login page, security is a core foundation of this project.*
> - *Passwards are securely hashed using **BCrypt** with salt on the backend. Zero plain-text credentials exist.*
> - *Authentication is handled via **HMAC-SHA256 JWT tokens** containing role claims, expiration, and user identifiers.*
> - *Notice our quick demo credential buttons: we have two distinct roles: **Admin** and **HR**.*
>
> *Let's log in with the **Admin** credentials.*
>
> *Upon submitting, the backend issues our token, and our frontend Axios interceptor stores it and automatically attaches the `Bearer <token>` header to all subsequent API requests. If a token ever expires, the interceptor cleanly catches the 401 response and redirects the user to the login screen without crashing."*

---

## 3. Executive HR Dashboard & Analytics (1:45 - 3:00)

*(Screen: Navigate to `/dashboard`)*

> *"Once authenticated, we land on the **Executive HR Dashboard**.*
> - *Across the top, we see real-time KPI cards: **Total Employees**, **Departments**, **Today's Turnout** (5 Present, 1 on Leave), and **Monthly Payroll Summary**.*
> - *Below that, we have interactive visualizations built using **Recharts**:*
>   1. *First, the **Department Distribution** donut chart, displaying employee percentages across Engineering, HR, Finance, Marketing, and Operations.*
>   2. *Next, the **Salary Distribution** bar chart, categorizing employees into compensation tiers.*
>   3. *Third, **Today's Attendance Breakdown** donut chart, showing real-time turnout proportions.*
>   4. *And as a bonus feature, the **Hiring Trend Analysis** chart, tracking monthly talent acquisition over time.*
> - *At the bottom, we see two live feeds: recently onboarded employees and today's latest attendance activity.*
>
> *All of this data is aggregated directly on the backend via a high-performance LINQ query inside `DashboardService`."*

---

## 4. Employee Management & Bulk Operations (3:00 - 4:15)

*(Screen: Navigate to `/employees`)*

> *"Next, let's look at the **Employee Directory**.*
> - *The table features server-side pagination, sorting, status badges, and search.*
> - *I can search by name, email, or employee code — for example, typing 'Morgan' instantly filters the directory.*
> - *We can also filter by department and employment status.*
> - *Notice the bulk selection checkboxes: as an Administrator, I can select multiple employees and perform a **Bulk Deletion** with a single click, protected by a safety confirmation modal.*
>
> *Let's click **Add Employee**.*
> - *The form features full validation: required fields, email format, phone validation, and joining date.*
> - *The system automatically generates a unique employee code like `EMP-007` if left blank, and validates against duplicate emails on the backend before committing to the database.*
> - *Clicking on an employee takes us to their profile page, displaying their personal info, compensation, and their recent attendance history."*

---

## 5. Department Management & Deletion Safety (4:15 - 5:15)

*(Screen: Navigate to `/departments`)*

> *"In the **Departments** module, each department is presented with its unique code, description, and an aggregated active employee count badge.*
> - *We can add new departments or edit existing ones using an inline modal.*
> - *Crucially, we implemented an essential business rule: **a department with active employees cannot be deleted**.*
> - *If I attempt to delete 'Engineering', the backend rejects the operation with an explicit message explaining that active employees must be reassigned first. This preserves referential integrity at both the database and business logic layers."*

---

## 6. Daily Attendance Tracking (5:15 - 6:15)

*(Screen: Navigate to `/attendance`)*

> *"Moving to **Attendance Management**:*
> - *The top overview widget calculates today's turnout metrics: active headcount, present, absent, on leave, half-day, and turnout rate percentage.*
> - *HR or Admin can click **Mark Attendance** to record check-in status and remarks for any employee on a specific date.*
> - *We enforce a strict **unique constraint** on `(EmployeeId, Date)`: if someone attempts to mark attendance twice for the same employee on the same day, the system prevents the duplicate entry.*
> - *We can filter attendance records by employee, status, or a custom start and end date range."*

---

## 7. Reporting & Excel / PDF Export (6:15 - 7:15)

*(Screen: Navigate to `/reports`)*

> *"Now let's examine the **Report Center**.*
> - *We provide four dedicated reports: **Employee Directory**, **Department Breakdown**, **Attendance Logs**, and **Salary & Payroll Summary**.*
> - *Users can view a live tabular preview right in the browser.*
> - *With a single click, users can download:*
>   1. *An **Excel spreadsheet (.xlsx)** generated via **ClosedXML**, with branded header styling, column auto-fitting, and formatted numbers.*
>   2. *A **PDF document (.pdf)** generated using **QuestPDF**, with formatted headers, borders, pagination, and timestamps.*
>
> *Let's click **Download PDF** — as you can see, the document downloads instantly with clean, printable formatting."*

---

## 8. Backend Architecture & Clean Code (7:15 - 8:00)

*(Screen: Quick code tour in IDE or Swagger `/swagger`)*

> *"Under the hood, the backend follows strict **Clean Architecture** principles:*
> - *`EmployeeManagement.Domain` houses the pure business entities, enums, and `BaseEntity`.*
> - *`EmployeeManagement.Application` contains DTOs, service interfaces, business rules, and `IApplicationDbContext`.*
> - *`EmployeeManagement.Infrastructure` handles EF Core, MySQL/SQLite database configurations, BCrypt password hashing, ClosedXML, and QuestPDF.*
> - *`EmployeeManagement.API` exposes standard REST endpoints documented with **Swagger OpenAPI**, protected by JWT bearer authentication, and guarded by global exception middleware.*
>
> *The entire integration test suite runs 15 automated test cases covering authentication, CRUD, duplicate prevention, and export services with 100% pass rate.*
>
> *Thank you for your time, and I look forward to discussing how my skills and engineering standards can contribute to your team!"*

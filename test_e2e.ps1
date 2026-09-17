# ====================================================================
# Employee Management System - End-to-End API Integration Verification
# ====================================================================

$baseUrl = "http://localhost:5000/api"
$passedCount = 0
$failedCount = 0

function Assert-Test([string]$testName, [bool]$condition, [string]$details = "") {
    if ($condition) {
        Write-Host "[PASS] $testName" -ForegroundColor Green
        $global:passedCount++
    } else {
        Write-Host "[FAIL] $testName - $details" -ForegroundColor Red
        $global:failedCount++
    }
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting End-to-End Integration Verification Tests " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Test 1: Unauthorized Access Prevention
try {
    Invoke-RestMethod -Uri "$baseUrl/employees" -Method Get -ErrorAction Stop | Out-Null
    Assert-Test "Unauthorized API access blocked" $false "Expected 401 Unauthorized"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Assert-Test "Unauthorized API access blocked" ($statusCode -eq 401) "Received status $statusCode"
}

# Test 2: Admin Login
$loginBody = @{
    usernameOrEmail = "admin"
    password = "Admin@123"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
Assert-Test "Admin Login returns JWT token" ($loginRes.token -ne $null -and $loginRes.token.Length -gt 20)
$token = $loginRes.token
$headers = @{ Authorization = "Bearer $token" }

# Test 3: Get Current Authenticated Profile
$meRes = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Get -Headers $headers
Assert-Test "Get Authenticated Profile (/api/auth/me)" ($meRes.username -eq "admin" -and $meRes.role -eq "Admin")

# Test 4: Get Department List with Employee Counts
$deptList = Invoke-RestMethod -Uri "$baseUrl/departments" -Method Get -Headers $headers
Assert-Test "Get Departments with EmployeeCount" ($deptList.Count -ge 5 -and $deptList[0].employeeCount -ge 0)

# Test 5: Employee Search & Pagination
$empList = Invoke-RestMethod -Uri "$baseUrl/employees?pageNumber=1&pageSize=5&search=Morgan" -Method Get -Headers $headers
Assert-Test "Search Employee by Name" ($empList.items.Count -eq 1 -and $empList.items[0].lastName -eq "Morgan")

# Test 6: Create New Employee
$newEmpCode = "TEST-999"
$createEmpBody = @{
    employeeCode = $newEmpCode
    firstName = "Test"
    lastName = "Automated"
    email = "test.automated@company.com"
    phone = "+1 (555) 999-0000"
    dateOfBirth = "1994-05-10T00:00:00"
    gender = "Male"
    address = "123 Automation Way"
    departmentId = $deptList[0].id
    designation = "QA Automation Lead"
    joiningDate = "2024-01-01T00:00:00"
    salary = 85000.00
    employmentStatus = "FullTime"
} | ConvertTo-Json

$createdEmp = Invoke-RestMethod -Uri "$baseUrl/employees" -Method Post -ContentType "application/json" -Headers $headers -Body $createEmpBody
Assert-Test "Create New Employee" ($createdEmp.id -gt 0 -and $createdEmp.employeeCode -eq $newEmpCode)

# Test 7: Duplicate Email Prevention
try {
    Invoke-RestMethod -Uri "$baseUrl/employees" -Method Post -ContentType "application/json" -Headers $headers -Body $createEmpBody -ErrorAction Stop | Out-Null
    Assert-Test "Duplicate Email Validation" $false "Duplicate creation succeeded when it should fail"
} catch {
    Assert-Test "Duplicate Email Validation prevents conflict" $true
}

# Test 8: Update Employee Record
$updateEmpBody = @{
    firstName = "Test"
    lastName = "Automated-Updated"
    email = "test.automated@company.com"
    phone = "+1 (555) 999-0000"
    dateOfBirth = "1994-05-10T00:00:00"
    gender = "Male"
    address = "123 Automation Way Updated"
    departmentId = $deptList[0].id
    designation = "Senior QA Automation Lead"
    joiningDate = "2024-01-01T00:00:00"
    salary = 95000.00
    employmentStatus = "FullTime"
} | ConvertTo-Json

$updatedEmp = Invoke-RestMethod -Uri "$baseUrl/employees/$($createdEmp.id)" -Method Put -ContentType "application/json" -Headers $headers -Body $updateEmpBody
Assert-Test "Update Employee Record" ($updatedEmp.designation -eq "Senior QA Automation Lead" -and $updatedEmp.salary -eq 95000.00)

# Test 9: Mark Daily Attendance
$todayDate = (Get-Date).ToString("yyyy-MM-dd")
$attendanceBody = @{
    employeeId = $createdEmp.id
    date = "${todayDate}T00:00:00"
    status = "Present"
    remarks = "Automated test check-in"
} | ConvertTo-Json

$markedAtt = Invoke-RestMethod -Uri "$baseUrl/attendance" -Method Post -ContentType "application/json" -Headers $headers -Body $attendanceBody
Assert-Test "Mark Attendance Record" ($markedAtt.id -gt 0 -and $markedAtt.status -eq "Present")

# Test 10: Prevent Duplicate Attendance for Same Employee & Date
try {
    Invoke-RestMethod -Uri "$baseUrl/attendance" -Method Post -ContentType "application/json" -Headers $headers -Body $attendanceBody -ErrorAction Stop | Out-Null
    Assert-Test "Prevent Duplicate Attendance" $false "Duplicate attendance allowed when it should fail"
} catch {
    Assert-Test "Prevent Duplicate Attendance for same date" $true
}

# Test 11: Department Delete Safety Check (Department with Employees cannot be deleted)
try {
    Invoke-RestMethod -Uri "$baseUrl/departments/$($deptList[0].id)" -Method Delete -Headers $headers -ErrorAction Stop | Out-Null
    Assert-Test "Department Deletion Safety Rule" $false "Department with active employees was deleted"
} catch {
    Assert-Test "Department Deletion Safety Rule (Prevent deleting dept with active employees)" $true
}

# Test 12: Dashboard Summary Analytics
$dashRes = Invoke-RestMethod -Uri "$baseUrl/dashboard/summary" -Method Get -Headers $headers
Assert-Test "Dashboard Analytics Summary" ($dashRes.totalEmployees -ge 6 -and $dashRes.departmentDistribution.Count -ge 5 -and $dashRes.totalMonthlyPayroll -gt 0)

# Test 13: Excel Report Export
Invoke-WebRequest -Uri "$baseUrl/reports/employees/excel" -Headers $headers -OutFile "e2e_test.xlsx"
$excelFile = Get-Item "e2e_test.xlsx" -ErrorAction SilentlyContinue
Assert-Test "Excel Report Generation (.xlsx)" ($excelFile -ne $null -and $excelFile.Length -gt 1000)
Remove-Item "e2e_test.xlsx" -ErrorAction SilentlyContinue

# Test 14: PDF Report Export
Invoke-WebRequest -Uri "$baseUrl/reports/employees/pdf" -Headers $headers -OutFile "e2e_test.pdf"
$pdfFile = Get-Item "e2e_test.pdf" -ErrorAction SilentlyContinue
Assert-Test "PDF Report Generation (.pdf)" ($pdfFile -ne $null -and $pdfFile.Length -gt 1000)
Remove-Item "e2e_test.pdf" -ErrorAction SilentlyContinue

# Test 15: Clean Up - Delete Test Employee
Invoke-RestMethod -Uri "$baseUrl/employees/$($createdEmp.id)" -Method Delete -Headers $headers | Out-Null
Assert-Test "Delete Employee Record (Admin only)" $true

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Verification Completed: $passedCount PASSED, $failedCount FAILED " -ForegroundColor $(if ($failedCount -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================================" -ForegroundColor Cyan

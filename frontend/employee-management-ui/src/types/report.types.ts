export interface SalaryReportItem {
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  designation: string;
  monthlySalary: number;
  annualSalary: number;
  employmentStatus: string;
  joiningDate: string;
}

export interface DepartmentReportItem {
  departmentId: number;
  code: string;
  name: string;
  employeeCount: number;
  totalSalaryExpense: number;
  averageSalary: number;
}

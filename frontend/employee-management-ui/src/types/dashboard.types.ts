import { Attendance } from './attendance.types';
import { Employee } from './employee.types';

export interface DepartmentDistribution {
  departmentName: string;
  departmentCode: string;
  employeeCount: number;
  percentage: number;
}

export interface HiringTrend {
  monthYear: string;
  hiredCount: number;
}

export interface SalaryDistribution {
  range: string;
  employeeCount: number;
}

export interface DashboardSummary {
  totalEmployees: number;
  totalDepartments: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  halfDayToday: number;
  totalMonthlyPayroll: number;
  averageSalary: number;
  departmentDistribution: DepartmentDistribution[];
  hiringTrends: HiringTrend[];
  salaryDistribution: SalaryDistribution[];
  recentEmployees: Employee[];
  recentAttendance: Attendance[];
}

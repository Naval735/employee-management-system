export type AttendanceStatusType = 'Present' | 'Absent' | 'Leave' | 'HalfDay';

export interface Attendance {
  id: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  date: string;
  status: AttendanceStatusType;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendancePayload {
  employeeId: number;
  date: string;
  status: AttendanceStatusType;
  remarks?: string;
}

export interface UpdateAttendancePayload {
  status: AttendanceStatusType;
  remarks?: string;
}

export interface AttendanceQueryParameters {
  employeeId?: number;
  departmentId?: number;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatusType;
  pageNumber?: number;
  pageSize?: number;
}

export interface AttendanceSummary {
  date: string;
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  leaveCount: number;
  halfDayCount: number;
  attendanceRatePercentage: number;
}

import api from './api';
import {
  Attendance,
  CreateAttendancePayload,
  UpdateAttendancePayload,
  AttendanceQueryParameters,
  AttendanceSummary,
} from '../types/attendance.types';
import { PaginatedResult } from '../types/employee.types';

export const attendanceService = {
  getAttendanceRecords: async (params: AttendanceQueryParameters): Promise<PaginatedResult<Attendance>> => {
    const response = await api.get<PaginatedResult<Attendance>>('/attendance', { params });
    return response.data;
  },

  getAttendanceById: async (id: number): Promise<Attendance> => {
    const response = await api.get<Attendance>(`/attendance/${id}`);
    return response.data;
  },

  markAttendance: async (payload: CreateAttendancePayload): Promise<Attendance> => {
    const response = await api.post<Attendance>('/attendance', payload);
    return response.data;
  },

  updateAttendance: async (id: number, payload: UpdateAttendancePayload): Promise<Attendance> => {
    const response = await api.put<Attendance>(`/attendance/${id}`, payload);
    return response.data;
  },

  deleteAttendance: async (id: number): Promise<void> => {
    await api.delete(`/attendance/${id}`);
  },

  getSummary: async (date?: string): Promise<AttendanceSummary> => {
    const response = await api.get<AttendanceSummary>('/attendance/summary', { params: { date } });
    return response.data;
  },
};

export default attendanceService;

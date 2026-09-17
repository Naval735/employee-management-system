import api from './api';
import { Employee } from '../types/employee.types';
import { Attendance } from '../types/attendance.types';
import { DepartmentReportItem, SalaryReportItem } from '../types/report.types';

export const reportService = {
  getEmployeeDirectory: async (): Promise<Employee[]> => {
    const response = await api.get<Employee[]>('/reports/employees');
    return response.data;
  },

  downloadEmployeeDirectoryExcel: () => {
    const token = localStorage.getItem('token');
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reports/employees/excel?access_token=${token}`, '_blank');
  },

  downloadEmployeeDirectoryPdf: () => {
    const token = localStorage.getItem('token');
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reports/employees/pdf?access_token=${token}`, '_blank');
  },

  getDepartmentReport: async (): Promise<DepartmentReportItem[]> => {
    const response = await api.get<DepartmentReportItem[]>('/reports/departments');
    return response.data;
  },

  getAttendanceReport: async (startDate?: string, endDate?: string): Promise<Attendance[]> => {
    const response = await api.get<Attendance[]>('/reports/attendance', { params: { startDate, endDate } });
    return response.data;
  },

  getSalaryReport: async (): Promise<SalaryReportItem[]> => {
    const response = await api.get<SalaryReportItem[]>('/reports/salary');
    return response.data;
  },

  // Helper file download triggers with JWT auth header
  downloadFile: async (endpoint: string, defaultFilename: string) => {
    const response = await api.get(endpoint, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', defaultFilename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default reportService;

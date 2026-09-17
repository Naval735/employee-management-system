import api from './api';
import {
  Employee,
  CreateEmployeePayload,
  UpdateEmployeePayload,
  EmployeeQueryParameters,
  PaginatedResult,
} from '../types/employee.types';

export const employeeService = {
  getEmployees: async (params: EmployeeQueryParameters): Promise<PaginatedResult<Employee>> => {
    const response = await api.get<PaginatedResult<Employee>>('/employees', { params });
    return response.data;
  },

  getEmployeeById: async (id: number): Promise<Employee> => {
    const response = await api.get<Employee>(`/employees/${id}`);
    return response.data;
  },

  createEmployee: async (payload: CreateEmployeePayload): Promise<Employee> => {
    const response = await api.post<Employee>('/employees', payload);
    return response.data;
  },

  updateEmployee: async (id: number, payload: UpdateEmployeePayload): Promise<Employee> => {
    const response = await api.put<Employee>(`/employees/${id}`, payload);
    return response.data;
  },

  deleteEmployee: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  bulkDeleteEmployees: async (employeeIds: number[]): Promise<{ message: string; count: number }> => {
    const response = await api.post<{ message: string; count: number }>('/employees/bulk-delete', { employeeIds });
    return response.data;
  },
};

export default employeeService;

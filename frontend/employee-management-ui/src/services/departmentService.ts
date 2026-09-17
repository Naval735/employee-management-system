import api from './api';
import { Department, CreateDepartmentPayload, UpdateDepartmentPayload } from '../types/department.types';

export const departmentService = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await api.get<Department[]>('/departments');
    return response.data;
  },

  getDepartmentById: async (id: number): Promise<Department> => {
    const response = await api.get<Department>(`/departments/${id}`);
    return response.data;
  },

  createDepartment: async (payload: CreateDepartmentPayload): Promise<Department> => {
    const response = await api.post<Department>('/departments', payload);
    return response.data;
  },

  updateDepartment: async (id: number, payload: UpdateDepartmentPayload): Promise<Department> => {
    const response = await api.put<Department>(`/departments/${id}`, payload);
    return response.data;
  },

  deleteDepartment: async (id: number): Promise<void> => {
    await api.delete(`/departments/${id}`);
  },
};

export default departmentService;

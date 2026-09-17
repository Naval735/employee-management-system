export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentPayload {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateDepartmentPayload extends CreateDepartmentPayload {}

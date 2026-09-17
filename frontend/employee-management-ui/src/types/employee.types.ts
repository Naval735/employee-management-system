export type GenderType = 'Male' | 'Female' | 'Other';
export type EmploymentStatusType = 'FullTime' | 'PartTime' | 'Contract' | 'Intern' | 'Terminated';

export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: GenderType;
  address: string;
  departmentId: number;
  departmentName: string;
  departmentCode: string;
  designation: string;
  joiningDate: string;
  salary: number;
  employmentStatus: EmploymentStatusType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeePayload {
  employeeCode?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: GenderType;
  address: string;
  departmentId: number;
  designation: string;
  joiningDate: string;
  salary: number;
  employmentStatus: EmploymentStatusType;
}

export interface UpdateEmployeePayload extends CreateEmployeePayload {}

export interface EmployeeQueryParameters {
  search?: string;
  departmentId?: number;
  status?: EmploymentStatusType;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

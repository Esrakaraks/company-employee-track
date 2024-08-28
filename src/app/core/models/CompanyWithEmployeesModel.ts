export interface EmployeeModel {
  employeeID: number;
  EmployeeName: string;
  companyId: number;
}
export interface CompanyModel {
  companyId: number;
  companyName: string;
  companyAddress: string;
}

export interface CompanyWithEmployeesModel {
  company: CompanyModel;
  employees: EmployeeModel[];
}

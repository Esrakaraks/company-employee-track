import { Injectable } from '@angular/core';
import { CompanyModel } from '../models/CompanyWithEmployeesModel';
import { EmployeeModel } from '../models/CompanyWithEmployeesModel';
import { CompanyWithEmployeesModel } from '../models/CompanyWithEmployeesModel';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = this.openDatabase();
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('companyDBTEST', 1);

      request.onupgradeneeded = function(event) {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore('companies', { keyPath: 'companyId', autoIncrement: true });
        db.createObjectStore('employees', { keyPath: 'employeeID', autoIncrement: true });
      };

      request.onsuccess = function(event) {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = function(event) {
        reject(`Error opening database: ${(event.target as IDBOpenDBRequest).error}`);
      };
    });
  }

  async addCompanyWithEmployees(companyData: any): Promise<void> {
    const db = await this.dbPromise;
    const transaction = db.transaction(['companies', 'employees'], 'readwrite');

    const companyStore = transaction.objectStore('companies');
    const employeeStore = transaction.objectStore('employees');
    const companyRequest = companyStore.add(companyData);

    companyRequest.onsuccess = function(event) {
      const companyId = (event.target as IDBRequest<number>).result;

      companyData.employees.forEach((employee: any) => {
        employee.companyId = companyId;
        employeeStore.add(employee);
      });
    };

    companyRequest.onerror = function(event) {
      console.error('Error adding company:', (event.target as IDBRequest).error);
    };

    transaction.oncomplete = function() {
      console.log('Company and employees added successfully.');
    };

    transaction.onerror = function(event) {
      console.error('Transaction error:', (event.target as IDBTransaction).error);
    };
  }

  async getCompanies(): Promise<CompanyModel[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('companies', 'readonly');
      const store = transaction.objectStore('companies');
      const request = store.getAll();

      request.onsuccess = function(event) {
        resolve((event.target as IDBRequest).result);
      };

      request.onerror = function(event) {
        reject(`Error retrieving companies: ${(event.target as IDBRequest).error}`);
      };
    });
  }

  async getEmployees(): Promise<EmployeeModel[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('employees', 'readonly');
      const store = transaction.objectStore('employees');
      const request = store.getAll();

      request.onsuccess = function(event) {
        resolve((event.target as IDBRequest).result);
      };

      request.onerror = function(event) {
        reject(`Error retrieving employees: ${(event.target as IDBRequest).error}`);
      };
    });
  }

  async listCompanyWithEmployees(): Promise<CompanyWithEmployeesModel[]> {
    try {
      const companies = await this.getCompanies();
      const employees = await this.getEmployees();

      return companies.map(company => ({
        company: company,
        employees: employees.filter(employee => employee.companyId === company.companyId)
      }));
    } catch (error) {
      console.error('Error listing companies with employees:', error);
      throw error;
    }
    
  }
  async updateCompany(companyId: number, data: any): Promise<void> {  
    const db = await this.dbPromise;
    const transaction = db.transaction(['companies', 'employees'], 'readwrite');
    const companyStore = transaction.objectStore('companies');
    const employeeStore = transaction.objectStore('employees');
  
    // Update company
    const companyRequest = companyStore.put({
      companyId: companyId,
      companyName: data.companyName,
      companyAddress: data.companyAddress
    });
  
    companyRequest.onsuccess = () => {
      console.log('Company updated successfully');
  
      // Log data to check what is being sent to the employee store
      console.log('Updating employees:', data.employees);
      // Update employees
      data.employees.forEach((employee: EmployeeModel) => {
        const employeeRequest = employeeStore.put(employee);
        console.log('employeeRequest', employeeRequest);
      
      });
    };
  
    companyRequest.onerror = (event) => console.error('Error updating company:', (event.target as IDBRequest).error);

  } 
}

import { Injectable } from '@angular/core';
import { CompanyModel,EmployeeModel,CompanyWithEmployeesModel } from '../../models/CompanyWithEmployeesModel';

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
      const request = indexedDB.open('DBTEST', 2);
  
      request.onupgradeneeded = function(event) {
        const db = (event.target as IDBOpenDBRequest).result;
  
        const companyStore = db.createObjectStore('companies', { keyPath: 'companyId', autoIncrement: true });
        companyStore.createIndex('companyName', 'companyName', { unique: false });
  
        const employeeStore = db.createObjectStore('employees', { keyPath: 'employeeID', autoIncrement: true });
        employeeStore.createIndex('companyId', 'companyId', { unique: false });
  
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
  
      // Update employees
      data.employees.forEach((employee: EmployeeModel) => {
        // Set the companyId for the employee
        employee.companyId = companyId;
  
        const employeeRequest = employeeStore.put(employee);
  
        employeeRequest.onsuccess = () => console.log('Employee updated:', employee);
        employeeRequest.onerror = (event) => console.error('Error updating employee:', (event.target as IDBRequest).error);
      });
    };
  
    companyRequest.onerror = (event) => console.error('Error updating company:', (event.target as IDBRequest).error);
  
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject((event.target as IDBTransaction).error);
    });
  }
  
  
  async deleteCompany(companyId: number): Promise<void> {
    const db = await this.dbPromise;
    const transaction = db.transaction(['companies', 'employees'], 'readwrite');
    const companyStore = transaction.objectStore('companies');
    const employeeStore = transaction.objectStore('employees');
    
    // Delete company
    const companyRequest = companyStore.delete(companyId);
    
    companyRequest.onsuccess = () => {
      console.log('Company deleted successfully');
    
      // Delete employees associated with the company
      const index = employeeStore.index('companyIdIndex');
      const employeesRequest = index.openCursor(IDBKeyRange.only(companyId));
    
      employeesRequest.onsuccess = (event: Event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    
      employeesRequest.onerror = (event) => console.error('Error deleting employees:', (event.target as IDBRequest).error);
    };
    
    companyRequest.onerror = (event) => console.error('Error deleting company:', (event.target as IDBRequest).error);
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject((event.target as IDBTransaction).error);
    });
  }
  
  
}

// add.ts
import { openDatabase, Company, Employee } from '../indexed-db/db.service';

export async function addCompany(companyName: string, employees: string[]): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction(['companies', 'employees'], 'readwrite');

  const companyStore = transaction.objectStore('companies');
  const employeeStore = transaction.objectStore('employees');

  const companyData: Company = { companyName, employees: [] };

  const companyRequest = companyStore.add(companyData);

  companyRequest.onsuccess = function(event) {
    const companyId = (event.target as IDBRequest<number>).result;

    employees.forEach(employeeName => {
      const employeeData: Employee = {
        companyId: companyId,
        EmployeeName: employeeName
      };

      const employeeRequest = employeeStore.add(employeeData);
      employeeRequest.onsuccess = function(e) {
        const employeeID = (e.target as IDBRequest<number>).result;
        companyData.employees.push({ employeeID, EmployeeName: employeeName });
      };
    });

    transaction.oncomplete = function() {
      companyStore.put(companyData).onsuccess = function() {
        console.log('Company and employees added successfully.');
      };
    };
  };

  companyRequest.onerror = function(event) {
    console.error('Error adding company:', (event.target as IDBRequest).error);
  };
}

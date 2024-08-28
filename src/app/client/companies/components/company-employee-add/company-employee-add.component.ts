import { Component } from '@angular/core';
import { IndexedDBService } from 'src/app/core/indexed-db/db.service';

@Component({
  selector: 'app-company-employee-add',
  templateUrl: './company-employee-add.component.html',
  styleUrls: ['./company-employee-add.component.css']
})
export class CompanyEmployeeAddComponent {
  companyId = null;
  companyName = '';
  companyAddress = '';
  fields: { name: string }[] = [{ name: '' }];

  
  constructor(private indexedDBService: IndexedDBService) {}
  add(event: Event) {
    event.preventDefault();
    this.fields.push({ name: '' });
  }

  removeEmployee(index: number) {
    this.fields.splice(index, 1);
  }
  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  saveCompany() {
    const companyData = {
      companyId: this.getRandomInt(1000, 9999),
      companyName: this.companyName,
      companyAddress: this.companyAddress,
      employees: this.fields.map((field, index) => ({
        employeeID: this.getRandomInt(1000, 9999),
        EmployeeName: field.name
      }))
    };

    this.indexedDBService.addCompanyWithEmployees(companyData);
  }
 
}

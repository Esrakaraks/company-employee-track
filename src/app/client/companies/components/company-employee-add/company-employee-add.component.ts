import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IndexedDBService } from 'src/app/core/services/indexed-db/db.service';

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

  
  constructor(private indexedDBService: IndexedDBService, private router: Router) {}
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
  async saveCompany() {
    const companyData = {
      companyId: this.getRandomInt(1000, 9999),
      companyName: this.companyName,
      companyAddress: this.companyAddress,
      employees: this.fields.map((field, index) => ({
        employeeID: this.getRandomInt(1000, 9999),
        EmployeeName: field.name
      }))
    };

    try {
      await this.indexedDBService.addCompanyWithEmployees(companyData);
      console.log('Company and employees added successfully');
      this.router.navigate(['/company-employee-list']);
      
      // Clear fields after successful save
      this.companyName = '';
      this.companyAddress = '';
      this.fields = [{ name: '' }];
    } catch (error) {
      console.error('Error saving company and employees:', error);
    }
  }
 
}

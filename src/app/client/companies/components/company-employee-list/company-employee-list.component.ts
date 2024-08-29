import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IndexedDBService } from 'src/app/core/services/indexed-db/db.service';
import { CompanyEmployeeEditComponent } from '../company-employee-edit/company-employee-edit.component';
import { CompanyWithEmployeesModel } from 'src/app/core/models/CompanyWithEmployeesModel';

@Component({
  selector: 'app-company-employee-list',
  templateUrl: './company-employee-list.component.html',
  styleUrls: ['./company-employee-list.component.css']
})
export class CompanyEmployeeListComponent {
  displayedColumns: string[] = ['companyName', 'companyAddress', 'employees','Actions'];
  dataSource: CompanyWithEmployeesModel[] = [];

  constructor(private indexedDBService: IndexedDBService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    try {
      this.dataSource = await this.indexedDBService.listCompanyWithEmployees();
      
    } catch (error) {
      console.error('Error fetching companies with employees:', error);
    }
  }
  
  editCompany(data: CompanyWithEmployeesModel) {
    const dialogRef = this.dialog.open(CompanyEmployeeEditComponent, {
      width: '350px',
      data: {
        companyId: data.company.companyId,
        companyName: data.company.companyName,
        companyAddress: data.company.companyAddress,
        employees: data.employees
      }
    });
    

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.indexedDBService.updateCompany(data.company.companyId, result).then(() => {    
          console.log('Company updated successfully');
          
          this.ngOnInit();
        }).catch(err => {
          console.error('Error updating company:', err);
        });
      }
    });
  }
  async deleteCompany(companyId: number) {
    try {
      await this.indexedDBService.deleteCompany(companyId);
      console.log('Company deleted successfully');
      this.ngOnInit();
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  }
}


import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IndexedDBService } from 'src/app/core/indexed-db/db.service';
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
    console.log('data',data);
    const dialogRef = this.dialog.open(CompanyEmployeeEditComponent, {
      width: '400px',
      data: {
        companyId: data.company.companyId,
        companyName: data.company.companyName,
        companyAddress: data.company.companyAddress,
        employees: data.employees
      }
    });
    console.log('dialogRef',dialogRef);
    

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update company with new data
        this.indexedDBService.updateCompany(data.company.companyId, result).then(() => {  
          console.log('data.company.companyId',data.company.companyId);    
          console.log('Company updated successfully');
          
          this.ngOnInit(); // Refresh the list
        }).catch(err => {
          console.error('Error updating company:', err);
        });
      }
    });
  }
}


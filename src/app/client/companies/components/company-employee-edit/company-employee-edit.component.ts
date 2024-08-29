import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { EmployeeModel } from 'src/app/core/models/CompanyWithEmployeesModel';

@Component({
  selector: 'app-company-employee-edit',
  templateUrl: './company-employee-edit.component.html',
  styleUrls: ['./company-employee-edit.component.css']
})
export class CompanyEmployeeEditComponent {
  editForm: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<CompanyEmployeeEditComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.editForm = this.fb.group({   
      companyName: [data.companyName || ''],
      companyAddress: [data.companyAddress || ''],
      employees: this.fb.array(
        (data.employees || []).map((employee: EmployeeModel) =>
          this.fb.group({
            employeeID: employee.employeeID,
            EmployeeName: employee.EmployeeName
          })
        )
      )
    });   
  }
  
  get employees(): FormArray {
    return this.editForm.get('employees') as FormArray;
  }

  addEmployee(): void {
    this.employees.push(this.fb.group({
      employeeID: [''],
      EmployeeName: ['']
    }));
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.editForm.value);
  }
}

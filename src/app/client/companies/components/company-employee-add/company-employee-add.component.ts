import { Component } from '@angular/core';

@Component({
  selector: 'app-company-employee-add',
  templateUrl: './company-employee-add.component.html',
  styleUrls: ['./company-employee-add.component.css']
})
export class CompanyEmployeeAddComponent {
  fields: { id: number; value: string }[] = [{ id: 1, value: '' }];
  addMoreFields(): void {
    const newId = this.fields.length ? this.fields[this.fields.length - 1].id + 1 : 1;
    this.fields.push({ id: newId, value: '' });
  }

  removeMoreFields(index: number): void {
    if (this.fields.length > 1) {
      this.fields.splice(index, 1);
    }
  }
}

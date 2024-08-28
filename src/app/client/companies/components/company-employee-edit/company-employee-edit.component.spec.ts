import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEmployeeEditComponent } from './company-employee-edit.component';

describe('CompanyEmployeeEditComponent', () => {
  let component: CompanyEmployeeEditComponent;
  let fixture: ComponentFixture<CompanyEmployeeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyEmployeeEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyEmployeeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

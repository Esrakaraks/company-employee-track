import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEmployeeAddComponent } from './company-employee-add.component';

describe('CompanyEmployeeAddComponent', () => {
  let component: CompanyEmployeeAddComponent;
  let fixture: ComponentFixture<CompanyEmployeeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyEmployeeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyEmployeeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

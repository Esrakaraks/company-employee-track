import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEmployeeListComponent } from './company-employee-list.component';

describe('CompanyEmployeeListComponent', () => {
  let component: CompanyEmployeeListComponent;
  let fixture: ComponentFixture<CompanyEmployeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyEmployeeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyEmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

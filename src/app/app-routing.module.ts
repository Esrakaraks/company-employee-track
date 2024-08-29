import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './client/companies/components/login/login.component';
import { CompanyEmployeeListComponent } from './client/companies/components/company-employee-list/company-employee-list.component';
import { CompanyEmployeeAddComponent } from './client/companies/components/company-employee-add/company-employee-add.component';
import { AuthGuard } from './core/services/auth/auth.guard'; 
const routes: Routes = [
  {
    path: '',
    component: LoginComponent
},
{
    path: 'company-employee-list',
    component: CompanyEmployeeListComponent
},
{
    path: 'company-employee-add',
    component: CompanyEmployeeAddComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

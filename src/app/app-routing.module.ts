import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCompaniesComponent } from './pages/companies/list-companies/list-companies.component';

const routes: Routes = [
  { path: '', component: ListCompaniesComponent, pathMatch: 'full' },
  {
    path: 'companies',
    loadChildren: () => import('./pages/companies/companies.module').then(m => m.CompaniesModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'courses',
    loadChildren: () => import('./pages/courses/courses.module').then(m => m.CoursesModule)
  },
  {
    path: 'tests',
    loadChildren: () => import('./pages/tests/tests.module').then(m => m.TestsModule)
  },
  {
    path: 'routes',
    loadChildren: () => import('./pages/routes/routes.module').then(m => m.RoutesModule)
  },
  {
    path: 'teachers',
    loadChildren: () => import('./pages/teachers/teachers.module').then(m => m.TeachersModule)
  },
  {
    path: 'tickets',
    loadChildren: () => import('./pages/tickets/tickets.module').then(m => m.TicketsModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path:'infographics',
    loadChildren: () => import('./pages/infographics/infographics.module').then(m => m.InfographicsModule)
  },
  {
    path: 'forms',
    loadChildren: () => import('./pages/forms/forms.module').then(m => m.FormsModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { RegisterPageComponent } from './auth/register-page/register-page.component';
import { AuthGuard } from './shared/classes/auth.guard';
import { OverviewPageComponent } from './main/overview-page/overview-page.component';
import { HistoryPageComponent } from './main/history-page/history-page.component';
import { PlanningPageComponent } from './main/planning-page/planning-page.component';
import { RecordsPageComponent } from './main/records-page/records-page.component';
import { HistoryDetailComponent } from './main/history-page/history-detail/history-detail.component';


const routes: Routes = [
  { path: '', component: AuthLayoutComponent, children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
      { path: 'registration', component: RegisterPageComponent }
    ]
  },
  { path: '', component: MainLayoutComponent, canActivate: [AuthGuard], children: [
      { path: 'overview', component: OverviewPageComponent },
      { path: 'history', component: HistoryPageComponent },
      { path: 'planning', component: PlanningPageComponent },
      { path: 'records', component: RecordsPageComponent },
      { path: 'history/:id', component: HistoryDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

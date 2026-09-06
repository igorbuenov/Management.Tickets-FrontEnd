import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard';
import { UserCreateComponent } from './features/users/pages/user-create/user-create';
import { UserListComponent } from './features/users/pages/user-list/user-list';
export const routes: Routes = [

  // ==========================================================
  // LOGIN
  // ==========================================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },


  // ==========================================================
  // ÁREA AUTENTICADA
  // ==========================================================

  {
    path: '',
    component: MainLayoutComponent,

    children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'users',
        component: UserListComponent
      },

      {
        path: 'users/create',
        component: UserCreateComponent
      }

    ]
  }

];

import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard';
import { UserCreateComponent } from './features/users/pages/user-create/user-create';
import { UserListComponent } from './features/users/pages/user-list/user-list';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password';
import { UserEditComponent } from './features/users/pages/user-edit/user-edit';
import { authGuard } from './core/guards/auth-guard';
import { TicketListComponent } from './features/tickets/pages/ticket-list/ticket-list';
import { TicketDetailsComponent } from './features/tickets/pages/ticket-details/ticket-details';
import { TicketCreateComponent } from './features/tickets/pages/ticket-create/ticket-create';
import { ChangePasswordComponent } from './features/auth/change-password/change-password';
import { DepartmentListComponent } from './features/departments/pages/department-list/department-list';
import { DepartmentCreateComponent } from './features/departments/pages/department-create/department-create';
import { CategoryCreateComponent } from './features/categories/pages/category-create/category-create';
import { CategoryListComponent } from './features/categories/pages/category-list/category-list';


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
  // FORGOT AND RESET PASSWORD
  // ==========================================================
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
  // ==========================================================
  // ÁREA AUTENTICADA
  // ==========================================================

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: 'dashboard',
        component: DashboardComponent,
      },

      {
        path: 'users',
        component: UserListComponent,
      },
      {
        path: 'users/create',
        component: UserCreateComponent,
      },
      {
        path: 'users/:id/edit',
        component: UserEditComponent
      },
      {
        path: 'tickets',
        component: TicketListComponent
      },
      {
        path: 'tickets/create',
        component: TicketCreateComponent
      },
      {
        path: 'tickets/:id',
        component: TicketDetailsComponent
      },
      {
        path: 'departments',
        component: DepartmentListComponent
      },
      {
        path: 'departments/create',
        component: DepartmentCreateComponent
      },
      {
        path: 'categories',
        component: CategoryListComponent
      },
      {
        path: 'categories/create',
        component: CategoryCreateComponent
      }
    ]
  }

];

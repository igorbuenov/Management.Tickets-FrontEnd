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
      }

    ]
  }

];

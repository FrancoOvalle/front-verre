import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/users/register/register.component';
import { LoginComponent } from './components/users/login/login.component';
import { loginGuard } from './guards/login.guard';
import {MantenimientosComponent} from './components/mantenimientos/mantenimientos-list/mantenimientos.component'
import { SolicitudNewComponent } from './components/mantenimientos/solicitud-new/solicitud-new.component';
import { MantencionPreventivaComponent } from './components/mantenimientos/mantencion-preventiva/mantencion-preventiva.component';
import { PreventivasListComponent } from './components/mantenimientos/preventivas-list/preventivas-list.component';
import { DashboardComponent } from './components/ui/dashboard/dashboard.component';
import { MantenedorUsuarioComponent } from './components/users/mantenedor-usuario/mantenedor-usuario.component';
const routes: Routes = [
  {
    path:'dashboard',
    component:DashboardComponent,
    canActivate:[loginGuard]
  },
  {
    path:'preventivas-list',
    component:PreventivasListComponent,
    canActivate:[loginGuard]
  },
  {
    path:'mantencion-preventiva',
    component: MantencionPreventivaComponent,
    canActivate:[loginGuard]
  },
  {
    path:'solicitud-new',
    component: SolicitudNewComponent,
    canActivate:[loginGuard]
  },
  {
    path:'mantenimiento',
    component: MantenimientosComponent,
    canActivate:[loginGuard]
  },
  {
    path:'usuarios',
    component:MantenedorUsuarioComponent,
    canActivate:[loginGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate:[loginGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Import FormsModule
import { RegisterComponent } from './components/users/register/register.component';
import { LoginComponent } from './components/users/login/login.component';
import { MenuComponent } from './components/ui/menu/menu.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MantenimientosComponent } from './components/mantenimientos/mantenimientos-list/mantenimientos.component';
import { SolicitudNewComponent } from './components/mantenimientos/solicitud-new/solicitud-new.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SignaturePadComponent } from './components/mantenimientos/signature-pad/signature-pad.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { getEspPaginatorIntl } from './shared/paginator-es';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MantencionPreventivaComponent } from './components/mantenimientos/mantencion-preventiva/mantencion-preventiva.component';
import { PreventivasListComponent } from './components/mantenimientos/preventivas-list/preventivas-list.component';
import { DashboardComponent } from './components/ui/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    MenuComponent,
    MantenimientosComponent,
    SolicitudNewComponent,
    SignaturePadComponent,
    MantencionPreventivaComponent,
    PreventivasListComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule, // Agrega FormsModule aquí
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    NgxPaginationModule,
    BrowserAnimationsModule, // requerido por ngx-toastr
    ToastrModule.forRoot(),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },{ provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }],
  bootstrap: [AppComponent]
})
export class AppModule { }

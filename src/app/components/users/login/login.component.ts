import { Component, inject, runInInjectionContext } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formulario: FormGroup;

  usersService = inject(UsersService);
  router = inject(Router);

  constructor() {
    this.formulario = new FormGroup({
      usuario: new FormControl(),
      password: new FormControl()
    });
  }
  onSubmit() {
    if (this.formulario.valid) {
      this.usersService.login(this.formulario.value).subscribe({
        next: response => {
          if (!response.error) {
            localStorage.setItem('token_verre', response.token);
            this.router.navigate(['/dashboard']);
          } else {
            Swal.fire('Error', 'Credenciales inválidas', 'error');
          }
        },
        error: error => {
          Swal.fire('Error', 'Ocurrió un error al iniciar sesión', 'error');
          console.error('Error al iniciar sesión:', error);
        }
      });
    }
  }

}

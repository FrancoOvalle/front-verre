import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
// import Swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;

  usersService = inject(UsersService);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      user: ['', Validators.required],
      tipo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      rut: ['', Validators.required],
      fNac: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.usersService.register(this.registerForm.value).subscribe({
        next: response => {
          if (!response.error) {
            Swal.fire('Success', 'Usuario registrado exitosamente', 'success');
            this.registerForm.reset();
            this.router.navigate(['/login']);
          }
        },
        error: error => {
          Swal.fire('Error', 'Ocurrió un error al registrar el usuario', 'error');
          console.error('Error al registrar usuario:', error);
        }
      });
    }
  }

}




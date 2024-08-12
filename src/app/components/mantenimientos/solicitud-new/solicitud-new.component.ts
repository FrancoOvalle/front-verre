import { Component, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MantenimientoService } from 'src/app/services/mantenimiento.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-solicitud-new',
  templateUrl: './solicitud-new.component.html',
  styleUrls: ['./solicitud-new.component.css']
})
export class SolicitudNewComponent implements OnInit {

  solicitudForm!: FormGroup;
  currentUser!: Observable<any>;
  router = inject(Router);
  usersService = inject(UsersService);

  constructor(
    private fb: FormBuilder,
    private mantenimientoService: MantenimientoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.usersService.getCurrentUser();
    this.currentUser.subscribe(user => {
      this.solicitudForm = this.fb.group({
        N_SOLICITUD: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        TIPO_SOLICITUD: ['', Validators.required],
        ASIST_URGENCIA: ['', Validators.required],
        ESTADO_SOLICITUD: ['', Validators.required],
        AREA_ASIGNADA: ['', Validators.required],
        SOLICITANTE: ['', Validators.required],
        ENCARGADO: ['', Validators.required],
        TECNICO_INTERNO: [''],
        TECNICO_EXTERNO: [''],
        FECHA_SOLICITUD: ['', Validators.required],
        FECHA_ASIG_AREA: [''],
        FECHA_ASIG_TECNICO: [''],
        FECHA_MANTENCION: [''],
        FECHA_ENVIO: [''],
        FECHA_RECEPCION: [''],
        BIEN_SERVICIO: ['', Validators.required],
        UBICACION_DEPENDENCIA: ['', Validators.required],
        MOTIVO_SOLICITUD: ['', Validators.required],
        OBSERVACION_ADMIN: [''],
        OBSERVACION_GESTOR: [''],
        OBSERVACION_VALIDACION: [''],
        TIPO_MANTENCION: [''],
        VALOR_MANTENCION: [''],
        VALOR_ESTIMADO: [''],
        SOLICITADO_POR: ['', Validators.required],
        REVISADO_POR: [''],
        VALIDADO_POR: [''],
        TIPO_INGRESO: [''],
        USUARIO_REGISTRO: [user?.name || '']
      });
    });
  }

  onSubmit() {
    if (this.solicitudForm.valid) {
      const formValue = this.solicitudForm.value;
      formValue.N_SOLICITUD = parseInt(formValue.N_SOLICITUD, 10);

      this.mantenimientoService.agregarMantenimiento(formValue).subscribe(
        response => {
          console.log({response});
          if(response.error){
            this.toastr.error('Error al registrar la solicitud'); // Muestra mensaje de error
            Swal.fire('Error!', 'Hubo un problema al guardar la Solicitud.'+response.msg , 'error');
          }else{
          this.toastr.success('Solicitud registrada con éxito'); // Muestra mensaje de éxito
          this.solicitudForm.reset(); // Limpia el formulario
          Swal.fire('Guardado!', 'La solicitud ha sido guardada.', 'success');
          this.router.navigate(['/mantenimiento']);
          }
        },
        error => {
          this.toastr.error('Error al registrar la solicitud'); // Muestra mensaje de error
          Swal.fire('Error!', 'Hubo un problema al guardar la solicitud.', 'error');
        }
      );
    }else{
      Swal.fire('Error!', 'El formulario no es válido, complete los campos requeridos.', 'error');
    }
  }
}

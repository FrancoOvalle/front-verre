import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MantenimientoService } from 'src/app/services/mantenimiento.service';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mantencion-preventiva',
  templateUrl: './mantencion-preventiva.component.html',
  styleUrls: ['./mantencion-preventiva.component.css']
})
export class MantencionPreventivaComponent {
  FormPreventivo!: FormGroup;
  router = inject(Router);
  currentUser!: Observable<any>;
  usersService = inject(UsersService);

  constructor(
    private fb: FormBuilder,
    private mantenimientoService: MantenimientoService,
    private toastr: ToastrService
  ){

  }

  ngOnInit(): void {

    this.currentUser = this.usersService.getCurrentUser();
    this.currentUser.subscribe(user => {
    this.FormPreventivo = this.fb.group({
      n_correlativo: [''],
      centro_costo: [''],
      identificacion_puerta: [''],
      cantidad_puertas: [''],
      nombre_tecnico: [''],
      nombre_convenio: [''],
      complejo_asistencial: [''],
      fecha: [''],
      inspecciones: this.fb.array([]),
      observaciones: [''],
      firma_adjudicatario: [''],
      firma_rt: [''],
      USUARIO_REGISTRO:[user?.name || '']
    });

    this.addFixedInspecciones();
    });
  }


  envia() {
    if (this.FormPreventivo.valid) {
      const formValue = this.FormPreventivo.value;
      this.mantenimientoService.agregarMantenimientoPreventivo(formValue).subscribe(
        response => {
          console.log({response});
          if(response.error){
            this.toastr.error('Error al registrar la solicitud'); // Muestra mensaje de error
            Swal.fire('Error!', 'Hubo un problema al guardar la Solicitud.'+response.msg , 'error');
          }else{
            this.toastr.success('Solicitud registrada con éxito'); // Muestra mensaje de éxito
          this.FormPreventivo.reset(); // Limpia el formulario
          Swal.fire('Guardado!', 'La solicitud ha sido guardada.', 'success');
          this.router.navigate(['/preventivas-list']);
          }

        },
        error => {
          this.toastr.error('Error al registrar la solicitud'); // Muestra mensaje de error
          Swal.fire('Error!', 'Hubo un problema al guardar la solicitud.', 'error');
        }
      );
    }else{
      Swal.fire('Error!', 'El formulario no es válido.', 'error');
    }
  }

  get inspecciones() {
    return this.FormPreventivo.get('inspecciones') as FormArray;
  }

  addFixedInspecciones() {
    const fixedInspecciones = [
    'Limpieza De Puertas, Vidrios Y Accesorios',
    'Inspección Y Verificación Estado De Perfiles Y Vidrios',
    'Inspección Y Ajuste De Cerradura De Puertas',
    'Inspección Verificación Estado De Burlete Y Junquillos',
    'Inspección Y Ajuste De Herrajes De Puertas',
    'Inspección Y Verificación Funcionamiento Bisagras',
    'Inspección Y Verificación Funcionamiento Quicios Hidraulicos (Ajustes De Velocidad)',
    'Inspección Y Verificación Funcionamiento Cierra Puerta Hidráulico',
    'Inspección Y Ajuste De Manillones',
    'Inspección Y Verificación Estado De Marcos De Puerta'

    ];

    fixedInspecciones.forEach(descripcion => {
      this.inspecciones.push(this.fb.group({
        descripcion: [descripcion, Validators.required],
        resultado: ['', Validators.required],
        observacion: ['']
      }));
    });
  }


}

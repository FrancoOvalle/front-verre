import { Component, inject, OnInit, ViewChild, Inject } from '@angular/core';
import { MantenimientoService } from 'src/app/services/mantenimiento.service';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { SignaturePadComponent } from '../signature-pad/signature-pad.component';

import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.css']
})
export class MantenimientosComponent implements OnInit {
  arrmantenimiento = <any[]>([]);
  detalle: any = null;
  updateForm: FormGroup;
  confirmationForm: FormGroup;

  currentUser!: any;

  displayedColumns: string[] = ['status','N_SOLICITUD','CREATED_AT', 'MOTIVO_SOLICITUD',  'AREA_ASIGNADA', 'SOLICITADO_POR', 'ACCIONES'];
  originalColumnPositions: { [key: string]: number } = {};

  allColumns = [
    { key: 'status', label: 'Status' },
    { key: 'N_SOLICITUD', label: 'N° solicitud' },
    { key: 'MOTIVO_SOLICITUD', label: 'Motivo' },
    { key: 'AREA_ASIGNADA', label: 'Área' },
    { key: 'CREATED_AT', label: 'Fecha Creación' },
    { key: 'SOLICITADO_POR', label: 'Solicitado por' }
  ];
  showModal = false;
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('solicitadoFirma') solicitadoFirma!: SignaturePadComponent;
  @ViewChild('revisadoFirma') revisadoFirma!: SignaturePadComponent;
  @ViewChild('validadoFirma') validadoFirma!: SignaturePadComponent;

  constructor(
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(MantenimientoService) private mantenimientoService: MantenimientoService,
    @Inject(UsersService) private usersService: UsersService
  ) {

    this.confirmationForm = this.fb.group({
      N_SOLICITUD: [''],
      centro_costo: [''],
      identificacion_puerta: [''],
      cantidad_puertas: [''],
      nombre_tecnico: [''],
      n_correlativo: [''],
      nombre_convenio: [''],
      complejo_asistencial: [''],
      fecha: [''],
      inspecciones: this.fb.array([]),
      observaciones: [''],
      firma_adjudicatario: [''],
      firma_rt: ['']
    });
    this.addFixedInspecciones();
    this.updateForm = this.fb.group({
      _id: [{ value: '', disabled: true }],
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
      status:[''],
      VALOR_ESTIMADO: [''],
      SOLICITADO_POR: [''],
      REVISADO_POR: [''],
      VALIDADO_POR: [''],
      TIPO_INGRESO: [''],
      FIRMA_SOLICITADO_POR: [''],
      FIRMA_REVISADO_POR: [''],
      FIRMA_VALIDADO_POR: [''],
      CREATED_AT:['']
    });
  }

  async ngOnInit() {
    // if (this.detalle) {
    //   this.populateForm();
    // }
    this.displayedColumns.forEach((column, index) => {
      this.originalColumnPositions[column] = index;
    });
    this.usersService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
    this.cargarMantenimientos();
  }

  toggleColumn(column: string) {
    const index = this.displayedColumns.indexOf(column);
    if (index > -1) {
      if (column !== 'ACCIONES') {
        this.displayedColumns.splice(index, 1);
      }
    } else {
      const originalPosition = this.originalColumnPositions[column];
      const currentAccionesIndex = this.displayedColumns.indexOf('ACCIONES');
      const insertIndex = originalPosition < currentAccionesIndex ? originalPosition : currentAccionesIndex - 1;
      this.displayedColumns.splice(insertIndex, 0, column);
    }
  }


  cargarMantenimientos() {
    this.mantenimientoService.verMantenimientos().subscribe(
      (response) => {
        if (!response.error) {
          response.data.map((item: any) => {
            item.CREATED_AT = this.formatDate(item.CREATED_AT);
          })
          this.dataSource = new MatTableDataSource(response.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (error) => {
        console.error('Error al cargar mantenimientos:', error);
      }
    );
  }

  get inspecciones() {
    return this.confirmationForm.get('inspecciones') as FormArray;
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

  // envia() {

  //   console.log(this.confirmationForm.value);
  //   if (this.confirmationForm.valid) {
  //     const datos = this.confirmationForm.value;
  //     console.log({ datos });
  //     Swal.fire({
  //       title: '¿Estás seguro?',
  //       text: '¡No podrás revertir esto!',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#d33',
  //       cancelButtonColor: '#3085d6',
  //       confirmButtonText: 'Sí, Confirmalo!'
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         this.mantenimientoService.confirmaMantenimiento(datos).subscribe(
  //           response => {
  //             Swal.fire('Guardado!', 'La confirmación ha sido guardada.', 'success');
  //             this.closeModalV2()
  //             // Lógica adicional después de guardar, por ejemplo, cerrar el modal
  //           },
  //           error => {
  //             Swal.fire('Error!', 'Hubo un problema al guardar la confirmación.', 'error');
  //           }
  //         );
  //       }
  //     });

  //   } else {
  //     console.log('El formulario no es válido');
  //     Swal.fire('Error!', 'El formulario no es válido.', 'error');
  //   }
  // }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  obtenerPdf(nSolicitud: number) {
    this.mantenimientoService.descargarMantenimiento(nSolicitud).subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `solicitud_${nSolicitud}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error al descargar el PDF:', error);
    });
  }

  obtenerPdfConfirmacion(nSolicitud: number) {
    this.mantenimientoService.descargarConfirmacion(nSolicitud).subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `confirmacion_${nSolicitud}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error al descargar el PDF:', error);
    });
  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }





  openModal(datos: any) {
    this.detalle = datos;
    this.updateForm.patchValue(datos);
    const modalElement = document.getElementById('detalleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  openModalV2(datos: any) {
    this.detalle = datos;
    this.confirmationForm.patchValue(datos);
    const modalElement = document.getElementById('detalleModalV2');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onUpdate() {
    if (this.updateForm.valid) {
      const formValue = this.updateForm.getRawValue();
      formValue.USUARIO_UPD = this.currentUser?.name || '';
      if (!this.solicitadoFirma?.isEmpty()) {
        formValue.FIRMA_SOLICITADO_POR = this.solicitadoFirma?.save();
      }
      if (!this.revisadoFirma?.isEmpty()) {
        formValue.FIRMA_REVISADO_POR = this.revisadoFirma?.save();
      }

      if (!this.validadoFirma?.isEmpty()) {
        formValue.FIRMA_VALIDADO_POR = this.validadoFirma?.save();
      }

      console.log('Datos del formulario:', formValue); // Agrega esta línea para depurar

      this.mantenimientoService.actualizarMantenimiento(formValue).subscribe(
        response => {
          console.log('Respuesta del backend:', response); // Agrega esta línea para depurar
          Swal.fire('Actualizado!', 'El mantenimiento ha sido actualizado.', 'success');
          this.closeModal();
          this.cargarMantenimientos(); // Recarga la lista de mantenimientos
        },
        error => {
          console.error('Error al actualizar el mantenimiento:', error); // Agrega esta línea para depurar
          Swal.fire('Error!', 'Hubo un problema al actualizar el mantenimiento.', 'error');
        }
      );
    }
  }

  closeModal() {
    const modalElement = document.getElementById('detalleModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
    this.detalle = null;
    this.cargarMantenimientos();
    this.updateForm.reset();
  }
  closeModalV2() {
    const modalElement = document.getElementById('detalleModalV2');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
    this.detalle = null;
    this.cargarMantenimientos();
    this.confirmationForm.reset();
  }
  openColumnModal() {
    this.showModal = true;
  }

  closeColumnModal() {
    this.showModal = false;
  }

  confirmDelete(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteMantenimiento(id);
      }
    });
  }
  deleteMantenimiento(id: string) {
    this.mantenimientoService.eliminarMantenimiento(id).subscribe({
      next: () => {
        Swal.fire(
          'Eliminado!',
          'La solicitud ha sido eliminada.',
          'success'
        );
        this.arrmantenimiento = this.arrmantenimiento.filter(m => m._id !== id);
        this.cargarMantenimientos(); // Asegúrate de recargar después de confirmar la eliminación
      },
      error: (error) => {
        Swal.fire(
          'Error!',
          'Hubo un problema al eliminar la solicitud.',
          'error'
        );
      }
    });
  }
  confirmaMantenimiento(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, Confirmalo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmaMantenimientoEx(id);
      }
    });
  }
  confirmaMantenimientoEx(id: string) {
    this.mantenimientoService.confirmaMantenimiento(id).subscribe({
      next: () => {
        Swal.fire(
          'Confirmado!',
          'La mantencion ha sido confirmada.',
          'success'
        );

      this.cargarMantenimientos();
      },
      error: (error) => {
        Swal.fire(
          'Error!',
          'Hubo un problema al confirmar la mantencion.',
          'error'
        );
      }
    });
  }


}

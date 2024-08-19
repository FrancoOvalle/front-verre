import { Component, inject, OnInit, ViewChild, Inject } from '@angular/core';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-mantenedor-usuario',
  templateUrl: './mantenedor-usuario.component.html',
  styleUrls: ['./mantenedor-usuario.component.css']
})
export class MantenedorUsuarioComponent implements OnInit{

  arrmantenimiento = <any[]>([]);
  detalle: any = null;
  updateForm: FormGroup;
  // confirmationForm: FormGroup;

  currentUser!: any;

//rut, nombre, tipo, correo, telefono, fNac, pass, fechaRegistro
  displayedColumns: string[] = [
    'status',
    'rut',
    'nombre',
    'correo',
    // 'telefono',
    // 'fNac',
    'tipo',
    'ACCIONES'
  ];
  originalColumnPositions: { [key: string]: number } = {};

  allColumns = [
    { key: 'status', label: 'Status' },
    { key: 'rut', label: 'Rut' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'correo', label:'Correo'},
    { key: 'tipo', label: 'Tipo' },
    // { key: 'telefono', label: 'Telefono'},
    // { key: 'fNac', label: 'Fecha Nacto.'},
    // { key: 'CREATED_AT', label: 'Fecha Creación' }
  ];
  showModal = false;
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(UsersService) private usersService: UsersService
  ){
    this.updateForm = this.fb.group({
      _id:[{value:'', disabled: true}],
      rut:['',Validators.required],
      nombre:['', Validators.required],
      tipo:[''],
      correo:[''],
      telefono:['',Validators.required],
      user:[''],
      fNac:['']
    })
  }

  ngOnInit(): void {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openColumnModal() {
    this.showModal = true;
  }

  closeColumnModal() {
    this.showModal = false;
  }


  onUpdate() {
    if (this.updateForm.valid) {
      const formValue = this.updateForm.getRawValue();
      formValue.USUARIO_UPD = this.currentUser?.name || '';

      console.log('Datos del formulario:', formValue); // Agrega esta línea para depurar

      this.usersService.actualizarUsuario(formValue).subscribe(
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

  cargarMantenimientos() {
    this.usersService.verUsuarios().subscribe(
      (response) => {
        if (!response.error) {
          response.data.map((item: any) => {
            // item.CREATED_AT = this.formatDate(item.CREATED_AT);
          })
          this.dataSource = new MatTableDataSource(response.data);
          console.log({respuesta: response.data});
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (error) => {
        console.error('Error al cargar mantenimientos:', error);
      }
    );
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
    this.usersService.eliminarUsuario(id).subscribe({
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



  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }



}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreventivoService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;


  constructor() {
    this.baseUrl = 'http://170.239.85.62:1200/api/mantenimiento';
    // this.baseUrl = 'http://localhost:1200/api/mantenimiento';
  }

  verMantenimientos(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl);
  }
  getById(mantenimientoId: string){
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/${mantenimientoId}`)
    )
  }
  descargarConfirmacion(nSolicitud: number) {
    return this.httpClient.get(`${this.baseUrl}/confirmacion/${nSolicitud}`, { responseType: 'blob' });
  }
  agregarMantenimiento(solicitud: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/add/`, solicitud);
  }
  eliminarMantenimiento(id: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/del/${id}`);
  }
  actualizarMantenimiento(solicitud: any): Observable<any> {
    console.log({data:solicitud});
    return this.httpClient.patch(`${this.baseUrl}/edit/`, solicitud);
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    // this.baseUrl = 'http://170.239.85.62:1200/api/mantenimiento';
    this.baseUrl = 'http://localhost:1200/api/mantenimiento';
    // this.baseUrl = 'https://verre.volkancloud.cl/front-verre/api/mantenimiento';
  }
  // constructor() { this.baseUrl = 'http://localhost:1200/api/mantenimiento';}

  // async verMantenimientos(){
  //   const data = await this.httpClient.get(this.baseUrl).toPromise();
  //   return data;
  // }
  verMantenimientos(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl);
  }

  verMantenimientosPreventivos(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/preventivos`);
  }


  getById(mantenimientoId: string){
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/${mantenimientoId}`)
    )
  }

  getByIdPreven(mantenimientoId: string){
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/${mantenimientoId}`)
    )
  }

  descargarMantenimiento(nSolicitud: number) {
    return this.httpClient.get(`${this.baseUrl}/download/${nSolicitud}`, { responseType: 'blob' });
  }

  descargarConfirmacion(nSolicitud: number) {
    return this.httpClient.get(`${this.baseUrl}/confirmacion/${nSolicitud}`, { responseType: 'blob' });
  }

  descargarPreventiva(nSolicitud: number) {
    return this.httpClient.get(`${this.baseUrl}/preventiva/confirmacion/${nSolicitud}`, { responseType: 'blob' });
  }

  agregarMantenimiento(solicitud: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/add/`, solicitud);
  }

  agregarMantenimientoPreventivo(solicitud: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/preventivo/add/`, solicitud);
  }
  eliminarMantenimiento(id: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/del/${id}`);
  }

  eliminarMantenimientoPreventivo(id: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/preventivo/del/${id}`);
  }

  actualizarMantenimiento(solicitud: any): Observable<any> {
    console.log({data:solicitud});
    return this.httpClient.patch(`${this.baseUrl}/edit/`, solicitud);
  }

  actualizarMantenimientoPreventivo(solicitud: any): Observable<any> {
    return this.httpClient.patch(`${this.baseUrl}/preventivo/edit/`, solicitud);
  }
///api/mantenimiento/confirma/
  confirmaMantenimiento(id: string): Observable<any> {
    const postData = {
      id: id  // Asegúrate de que la clave 'id' es la esperada por el backend
    };
    return this.httpClient.post(`${this.baseUrl}/confirma/`, postData);
  }
  confirmaMantenimientoPreventivo(id: string): Observable<any> {
    const postData = {
      id: id  // Asegúrate de que la clave 'id' es la esperada por el backend
    };
      return this.httpClient.post(`${this.baseUrl}/preventiva/confirma/`, postData);
  }


  getEstadisticasProgramadas(startDate: string, endDate: string): Observable<any> {
    // Si no se proporciona startDate, establece el primer día del mes actual
    if (!startDate) {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    }

    // Si no se proporciona endDate, establece el último día del mes actual
    if (!endDate) {
      const now = new Date();
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    }

    const datos = {
      desde: startDate,
      hasta: endDate
    };

    return this.httpClient.post(`${this.baseUrl}/estadisticaPro/`, datos);
  }

  getEstadisticasPreventivas(startDate: string, endDate: string): Observable<any> {
    // Si no se proporciona startDate, establece el primer día del mes actual
    if (!startDate) {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    }

    // Si no se proporciona endDate, establece el último día del mes actual
    if (!endDate) {
      const now = new Date();
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    }

    const datos = {
      desde: startDate,
      hasta: endDate
    };

    return this.httpClient.post(`${this.baseUrl}/estadisticaPre/`, datos);
  }

  generaGrafico(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/grafico`);
  }

  datosTablaDashboard(): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}/tabla`);
  }

}


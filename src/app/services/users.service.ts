import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;
  private currentUserSubject: BehaviorSubject<any>;
  private isLoggedSubject: BehaviorSubject<boolean>;

  constructor() {
    // this.baseUrl = 'http://170.239.85.62:1200/api/usuarios';
    this.baseUrl = 'http://localhost:1200/api/usuarios';
    // this.baseUrl = 'https://verre.volkancloud.cl/front-verre/api/usuarios';
    this.currentUserSubject = new BehaviorSubject<any>(null);
    this.isLoggedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
    this.loadCurrentUser();
  }

  verUsuarios(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl);
  }

  eliminarUsuario(id: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/del/${id}`);
  }

  actualizarUsuario(solicitud: any): Observable<any> {
    console.log({data:solicitud});
    return this.httpClient.patch(`${this.baseUrl}/edit/`, solicitud);
  }

  register(formValue: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/add`, formValue).pipe(
      catchError(this.handleError<any>('register'))
    );
  }

  login(formValue: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/sesion`, formValue).pipe(
      tap(response => {
        if (!response.error) {
          localStorage.setItem('token_verre', response.token);
          this.loadCurrentUser();
        }
      }),
      catchError(this.handleError<any>('login'))
    );
  }

  isLogged(): Observable<boolean> {
    return this.isLoggedSubject.asObservable();
  }
  private isLoggedIn(): boolean {
    return localStorage.getItem('token_verre') ? true : false;
  }

  private loadCurrentUser() {
    const token = localStorage.getItem('token_verre');
    if (token) {
      const decodedUser = jwtDecode(token);
      this.currentUserSubject.next(decodedUser);
      this.isLoggedSubject.next(true);
    } else {
      this.currentUserSubject.next(null);
      this.isLoggedSubject.next(false);
    }
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      localStorage.removeItem('token_verre');
      this.currentUserSubject.next(null);
      this.isLoggedSubject.next(false);
      observer.next();
      observer.complete();
    });
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

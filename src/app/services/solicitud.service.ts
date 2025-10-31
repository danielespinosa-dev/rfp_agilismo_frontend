import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private apiUrl = 'http://localhost:5000/api/solicitudes'; // Update with your backend API URL

  constructor(private http: HttpClient) { }

  registrarSolicitud(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, data);
  }

  consultarSolicitudes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  obtenerInforme(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/informe/${id}`);
  }
}
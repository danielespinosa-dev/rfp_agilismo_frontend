import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformeService {
  private apiUrl = 'http://localhost:5000/api/informe'; // Adjust the URL as needed

  constructor(private http: HttpClient) { }

  getInforme(proveedorId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${proveedorId}`);
  }

  downloadPDF(proveedorId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${proveedorId}/download/pdf`, { responseType: 'blob' });
  }

  downloadExcel(proveedorId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${proveedorId}/download/excel`, { responseType: 'blob' });
  }
}
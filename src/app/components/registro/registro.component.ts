import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from '../../../environments/environment'; // Importa el environment

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  codigo: string = '';
  nit: string = '';
  proveedor: string = '';
  excelFile: File | null = null;
  anexos: File[] = [];
  selectedFiles: File[] = [];
  modalVisible: boolean = false;
  modalMessage: string = '';
  loading: boolean = false;
  tipoRfp: string = '';

  @ViewChild('registroForm') registroForm!: NgForm;

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.excelFile = input.files[0];
    }
  }

  handleAnexosInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.anexos = Array.from(input.files);
      console.log(this.anexos);
    }
  }

 constructor(private http: HttpClient) {}

  submitForm(): void {
    this.loading = true; // <--- INICIA LOADING
    const formData = new FormData();
    formData.append('CodigoProyecto', this.codigo);
    formData.append('ProveedorNombre', this.proveedor);
    formData.append('ProveedorNIT', this.nit);
    formData.append('EstadoGeneral', 'pendiente');
    formData.append('UsuarioSolicitante', 'user-hackathon');

    if (this.excelFile) {
      formData.append('excel_file', this.excelFile, this.excelFile.name);
    }

    // Si anexos tiene archivos, agrégalos todos bajo el mismo campo 'anexos'
    if (this.anexos.length > 0) {
      for (const file of this.anexos) {
        formData.append('anexos', file, file.name);
      }
    }

    this.http.post<any>(`${environment.apiUrl}/vigia/solicitud`, formData)
      .subscribe({
        next: (response) => {
          this.loading = false; // <--- DETIENE LOADING
          this.modalMessage = `Solicitud creada exitosamente. ID: ${response.SolicitudID}`;
          this.modalVisible = true;
          this.limpiarFormulario();
        },
        error: (error) => {
          this.loading = false; // <--- DETIENE LOADING
          this.modalMessage = 'Error al crear la solicitud.';
          this.modalVisible = true;
        }
      });
}

limpiarFormulario(): void {
  this.codigo = '';
  this.nit = '';
  this.proveedor = '';
  this.excelFile = null;
  this.anexos = [];
  this.selectedFiles = [];
}

   onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      this.anexos = this.selectedFiles; // Asegura que anexos tenga los archivos seleccionados
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files) {
      this.selectedFiles = Array.from(event.dataTransfer.files);
      this.anexos = this.selectedFiles; // Asegura que anexos tenga los archivos seleccionados
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    // Opcional: puedes agregar lógica para resaltar el dropzone
  }

  onDragLeave(): void {
    // Opcional: puedes agregar lógica para quitar el resaltado del dropzone
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.excelFile = input.files[0];
    }
  }

  onSubmit(): void {
    this.loading = true; // <--- INICIA LOADING

    // Marca todos los campos como tocados para activar las validaciones
    this.registroForm.form.markAllAsTouched();  
    // Validación: todos los campos requeridos
    if (
      !this.codigo ||
      !this.nit ||
      !this.proveedor ||
      !this.tipoRfp ||
      !this.excelFile ||
      this.selectedFiles.length === 0
    ) {
      this.loading = false;
      return;
    }

    // Lógica para manejar el envío del formulario
    this.submitForm();
  }
}
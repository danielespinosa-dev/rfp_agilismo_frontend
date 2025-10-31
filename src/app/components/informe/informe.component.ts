import { Component, OnInit } from '@angular/core';
import { InformeService } from '../../services/informe.service';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css']
})
export class InformeComponent implements OnInit {
  informe: any; // Cambiado de reportData a informe
  providerName: string = 'Proveedor B';
  overallScore: number = 82;

  constructor(private informeService: InformeService) {}

  ngOnInit(): void {
    this.fetchReport();
  }

  fetchReport(): void {
    // Datos dummy para pruebas
    this.informe = {
      economica: {
        puntaje: 80,
        nivel: 'Alto',
        subcriterios: [
          { nombre: 'Gestión financiera', puntaje: 85, recomendacion: 'Mantener controles' },
          { nombre: 'Gobernanza', puntaje: 75, recomendacion: 'Mejorar transparencia' }
        ]
      },
      social: {
        puntaje: 78,
        nivel: 'Medio',
        subcriterios: [
          { nombre: 'Relaciones laborales', puntaje: 80, recomendacion: 'Capacitación continua' },
          { nombre: 'Impacto social', puntaje: 76, recomendacion: 'Fortalecer programas' }
        ]
      },
      ambiental: {
        puntaje: 85,
        nivel: 'Alto',
        subcriterios: [
          { nombre: 'Gestión de residuos', puntaje: 90, recomendacion: 'Mantener prácticas' },
          { nombre: 'Consumo energético', puntaje: 80, recomendacion: 'Optimizar procesos' }
        ]
      },
      global: {
        puntaje: 82,
        nivel: 'Alto'
      }
    };
  }

  descargarExcel(): void {
    console.log('Descargar Excel');
    alert('Funcionalidad de descarga de Excel aún no implementada.');
  }

  descargarPDF(): void {
    console.log('Descargar PDF');
    alert('Funcionalidad de descarga de PDF aún no implementada.');
  }
}
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // Importa el environment
import { AfterViewInit } from '@angular/core';
import { ConsolidadoTablePipe } from '../../pipes/consolidado-table.pipe';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.css']
})
export class EstadoComponent {
  searchProveedor: string = '';
  searchNIT: string = '';

  solicitudes: any[] = [];
  solicitudesFiltradas: any[] = [];
  loading: boolean = false; // <--- NUEVA VARIABLE
  constructor(private http: HttpClient) {}

  cambiarTab(tab: string) {
    this.informeTab = tab;
    if (tab === 'graficas') {
      setTimeout(() => this.renderGraficas(), 300);
    }
  }
  formatRespuesta(texto: string): string {
  if (!texto) return '';
  // Convierte Markdown básico a HTML
  let html = texto
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negrita
    .replace(/\n/g, '<br>'); // Saltos de línea
  return html;
}
  ngOnInit(): void {
    this.getSolicitudes();
  }
  ngAfterViewInit() {
    setTimeout(() => this.renderGraficas(), 500); // Espera a que el DOM y datos estén listos
  }

  getSolicitudes(): void {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/vigia/solicitudes`)
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.solicitudes = data;
          this.solicitudesFiltradas = data;
        },
        error: (err) => {
          this.loading = false;
          console.error('Error al obtener solicitudes', err);
        }
      });
  }

  informeVisible: boolean = false;
  informeData: any = null;
  informeTab: string = 'resumen';

  verInforme(id: string) {
  this.http.get<any>(`${environment.apiUrl}/vigia/solicitud/${id}`)
    .subscribe({
      next: (data) => {
        this.informeData = data;
        this.informeTab = 'resumen';
        this.informeVisible = true;
        setTimeout(() => this.renderGraficas(), 500); // <-- Llama aquí
      },
      error: (err) => {
        alert('Error al consultar el informe');
        console.error('Error al consultar informe', err);
      }
    });
  }

  cerrarInforme() {
    this.informeVisible = false;
    this.informeData = null;
  }

  eliminarSolicitud(id: string): void {
    if (!confirm('¿Seguro que deseas eliminar esta solicitud?')) return;
    this.http.delete(`${environment.apiUrl}/vigia/solicitud/${id}`)
      .subscribe({
        next: () => {
          this.solicitudes = this.solicitudes.filter(s => s.SolicitudID !== id);
        },
        error: (err) => {
          alert('Error al eliminar la solicitud');
          console.error('Error al eliminar', err);
        }
      });
  }

  searchSolicitudes() {
    this.getSolicitudes();
    this.solicitudesFiltradas = this.solicitudes.filter(s => {
      const proveedorMatch = this.searchProveedor ? s.ProveedorNombre.toLowerCase().includes(this.searchProveedor.toLowerCase()) : true;
      const nitMatch = this.searchNIT ? s.ProveedorNIT.includes(this.searchNIT) : true;
      return proveedorMatch && nitMatch;
    });
  }

  imprimirReporte() {
    const contenido = document.getElementById('reporte-consolidado');
    if (!contenido) {
      alert('No se encontró el reporte para imprimir.');
      return;
    }
    const ventana = window.open('', '', 'height=900,width=1200');
    ventana!.document.write('<html><head><title>Reporte Consolidado</title>');
    ventana!.document.write('<style>body{font-family:Arial;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #333;padding:6px;} th{background:#ff007f;color:#fff;} td{background:#232323;color:#fff;} em{color:#ff007f;}</style>');
    ventana!.document.write('</head><body>');
    ventana!.document.write(contenido.innerHTML);
    ventana!.document.write('</body></html>');
    ventana!.document.close();
    // Espera a que la ventana termine de cargar antes de imprimir
    ventana!.focus();
    setTimeout(() => {
      ventana!.print();
    }, 400);
  }

  imprimirInformeCompleto() {
    const contenido = document.getElementById('modal-informe-completo');
    if (!contenido) {
      alert('No se encontró el informe para imprimir.');
      return;
    }
    const ventana = window.open('', '', 'height=900,width=1200');
    ventana!.document.write('<html><head><title>Informe Completo</title>');
    ventana!.document.write('<style>body{font-family:Montserrat,Arial,sans-serif;background:#232323;color:#fff;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #333;padding:6px;} th{background:#ff007f;color:#fff;} td{background:#232323;color:#fff;} em{color:#ff007f;} h2,h3{color:#ff007f;} .pregunta-box{background:#ff007f;color:#fff;padding:10px 14px;border-radius:7px;font-size:1.08em;font-weight:bold;margin-bottom:10px;} .analisis-box{background:#222;padding:10px 14px;border-radius:7px;display:flex;flex-direction:column;gap:6px;font-size:0.98em;color:#fff;border-left:4px solid #ff007f;} .respuesta-box{display:flex;gap:24px;align-items:center;background:#232323;padding:8px 14px;border-radius:7px;margin-bottom:10px;font-size:1em;color:#fff;} .puntaje-proveedor{background:#388e3c;color:#fff;padding:2px 10px;border-radius:6px;font-weight:bold;font-size:0.98em;} .badge{display:inline-block;padding:2px 10px;border-radius:8px;margin-right:6px;font-size:0.95em;background:#333;color:#fff;} .badge.ambiental{background:#388e3c;} .badge.social{background:#1976d2;} .badge.economica{background:#fbc02d;color:#232323;} </style>');
    ventana!.document.write('</head><body>');
    ventana!.document.write(contenido.innerHTML);
    ventana!.document.write('</body></html>');
    ventana!.document.close();
    ventana!.focus();
    setTimeout(() => {
      ventana!.print();
    }, 400);
  }

  renderGraficas() {
    if (!this.informeVisible || !this.informeData) return;

    // Agrupación por dimensión
    const dimensiones = ['Ambiental', 'Social', 'Económica'];
    const conteoDimensiones = [0, 0, 0];
    const criteriosMap: {[key: string]: number[]} = {};
    const resultadosMap: {[key: string]: number} = {};

    const agregarDatos = (arr: any[], idx: number) => {
      arr.forEach(item => {
        if (item.required_action) {
          item.required_action.submit_tool_outputs.tool_calls.forEach((call: any) => {
            if (call.function) {
              (this.parseRevisiones(call.function.arguments) || []).forEach(rev => {
                conteoDimensiones[idx]++;
                // Agrupa por criterio
                if (rev.criterio) {
                  if (!criteriosMap[rev.criterio]) criteriosMap[rev.criterio] = [];
                  criteriosMap[rev.criterio].push(Number(rev.Puntaje_respuesta_proveedor) || 0);
                }
                // Agrupa por resultado
                if (rev.resultado_por_pregunta) {
                  resultadosMap[rev.resultado_por_pregunta] = (resultadosMap[rev.resultado_por_pregunta] || 0) + 1;
                }
              });
            }
          });
        }
      });
    };

    agregarDatos(this.informeData.EvaluacionAmbiental || [], 0);
    agregarDatos(this.informeData.EvaluacionSocial || [], 1);
    agregarDatos(this.informeData.EvaluacionEconomica || [], 2);

    // Pie chart dimensiones
    if (document.getElementById('pieDimensiones')) {
      new Chart('pieDimensiones', {
        type: 'pie',
        data: {
          labels: dimensiones,
          datasets: [{
            data: conteoDimensiones,
            backgroundColor: ['#388e3c', '#1976d2', '#ff007f']
          }]
        },
        options: {
          plugins: { legend: { labels: { color: '#fff' } } }
        }
      });
    }

    // Bar chart criterios
    const criterios = Object.keys(criteriosMap);
    const puntajesPromedio = criterios.map(c => {
      const arr = criteriosMap[c];
      return arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length) : 0;
    });
    if (document.getElementById('barCriterios')) {
      new Chart('barCriterios', {
        type: 'bar',
        data: {
          labels: criterios,
          datasets: [{
            label: 'Puntaje Promedio Proveedor',
            data: puntajesPromedio,
            backgroundColor: '#00ffe7'
          }]
        },
        options: {
          scales: {
            x: { ticks: { color: '#fff' } },
            y: { ticks: { color: '#fff' }, beginAtZero: true, max: 100 }
          },
          plugins: { legend: { labels: { color: '#fff' } } }
        }
      });
    }

    // Bar chart resultados
    const resultados = Object.keys(resultadosMap);
    const resultadosCount = resultados.map(r => resultadosMap[r]);
    if (document.getElementById('barResultados')) {
      new Chart('barResultados', {
        type: 'bar',
        data: {
          labels: resultados,
          datasets: [{
            label: 'Cantidad de Preguntas',
            data: resultadosCount,
            backgroundColor: '#ff007f'
          }]
        },
        options: {
          scales: {
            x: { ticks: { color: '#fff' } },
            y: { ticks: { color: '#fff' }, beginAtZero: true }
          },
          plugins: { legend: { labels: { color: '#fff' } } }
        }
      });
    }
  }

  parseRevisiones(args: any): any[] {
    try {
      let obj = typeof args === 'string' ? JSON.parse(args) : args;
      if (obj && obj.revisiones) {
        return obj.revisiones;
      }
      return [];
    } catch {
      return [];
    }
  }

  getConsolidadoTableRows(): any[] {
    if (!this.informeData) return [];
    // Usa el pipe directamente si lo tienes inyectado, o copia la lógica aquí
    const pipe = new ConsolidadoTablePipe();
    return pipe.transform(this.informeData);
  }

  getConsolidadoTotales(): { pesoTotal: number, puntajeTotal: number } {
    if (!this.informeData) return { pesoTotal: 0, puntajeTotal: 0 };
    const rows = this.getConsolidadoTableRows();
    // Agrupa por dimensión
    const dimensiones: { [key: string]: { peso: number, puntaje: number } } = {};
    rows.forEach(row => {
      if (!dimensiones[row.dimension]) {
        dimensiones[row.dimension] = {
          peso: Number(row.peso_dimension) || 0,
          puntaje: Number(row.puntaje_dimension) || 0
        };
      }
    });
    // Suma pesos y calcula puntaje total ponderado
    let pesoTotal = 0;
    let puntajeTotal = 0;
    Object.values(dimensiones).forEach(dim => {
      pesoTotal += dim.peso;
      puntajeTotal += (dim.puntaje * dim.peso) / 100;
    });
    return { pesoTotal, puntajeTotal: Math.round(puntajeTotal) };
  }

  getDesempeno(): { nivel: string, rango: string, descripcion: string } {
    const puntaje = this.getConsolidadoTotales().puntajeTotal;
    if (puntaje <= 20) {
      return {
        nivel: 'Inicial',
        rango: '0% - 20%',
        descripcion: 'Proponentes cuyo marco de actuación empresarial se limita al cumplimiento legal o normativo en cuanto a temas ASG, las pocas iniciativas existentes no están articuladas bajo una estrategia clara, ni se tiene una organización de los procesos. Existe resistencia a la implementación de una nueva cultura en sostenibilidad y la vulnerabilidad a pérdidas originadas por la materialización de riesgos ASG es inminente.'
      };
    } else if (puntaje > 20 && puntaje <= 50) {
      return {
        nivel: 'Bajo',
        rango: '>20% y hasta 50%',
        descripcion: 'Proponentes cuyo marco de actuación principal es el cumplimiento legal y entregar bienes y servicios de calidad, mitigando riesgos operativos ligados principalmente a la rentabilidad del negocio. Han implementado algunas prácticas aisladas que benefician a algunos de sus grupos de interés. Tienen el reto de definir un lenguaje común en materia de sostenibilidad y de elevar su nivel de consciencia frente a la conexión entre el progreso económico y el progreso social y medio ambiental. La vulnerabilidad a pérdidas originadas por la materialización de riesgos ASG es alta.'
      };
    } else if (puntaje > 50 && puntaje <= 70) {
      return {
        nivel: 'Aceptable',
        rango: '>50% y hasta 70%',
        descripcion: 'Proponentes que implementan prácticas para mitigar sus riesgos más latentes; incluyendo aquellos relacionados a la reputación del negocio, y abarcando algunos criterios ASG y algunos grupos de interés. Están en la ruta para convertirse en una empresa sostenible con oportunidades de mejora en la integración de toda su cadena de valor a este modelo y en la sistematización y articulación de los procesos con la estrategia corporativa, razón por la cual existe una vulnerabilidad media a la materialización de los riesgos ASG.'
      };
    } else if (puntaje > 70 && puntaje <= 90) {
      return {
        nivel: 'Bueno',
        rango: '>70% y hasta 90%',
        descripcion: 'Proponentes que ven su negocio como parte integral de la sociedad y del medio ambiente, dándoles una mejor posición para aprovechar las oportunidades y cerrar sus brechas ASG en la mayor parte de su cadena de valor. Integran la Sostenibilidad en su planeación estratégica, tienen un entrenamiento avanzado en la gestión, con procesos sistematizados y articulados, razón por la cual existe una baja vulnerabilidad a la materialización de riesgos ASG. Tienen retos para que sus prácticas estén al nivel de estándares de sostenibilidad internacionales.'
      };
    } else {
      return {
        nivel: 'Excelente',
        rango: '>90%',
        descripcion: 'Proponentes que tienen la Sostenibilidad inmersa en su ADN organizacional, promoviendo prácticas ASG a lo largo de toda su cadena de valor. Demuestran liderazgo y dominio del tema, cuentan con prácticas a la altura de estándares internacionales y con procesos robustos de seguimiento a la gestión sostenible. Tienen una visión estratégica a largo plazo para mitigar sus riesgos, fortalecer el posicionamiento frente a sus grupos de interés y mejorar su competitividad y rentabilidad de modo responsable en el entorno. Existe una vulnerabilidad mínima a la materialización de riesgos ASG.'
      };
    }
  }
}
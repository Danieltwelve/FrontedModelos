// home.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HomeService } from '../home.service';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';

// Importar y registrar el adaptador de fechas para Chart.js
// Asegúrate de haber instalado 'date-fns' y 'chartjs-adapter-date-fns'
import 'chartjs-adapter-date-fns';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

// Interfaz para tipar el resultado de forkJoin
interface CombinedData {
  devices: any[]; // Considera crear interfaces más específicas para Device, Detection, Alert
  detections: any[];
  alerts: any[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('lineChart', { static: false }) lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChart', { static: false }) barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart', { static: false }) pieChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('radarChart', { static: false }) radarChartRef!: ElementRef<HTMLCanvasElement>;

  devices: any[] = [];
  detections: any[] = [];
  alerts: any[] = [];
  isBrowser: boolean;
  private dataLoaded: boolean = false;
  private chartsInitialized: boolean = false; // Nueva bandera para controlar la inicialización de las gráficas

  private lineChart: Chart | null = null;
  private barChart: Chart | null = null;
  private pieChart: Chart | null = null;
  private radarChart: Chart | null = null;

  constructor(
    private homeService: HomeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    console.log('HomeComponent: Constructor - isPlatformBrowser:', this.isBrowser);
  }

  ngOnInit(): void {
    console.log('HomeComponent: ngOnInit ejecutado.');
    if (this.isBrowser) {
      console.log('HomeComponent: ngOnInit - En navegador. Iniciando carga de datos.');
      this.loadData();
    } else {
      console.warn('HomeComponent: ngOnInit - No está en el navegador, la carga de datos se pospone a ngAfterViewInit (hidratación).');
    }
  }

  ngAfterViewInit(): void {
    console.log('HomeComponent: ngAfterViewInit ejecutado.');
    if (!this.isBrowser) {
      this.isBrowser = isPlatformBrowser(this.platformId);
      console.log('HomeComponent: ngAfterViewInit - isPlatformBrowser re-checked:', this.isBrowser);
    }

    if (this.isBrowser && this.dataLoaded && !this.chartsInitialized) {
      console.log('HomeComponent: ngAfterViewInit - Datos cargados y ViewChilds listos. Inicializando gráficas.');
      this.initializeCharts();
    } else if (this.isBrowser) {
      console.log('HomeComponent: ngAfterViewInit - ViewChilds listos, esperando que los datos se carguen para inicializar gráficas.');
    }
  }

  private loadData(): void {
    console.log('HomeComponent: Iniciando carga de datos...');
    forkJoin({
      devices: this.homeService.getDevices(),
      detections: this.homeService.getDetections(),
      alerts: this.homeService.getAlerts()
    }).subscribe({
      next: (results: CombinedData) => {
        this.devices = results.devices;
        this.detections = results.detections;
        this.alerts = results.alerts;
        this.dataLoaded = true;
        console.log('HomeComponent: Datos cargados exitosamente. Devices:', this.devices.length, 'Detections:', this.detections.length, 'Alerts:', this.alerts.length);
        console.log('HomeComponent: Datos brutos de detecciones:', this.detections);


        if (this.isBrowser && this.lineChartRef && this.barChartRef && this.pieChartRef && this.radarChartRef && !this.chartsInitialized) {
          console.log('HomeComponent: Datos cargados y ViewChilds listos en el subscribe. Inicializando gráficas.');
          this.initializeCharts();
        } else if (this.isBrowser && this.chartsInitialized) {
          console.log('HomeComponent: Datos cargados, pero las gráficas ya estaban inicializadas. No se reinicializan.');
        } else if (this.isBrowser) {
          console.log('HomeComponent: Datos cargados, pero ViewChilds aún no están listos (ngAfterViewInit no se ha completado).');
        }
      },
      error: (err: any) => {
        console.error('HomeComponent: Error al cargar todos los datos:', err);
      }
    });
  }

  private initializeCharts(): void {
    if (this.chartsInitialized) {
      console.log('HomeComponent: Gráficas ya inicializadas. Saliendo de initializeCharts().');
      return;
    }

    console.log('HomeComponent: Intentando inicializar gráficas...');
    if (!this.isBrowser || !this.lineChartRef?.nativeElement || !this.barChartRef?.nativeElement ||
        !this.pieChartRef?.nativeElement || !this.radarChartRef?.nativeElement) {
      console.warn('HomeComponent: No se pueden inicializar las gráficas: No está en el navegador o los elementos canvas no están listos.');
      return;
    }
    console.log('HomeComponent: Elementos canvas disponibles. Procediendo a crear gráficas.');

    this.destroyCharts();

    this.createLineChart();
    this.createBarChart();
    this.createPieChart();
    this.createRadarChart();

    this.chartsInitialized = true;
    console.log('HomeComponent: Gráficas inicializadas con éxito.');
  }

  private destroyCharts(): void {
    console.log('HomeComponent: Destruyendo gráficas existentes...');
    if (this.lineChart) {
      this.lineChart.destroy();
      this.lineChart = null;
    }
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }
    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = null;
    }
    if (this.radarChart) {
      this.radarChart.destroy();
      this.radarChart = null;
    }
    this.chartsInitialized = false;
  }

  private createLineChart(): void {
    if (!this.lineChartRef?.nativeElement) {
      console.warn('createLineChart: lineChartRef.nativeElement no disponible.');
      return;
    }

    const detectionsByDate = this.processDetectionsByDate();
    console.log('createLineChart: Detecciones procesadas por fecha (labels, data):', detectionsByDate);

    // Calcular el rango del último mes
    const now = new Date();
    // CAMBIO: Se resta 1 mes para el rango 'min'
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const ctx = this.lineChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: detectionsByDate.labels,
          datasets: [{
            label: 'Detecciones por Día',
            data: detectionsByDate.data,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              // CAMBIO: Título actualizado
              text: 'Detecciones a lo Largo del Tiempo (Último Mes)'
            }
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                tooltipFormat: 'MMM d',
                displayFormats: {
                  day: 'MMM d'
                },
              },
              // Establecer el rango de tiempo al último mes
              min: oneMonthAgo.toISOString(), // CAMBIO: Usando oneMonthAgo
              max: now.toISOString(),
              title: {
                display: true,
                text: 'Fecha'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad de Detecciones'
              }
            }
          }
        }
      });
      console.log('createLineChart: Gráfica de línea creada.');
    } else {
      console.error('createLineChart: No se pudo obtener el contexto 2D para la gráfica de línea.');
    }
  }

  private createBarChart(): void {
    if (!this.barChartRef?.nativeElement) {
      console.warn('createBarChart: barChartRef.nativeElement no disponible.');
      return;
    }

    const alertsByLevel = this.processAlertsByLevel();
    console.log('createBarChart: Alertas procesadas por nivel:', alertsByLevel);

    const ctx = this.barChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: alertsByLevel.labels,
          datasets: [{
            label: 'Alertas por Nivel',
            data: alertsByLevel.data,
            backgroundColor: [
              '#10b981', // Baja (verde)
              '#f59e0b', // Media (amarillo/naranja)
              '#ef4444', // Alta (rojo)
              '#8b5cf6', // Crítico (púrpura) - si aplica
              '#06b6d4'  // Otro (azul cian) - si aplica
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Alertas por Nivel'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad de Alertas'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Nivel de Alerta'
              }
            }
          }
        }
      });
      console.log('createBarChart: Gráfica de barras creada.');
    } else {
      console.error('createBarChart: No se pudo obtener el contexto 2D para la gráfica de barras.');
    }
  }

  private createPieChart(): void {
    if (!this.pieChartRef?.nativeElement) {
      console.warn('createPieChart: pieChartRef.nativeElement no disponible.');
      return;
    }

    const detectionTypes = this.processDetectionTypes(); // Ahora procesa solo los 5 más comunes
    console.log('createPieChart: Tipos de detecciones procesados:', detectionTypes);

    const ctx = this.pieChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: detectionTypes.labels,
          datasets: [{
            data: detectionTypes.data,
            backgroundColor: [
              '#ef4444', // Rojo
              '#f59e0b', // Naranja
              '#10b981', // Verde
              '#3b82f6', // Azul
              '#8b5cf6', // Púrpura
              '#06b6d4',  // Cian
              '#cc7000', // Un color adicional para 'Otros' o más categorías
              '#7e22ce'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Tipos de Detecciones'
            }
          }
        }
      });
      console.log('createPieChart: Gráfica de pastel creada.');
    } else {
      console.error('createPieChart: No se pudo obtener el contexto 2D para la gráfica de pastel.');
    }
  }

  private createRadarChart(): void {
    if (!this.radarChartRef?.nativeElement) {
      console.warn('createRadarChart: radarChartRef.nativeElement no disponible.');
      return;
    }

    const activityByZone = this.processActivityByZone();
    console.log('createRadarChart: Actividad por zona procesada:', activityByZone);

    const ctx = this.radarChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: activityByZone.labels,
          datasets: [{
            label: 'Actividad por Zona',
            data: activityByZone.data,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Actividad por Zona'
            }
          },
          scales: {
            r: {
              beginAtZero: true,
              pointLabels: {
                font: {
                  size: 10
                }
              }
            }
          }
        }
      });
      console.log('createRadarChart: Gráfica de radar creada.');
    } else {
      console.error('createRadarChart: No se pudo obtener el contexto 2D para la gráfica de radar.');
    }
  }

  private processDetectionsByDate(): { labels: string[], data: number[] } {
    const detectionsByDate: { [key: string]: number } = {};

    console.log('processDetectionsByDate: Procesando detecciones. Total:', this.detections.length);

    this.detections.forEach(detection => {
      // Usar 'detection.date' en lugar de 'detection.timestamp'
      if (detection.date) {
        const dateObj = new Date(detection.date);
        if (isNaN(dateObj.getTime())) {
          console.warn(`processDetectionsByDate: Fecha inválida encontrada para detección: ${detection.date}`);
          return;
        }
        const date = dateObj.toISOString().split('T')[0];
        detectionsByDate[date] = (detectionsByDate[date] || 0) + 1;
      } else {
        console.warn('processDetectionsByDate: Detección sin campo "date":', detection);
      }
    });

    const sortedDates = Object.keys(detectionsByDate).sort();

    console.log('processDetectionsByDate: Fechas procesadas y ordenadas:', sortedDates);
    console.log('processDetectionsByDate: Datos de detecciones por fecha:', sortedDates.map(date => detectionsByDate[date]));

    return {
      labels: sortedDates,
      data: sortedDates.map(date => detectionsByDate[date])
    };
  }

  private processAlertsByLevel(): { labels: string[], data: number[] } {
    const alertsByLevel: { [key: string]: number } = {};

    this.alerts.forEach(alert => {
      const level = alert.level ? alert.level.toUpperCase() : this.inferAlertLevelFromMessage(alert.message);
      alertsByLevel[level] = (alertsByLevel[level] || 0) + 1;
    });

    const orderedLevels = ['BAJA', 'MEDIA', 'ALTA', 'CRÍTICO', 'GENERAL'];
    const labels: string[] = [];
    const data: number[] = [];

    orderedLevels.forEach(level => {
      if (alertsByLevel[level]) {
        labels.push(level);
        data.push(alertsByLevel[level]);
      }
    });

    Object.keys(alertsByLevel).forEach(level => {
      if (!orderedLevels.includes(level)) {
        labels.push(level);
        data.push(alertsByLevel[level]);
      }
    });

    return {
      labels: labels,
      data: data
    };
  }

  private inferAlertLevelFromMessage(message: string): string {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('error') || lowerMessage.includes('crítico')) return 'CRÍTICO';
    if (lowerMessage.includes('warning') || lowerMessage.includes('advertencia')) return 'ALTA';
    if (lowerMessage.includes('info') || lowerMessage.includes('información')) return 'BAJA';
    return 'GENERAL';
  }

  private processDetectionTypes(): { labels: string[], data: number[] } {
    const detectionCounts: { [key: string]: number } = {};
    const MAX_COMMON_TYPES = 5; // Limitar a los 5 tipos más comunes

    this.detections.forEach(detection => {
      if (detection.detectedObjects && Array.isArray(detection.detectedObjects)) {
        detection.detectedObjects.forEach((obj: any) => {
          if (obj.label) {
            const label = obj.label.charAt(0).toUpperCase() + obj.label.slice(1).toLowerCase();
            detectionCounts[label] = (detectionCounts[label] || 0) + 1;
          }
        });
      }
    });

    // Convertir el objeto a un array de pares [label, count] y ordenar por count descendente
    const sortedTypes = Object.entries(detectionCounts).sort(([, countA], [, countB]) => countB - countA);

    const labels: string[] = [];
    const data: number[] = [];
    let otherCount = 0;

    // Tomar los 5 tipos más comunes
    for (let i = 0; i < sortedTypes.length; i++) {
      if (i < MAX_COMMON_TYPES) {
        labels.push(sortedTypes[i][0]);
        data.push(sortedTypes[i][1]);
      } else {
        otherCount += sortedTypes[i][1]; // Sumar el resto en 'Otros'
      }
    }

    // Añadir la categoría 'Otros' si hay más de 5 tipos
    if (sortedTypes.length > MAX_COMMON_TYPES) {
      labels.push('Otros');
      data.push(otherCount);
    }

    return {
      labels: labels,
      data: data
    };
  }

  private processActivityByZone(): { labels: string[], data: number[] } {
    const activityByZone: { [key: string]: number } = {};

    this.detections.forEach(detection => {
      if (detection.device && detection.device.location) {
        const zone = detection.device.location;
        activityByZone[zone] = (activityByZone[zone] || 0) + 1;
      }
    });

    if (Object.keys(activityByZone).length === 0 && this.devices.length > 0) {
      this.devices.forEach(device => {
        if (device.location) {
          const zone = device.location;
          activityByZone[zone] = 0;
        }
      });
    }

    const sortedZones = Object.keys(activityByZone).sort();

    return {
      labels: sortedZones,
      data: sortedZones.map(zone => activityByZone[zone])
    };
  }

  private extractAlertType(message: string): string {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('error')) return 'Error';
    if (lowerMessage.includes('warning')) return 'Advertencia';
    if (lowerMessage.includes('info')) return 'Información';
    if (lowerMessage.includes('critical')) return 'Crítico';
    return 'General';
  }

  private calculateActivityScore(): number {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentDetections = this.detections.filter(detection =>
      detection.timestamp && new Date(detection.timestamp) > oneDayAgo
    );

    return Math.min(recentDetections.length, 100);
  }

  ngOnDestroy(): void {
    console.log('HomeComponent: ngOnDestroy ejecutado. Limpiando gráficas.');
    this.destroyCharts();
  }
}

import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  isBrowser: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // 1. Gráfico de Barras - Alertas (azul)
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Alertas por nivel' }
    }
  };
  barChartType: ChartType = 'bar';
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Bajas', 'Medias', 'Altas'],
    datasets: [
      { 
        data: [10, 8, 6], 
        label: 'Alertas',
        backgroundColor: 'rgba(54, 162, 235, 0.7)',  // azul semitransparente
        borderColor: 'rgba(54, 162, 235, 1)',        // azul sólido borde
        borderWidth: 1
      }
    ]
  };

  // 2. Gráfico de Pastel - Detecciones por tipo (colores variados)
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Tipos de detecciones' }
    }
  };
  pieChartType: ChartType = 'pie';
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Personas', 'Carros', 'Bicicletas', 'Motos'],
    datasets: [
      { 
        data: [12, 9, 5, 3],
        backgroundColor: [
          '#FF6384', // rojo
          '#36A2EB', // azul
          '#FFCE56', // amarillo
          '#4BC0C0'  // turquesa
        ]
      }
    ]
  };

  // 3. Gráfico de Línea - Detecciones en el tiempo (azul)
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Detecciones por día' }
    }
  };
  lineChartType: ChartType = 'line';
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['20 mayo', '21 mayo', '22 mayo', '23 mayo', '24 mayo'],
    datasets: [
      { 
        data: [5, 8, 6, 12, 9], 
        label: 'Detecciones',
        borderColor: 'rgba(54, 162, 235, 1)',     // línea azul
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // relleno azul claro
        fill: true,
        tension: 0.4
      }
    ]
  };

  // 4. Gráfico de Radar - Actividad por zona (azul)
  radarChartOptions: ChartOptions<'radar'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Actividad por zona' }
    }
  };
  radarChartType: ChartType = 'radar';
  radarChartData: ChartConfiguration<'radar'>['data'] = {
    labels: ['Zona A', 'Zona B', 'Zona C', 'Zona D', 'Zona E'],
    datasets: [
      { 
        data: [6, 9, 7, 5, 4], 
        label: 'Actividad',
        backgroundColor: 'rgba(54, 162, 235, 0.3)',  // azul claro
        borderColor: 'rgba(54, 162, 235, 1)',        // azul sólido borde
        pointBackgroundColor: 'rgba(54, 162, 235, 1)'
      }
    ]
  };

}

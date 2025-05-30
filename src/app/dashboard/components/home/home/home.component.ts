import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { Chart, ChartOptions, ChartType, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  isBrowser: boolean = false;

  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('radarChart') radarChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    // Bar Chart
    new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Bajas', 'Medias', 'Altas'],
        datasets: [{
          data: [10, 8, 6],
          label: 'Alertas',
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Alertas por nivel' } }
      }
    });

    // Pie Chart
    new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Personas', 'Carros', 'Bicicletas', 'Motos'],
        datasets: [{
          data: [12, 9, 5, 3],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Tipos de detecciones' } }
      }
    });

    // Line Chart
    new Chart(this.lineChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['20 mayo', '21 mayo', '22 mayo', '23 mayo', '24 mayo'],
        datasets: [{
          data: [5, 8, 6, 12, 9],
          label: 'Detecciones',
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Detecciones por día' } }
      }
    });

    // Radar Chart
    new Chart(this.radarChartRef.nativeElement, {
      type: 'radar',
      data: {
        labels: ['Zona A', 'Zona B', 'Zona C', 'Zona D', 'Zona E'],
        datasets: [{
          data: [6, 9, 7, 5, 4],
          label: 'Actividad',
          backgroundColor: 'rgba(54, 162, 235, 0.3)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointBackgroundColor: 'rgba(54, 162, 235, 1)'
        }]
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Actividad por zona' } }
      }
    });
  }
}

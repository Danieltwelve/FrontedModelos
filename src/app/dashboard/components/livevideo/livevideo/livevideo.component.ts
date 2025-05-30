import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-livevideo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './livevideo.component.html',
  styleUrl: './livevideo.component.css'
})
export class LivevideoComponent {
  videoUrl: string = 'http://localhost:5000/video';
  showVideo: boolean = false;
  devices: any[] = [];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getDevices();
    }
  }

  getDevices() {
    if (!isPlatformBrowser(this.platformId)) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<any[]>('http://localhost:8081/devices', { headers }).subscribe({
      next: (data) => {
        this.devices = data;
      },
      error: (err) => {
        console.error('Error al obtener dispositivos:', err);
      }
    });
  }

  openFullscreen(element: HTMLElement) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen();
    }
  }

  activarDispositivo(device: any) {
    const body = { nombre_camara: device.name };
    this.http.post('http://localhost:5001/start', body).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: `Cámara "${device.name}" activada correctamente`,
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          this.showVideo = true;
        }, 2000);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al activar la cámara',
          text: 'Por favor verifica que el dispositivo esté disponible o conectado.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#218838'
        

        });
        console.error(error);
      }
    });
  }
}

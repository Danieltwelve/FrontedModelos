import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-livevideo',
  imports: [CommonModule],
  templateUrl: './livevideo.component.html',
  styleUrl: './livevideo.component.css'
})
export class LivevideoComponent {
  videoUrl: string = 'http://localhost:5000/video';
  showVideo: boolean = false; // <-- Nueva variable
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
      alert(`Cámara "${device.name}" activada correctamente`);
      // Espera 2 segundos antes de mostrar el video
      setTimeout(() => {
        this.showVideo = true;
      }, 2000);
    },
    error: (error) => {
      alert('Error al activar la cámara');
      console.error(error);
    }
  });
}
}

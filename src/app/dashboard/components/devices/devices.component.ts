import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css'
})
export class DevicesComponent {
  device = {
    name: '',
    type: '',
    location: '',
    status: ''
  };

  devices: any[] = [];
  cameras: MediaDeviceInfo[] = [];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getCameras();
    }
    this.getDevices();
  }

  async getCameras() {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.cameras = devices.filter(device => device.kind === 'videoinput');
    } catch (err) {
      console.error('Error al obtener cámaras:', err);
    }
  }

  getDevices() {
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

  onSubmit() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('No hay token de autenticación');
      return;
    }

    // Forzar estado INACTIVE
    this.device.status = 'INACTIVE';

    // Limpiar el nombre para que solo quede la parte base
    this.device.name = this.device.name.replace(/\s*\([^)]+\)/, '');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.post('http://localhost:8081/devices', this.device, { headers }).subscribe({
      next: (response) => {
        this.devices.push({ ...this.device });
        this.device = { name: '', type: '', location: '', status: '' };
        alert('Dispositivo registrado correctamente');
      },
      error: (error) => {
        console.error('Error al registrar el dispositivo:', error);
        alert('Error al registrar el dispositivo');
      }
    });
  }

  activarDispositivo(device: any) {
    // Aquí puedes implementar la lógica para activar el dispositivo
    alert(`Activar dispositivo: ${device.name}`);
    // Por ejemplo, podrías hacer un POST o PUT a tu backend para cambiar el estado
  }
}

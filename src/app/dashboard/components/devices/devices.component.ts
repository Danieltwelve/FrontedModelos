import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

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
    if (!isPlatformBrowser(this.platformId)) return; // Solo en navegador
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
      Swal.fire({
        icon: 'error',
        title: 'No hay token de autenticación',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#e53935'
      });
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
        Swal.fire({
          icon: 'success',
          title: 'Dispositivo registrado correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (error) => {
        console.error('Error al registrar el dispositivo:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar el dispositivo',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#e53935'
        });
      }
    });
  }

  activarDispositivo(device: any) {
    Swal.fire({
      icon: 'info',
      title: `Activar dispositivo: ${device.name}`,
      text: 'Aquí puedes implementar la lógica para activar el dispositivo.',
      confirmButtonText: 'Aceptar'
    });
  }
}

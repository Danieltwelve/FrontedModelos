import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // <-- Importa HttpClient y HttpHeaders

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

  constructor(private http: HttpClient) {} // <-- Inyecta HttpClient

  ngOnInit() {
    this.getCameras();
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

  onSubmit() {
    // 1. Obtener el token de Keycloak desde localStorage
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('No hay token de autenticación');
      return;
    }

    // 2. Preparar los headers con el token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // 3. Enviar el dispositivo al endpoint protegido
    this.http.post('http://localhost:8081/devices', this.device, { headers }).subscribe({
      next: (response) => {
        // 4. Actualizar la lista local y limpiar el formulario
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
}

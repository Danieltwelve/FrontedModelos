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

  view: 'menu' | 'add' | 'manage' = 'menu';
  modal: 'add' | 'manage' | 'edit' | null = null;

  editDevice: any = null;
  editDeviceData: any = {};

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

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

    // Forzar estado INACTIVE y limpiar nombre
    this.device.status = 'INACTIVE';
    this.device.name = this.device.name.replace(/\s*\([^)]+\)/, '');

    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    // Guardar una copia del dispositivo antes de la petición
    const deviceCopy = { ...this.device };

    // Primero cerramos el modal
    this.closeModal();

    // Luego hacemos la petición
    this.http.post('http://localhost:8081/devices', deviceCopy, { headers }).subscribe({
        next: (response) => {
            // Actualizamos la lista y limpiamos el formulario
            this.devices.push(deviceCopy);
            this.device = { name: '', type: '', location: '', status: '' };
            
            // Finalmente mostramos el Swal
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

  openModal(type: 'add' | 'manage') {
    this.modal = type;
  }

  closeModal() {
    this.modal = null;
  }

  modificarDispositivo(device: any) {
    this.editDevice = device;
    this.editDeviceData = { ...device }; // Copia los datos para editar
    this.modal = 'edit';
  }

  guardarCambiosDispositivo() {
    const token = localStorage.getItem('access_token');
    if (!token || !this.editDeviceData || !this.editDeviceData.id) return;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.patch(
      `http://localhost:8081/devices/${this.editDeviceData.id}`,
      this.editDeviceData,
      { headers, responseType: 'text' }
    ).subscribe({
      next: () => {
        const idx = this.devices.findIndex(d => d.id === this.editDeviceData.id);
        if (idx !== -1) this.devices[idx] = { ...this.editDeviceData };
        this.editDevice = null;
        this.modal = null;
        Swal.fire({
          icon: 'success',
          title: 'Dispositivo modificado correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al modificar dispositivo',
          text: 'No se pudo modificar el dispositivo.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#e53935'
        });
        console.error(err);
      }
    });
  }

  cancelarEdicionDispositivo() {
    this.editDevice = null;
    this.modal = null;
  }

  // Reemplaza el método existente con esta implementación
  eliminarDispositivo(device: any) {
    // Primero cerramos el modal
    this.closeModal();

    // Luego mostramos la confirmación
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar el dispositivo "${device.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ffd100',
        cancelButtonColor: '#f44336',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}`
            });

            this.http.delete(
                `http://localhost:8081/devices/${device.id}`,
                { headers, responseType: 'text' }
            ).subscribe({
                next: () => {
                    // Eliminar el dispositivo de la lista local
                    this.devices = this.devices.filter(d => d.id !== device.id);
                    
                    setTimeout(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Dispositivo eliminado',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }, 100);
                },
                error: (error) => {
                    console.error('Error al eliminar dispositivo:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al eliminar dispositivo',
                        text: 'No se pudo eliminar el dispositivo.',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#e53935'
                    });
                }
            });
        }
    });
  }
}

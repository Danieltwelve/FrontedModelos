import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  editUser: any = {};
  mostrarFormularioAgregar = false;
  nuevoUsuario: any = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roles: ['user']
  };

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarUsuarios();
    }
  }

  cargarUsuarios() {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<any[]>('http://localhost:8081/users', { headers }).subscribe({
      next: (data) => { this.users = data; },
      error: (err) => { console.error('Error al obtener usuarios:', err); }
    });
  }

  eliminarUsuario(user: any) {
    if (!user || !user.id) return;
    if (!confirm(`¿Seguro que deseas eliminar al usuario ${user.username}?`)) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete(`http://localhost:8081/users/${user.id}`, { headers, responseType: 'text' }).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        alert('Usuario eliminado correctamente');
      },
      error: (err) => {
        alert('Error al eliminar usuario');
        console.error(err);
      }
    });
  }
  modificarUsuario(user: any) {
    // Copia los datos del usuario seleccionado
    this.selectedUser = user;
    this.editUser = { ...user };
  }

  guardarCambiosUsuario() {
    if (!this.editUser || !this.editUser.id) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Construye el body con los campos requeridos
    const body = {
      id: this.editUser.id,
      username: this.editUser.username,
      firstName: this.editUser.firstName,
      lastName: this.editUser.lastName,
      email: this.editUser.email,
      password: this.editUser.password || '', // Puedes pedir el password en el formulario si es obligatorio
      roles: this.editUser.roles || ['user']  // Ajusta según tu lógica de roles
    };

    this.http.put(
      `http://localhost:8081/users/${this.editUser.id}`,
      body,
      { headers, responseType: 'text' }
    ).subscribe({
      next: () => {
        const idx = this.users.findIndex(u => u.id === this.editUser.id);
        if (idx !== -1) this.users[idx] = { ...this.editUser };
        this.selectedUser = null;
        alert('Usuario modificado correctamente');
      },
      error: (err) => {
        alert('Error al modificar usuario');
        console.error(err);
      }
    });
  }

  cancelarEdicion() {
    this.selectedUser = null;
  }

  agregarUsuario() {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post<any>('http://localhost:8081/users', this.nuevoUsuario, { headers })
      .subscribe({
        next: (createdUser) => {
          if (createdUser.id) {
            // Solo si se creó correctamente y hay id
            this.http.post(
              `http://localhost:8081/users/${createdUser.id}/send-verify-email`,
              {},
              { headers, responseType: 'text' }
            ).subscribe({
              next: () => {
                this.cargarUsuarios();
                this.nuevoUsuario = { username: '', firstName: '', lastName: '', email: '', password: '', roles: ['user'] };
                this.mostrarFormularioAgregar = false;
                alert('Usuario agregado correctamente, se ha enviado un correo de verificación al usuario');
              },
              error: (err) => {
                alert('Usuario agregado, pero error al enviar correo de verificación');
                console.error(err);
              }
            });
          } else {
            // Si no hay id, muestra el mensaje de error del backend
            alert(createdUser.message || 'No se pudo crear el usuario');
          }
        },
        error: (err) => {
          alert(err.error?.error || err.error || 'Error al agregar usuario');
          console.error(err);
        }
      });
  }
}

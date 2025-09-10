import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], // Add CommonModule to imports
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  private keycloakUrl = 'http://localhost:8080/realms/detec-realm/protocol/openid-connect/token';
  private clientId = 'detec-api';
  private clientSecret = 'Is5gzCwbsi5QMV0sM89gsSmG7SiSGzCc'; 

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit() {

    // Preparar los datos para la solicitud al token endpoint
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', this.clientId);
    body.set('client_secret', this.clientSecret);
    body.set('username', this.username);
    body.set('password', this.password);
    body.set('scope', 'openid'); // Incluye el scope openid para OIDC

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    // Enviar solicitud al token endpoint de Keycloak
    this.http.post(this.keycloakUrl, body.toString(), { headers }).subscribe({
      next: (response: any) => {
        // Guardar el token (puedes usar localStorage o un servicio)
        localStorage.setItem('access_token', response.access_token);
        console.log('Token generado:', response.access_token);
        // Redirigir a la página prueba
        this.router.navigate(['/dashboard/home']);
      },
      error: (error) => {
        console.error('Error al obtener el token:', error);
        this.errorMessage = 'Usuario o contraseña incorrectos o correo no verificado.';
      }
    });


  }

  clearError() {
    this.errorMessage = '';
  }
}
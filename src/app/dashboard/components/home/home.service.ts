// home.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Device {
  id: number;
  name: string;
  location: string;
}

interface Detection {
  id: number;
  timestamp: string; // Asegúrate de que este formato sea compatible con new Date()
  detectedObjects: any[];
}

interface Alert {
  id: number;
  message: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  // La URL de la API se ha ajustado para que coincida con los mapeos de los controladores de Spring Boot.
  // Si tus controladores de Spring Boot tienen un prefijo global '/api', deberás revertir este cambio
  // o añadir el prefijo global en Spring Boot.
  private readonly API_URL = 'http://localhost:8081'; 

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    // Obtener el token de autenticación del almacenamiento local
    const token = localStorage.getItem('access_token') || '';
    // Crear y devolver los encabezados con el token de autorización
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.API_URL}/devices`, {
      headers: this.getHeaders(),
    });
  }

  getDetections(): Observable<Detection[]> {
    return this.http.get<Detection[]>(`${this.API_URL}/detections`, {
      headers: this.getHeaders(),
    });
  }

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.API_URL}/alerts`, {
      headers: this.getHeaders(),
    });
  }
}

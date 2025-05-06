import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp?: number; // Hacer exp opcional para manejar su ausencia
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('access_token');
    console.log('Token encontrado:', token);

    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        console.log('Token decodificado:', decoded);

        // Verificar si exp existe y es válido
        if (decoded.exp) {
          const currentTime = Math.floor(Date.now() / 1000);
          console.log('Exp:', decoded.exp, 'Current:', currentTime);

          if (decoded.exp > currentTime) {
            console.log('Token válido, acceso permitido');
            return true;
          } else {
            console.log('Token expirado, redirigiendo a /login');
            localStorage.removeItem('access_token');
            router.navigate(['/login']);
            return false;
          }
        } else {
          console.warn('El token no tiene campo exp, considerándolo inválido');
          localStorage.removeItem('access_token');
          router.navigate(['/login']);
          return false;
        }
      } catch (error) {
        console.error('Error decodificando el token:', error);
        localStorage.removeItem('access_token');
        router.navigate(['/login']);
        return false;
      }
    } else {
      console.log('No hay token, redirigiendo a /login');
      router.navigate(['/login']);
      return false;
    }
  } else {
    console.log('Ejecutando en el servidor, acceso permitido para SSR');
    return true;
  }
};
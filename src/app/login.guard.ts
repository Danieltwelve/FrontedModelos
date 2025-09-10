import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp?: number;
}

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp > currentTime) {
          // Token válido, redirige a dashboard y no permite login
          router.navigate(['/dashboard/home']);
          return false;
        }
      } catch (e) {
        // Token inválido, permite login
        return true;
      }
    }
    // No hay token, permite login
    return true;
  }
  // SSR: permite login
  return true;
};
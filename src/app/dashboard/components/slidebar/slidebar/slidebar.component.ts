import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slidebar.component.html',
  styleUrls: ['./slidebar.component.css']
})
export class SlidebarComponent {
  activeRoute: string = '';
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAdminRole();
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const urlSegments = event.urlAfterRedirects.split('/');
      if (urlSegments[1] === 'dashboard' && urlSegments.length > 2) {
        this.activeRoute = urlSegments[2];
      } else if (urlSegments[1] === 'landing-page') {
        this.activeRoute = 'landing-page';
      } else {
        this.activeRoute = '';
      }
    });
  }

  checkAdminRole(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const roles: string[] = decoded.realm_access?.roles || [];
          this.isAdmin = roles.includes('admin');
        } catch (e) {
          this.isAdmin = false;
        }
      }
    }
  }

  navigateTo(route: string): void {
    if (route === 'landing-page') {
      this.router.navigate(['/landing-page']);
    } else {
      this.router.navigate(['/dashboard', route]);
    }
  }
}
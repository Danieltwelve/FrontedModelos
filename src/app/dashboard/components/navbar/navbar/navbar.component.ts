import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initProfileDropdown();
    }
  }

  initProfileDropdown(): void {
    const profile = document.querySelector('nav .profile');
    const imgProfile = profile?.querySelector('img');
    const dropdownProfile = profile?.querySelector('.profile-link');

    imgProfile?.addEventListener('click', function () {
      dropdownProfile?.classList.toggle('show');
    });
  }

  logout(): void {
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro de cerrar sesión?',
      text: 'Se cerrará tu sesión actual.',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#bdbdbd'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('access_token');
        this.router.navigate(['/landing-page']);
      }
    });
  }
}
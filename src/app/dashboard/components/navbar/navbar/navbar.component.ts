import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initProfileDropdown();
      this.initToggleSidebar();
      this.handleClickOutside();
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

  initToggleSidebar(): void {
    const toggleSidebar = document.querySelector('nav .toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const allSideDivider = document.querySelectorAll('#sidebar .divider');
    const allDropdown = document.querySelectorAll('#sidebar .side-dropdown');

    toggleSidebar?.addEventListener('click', function () {
      if (sidebar) {
        sidebar.classList.toggle('hide');

        if (sidebar.classList.contains('hide')) {
          allSideDivider.forEach(item => {
            item.textContent = '-';
          });

          allDropdown.forEach(item => {
            const a = item.parentElement?.querySelector('a:first-child');
            a?.classList.remove('active');
            item.classList.remove('show');
          });
        } else {
          allSideDivider.forEach(item => {
            //if (item.dataset.text) {
              //item.textContent = item.dataset.text;
            //}
          });
        }
      }
    });
  }

  handleClickOutside(): void {
    window.addEventListener('click', function (e) {
      const profile = document.querySelector('nav .profile');
      const imgProfile = profile?.querySelector('img');
      const dropdownProfile = profile?.querySelector('.profile-link');
      
      // Handle profile dropdown click outside
      if (e.target !== imgProfile && e.target !== dropdownProfile) {
        if (dropdownProfile?.classList.contains('show')) {
          dropdownProfile.classList.remove('show');
        }
      }
    });
  }
}
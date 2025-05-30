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

  

}
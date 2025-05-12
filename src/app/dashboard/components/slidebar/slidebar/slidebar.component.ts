import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-slidebar',
  templateUrl: './slidebar.component.html',
  styleUrls: ['./slidebar.component.css']
})
export class SlidebarComponent implements OnInit, OnDestroy {
  @ViewChild('slidebar', { static: true }) sidebar!: ElementRef;
  private eventListeners: (() => void)[] = [];

  constructor() {}

  ngOnInit(): void {
    this.initSidebarDropdown();
    this.handleSidebarCollapse();
  }

  ngOnDestroy(): void {
    // Limpia los eventos registrados
    this.eventListeners.forEach(unregister => unregister());
  }

  initSidebarDropdown(): void {
    const allDropdown = this.sidebar.nativeElement.querySelectorAll('.side-dropdown');

    allDropdown.forEach((item: HTMLElement) => {
      const a = item.parentElement?.querySelector('a:first-child');

      if (a) {
        const listener = (e: Event) => {
          e.preventDefault();

          if (!a.classList.contains('active')) {
            allDropdown.forEach((i: HTMLElement) => {
              const aLink = i.parentElement?.querySelector('a:first-child');
              aLink?.classList.remove('active');
              i.classList.remove('show');
            });
          }

          a.classList.toggle('active');
          item.classList.toggle('show');
        };

        a.addEventListener('click', listener);
        this.eventListeners.push(() => a.removeEventListener('click', listener));
      }
    });
  }

  handleSidebarCollapse(): void {
    const sidebar = this.sidebar.nativeElement;
    const allSideDivider = sidebar.querySelectorAll('.divider');
    const allDropdown = sidebar.querySelectorAll('.side-dropdown');

    if (sidebar) {
      const mouseLeaveListener = () => {
        if (sidebar.classList.contains('hide')) {
          allDropdown.forEach((item: HTMLElement) => {
            const a = item.parentElement?.querySelector('a:first-child');
            a?.classList.remove('active');
            item.classList.remove('show');
          });

          allSideDivider.forEach((item: HTMLElement) => {
            item.textContent = '-';
          });
        }
      };

      const mouseEnterListener = () => {
        if (sidebar.classList.contains('hide')) {
          allDropdown.forEach((item: HTMLElement) => {
            const a = item.parentElement?.querySelector('a:first-child');
            a?.classList.remove('active');
            item.classList.remove('show');
          });

          allSideDivider.forEach((item: HTMLElement) => {
            //if (item.dataset.text) {
             // item.textContent = item.dataset.text;
            //}
          });
        }
      };

      sidebar.addEventListener('mouseleave', mouseLeaveListener);
      sidebar.addEventListener('mouseenter', mouseEnterListener);

      this.eventListeners.push(() => sidebar.removeEventListener('mouseleave', mouseLeaveListener));
      this.eventListeners.push(() => sidebar.removeEventListener('mouseenter', mouseEnterListener));
    }
  }

  toggleSidebar(): void {
    const sidebar = this.sidebar.nativeElement;
    const allSideDivider = sidebar.querySelectorAll('.divider');
    const allDropdown = sidebar.querySelectorAll('.side-dropdown');

    if (sidebar) {
      sidebar.classList.toggle('hide');

      if (sidebar.classList.contains('hide')) {
        allSideDivider.forEach((item: HTMLElement) => {
          item.textContent = '-';
        });

        allDropdown.forEach((item: HTMLElement) => {
          const a = item.parentElement?.querySelector('a:first-child');
          a?.classList.remove('active');
          item.classList.remove('show');
        });
      } else {
        allSideDivider.forEach((item: HTMLElement) => {
          //if (item.dataset.text) {
            //item.textContent = item.dataset.text;
          //}
        });
      }
    }
  }
}
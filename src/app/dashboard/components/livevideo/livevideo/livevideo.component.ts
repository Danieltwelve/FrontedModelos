import { Component } from '@angular/core';

@Component({
  selector: 'app-livevideo',
  imports: [],
  templateUrl: './livevideo.component.html',
  styleUrl: './livevideo.component.css'
})
export class LivevideoComponent {
  videoUrl: string = 'http://localhost:5000/video'; 

  openFullscreen(element: HTMLElement) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen();
    }
  }
}

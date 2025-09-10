import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface MediaItem {
  id: number;
  type: 'video' | 'image';
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
}

@Component({
  selector: 'app-examples',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './examples.component.html',
  styleUrl: './examples.component.css'
})
export class ExamplesComponent {
  modalAbierto = false;
  mediaSeleccionada: MediaItem | null = null;
  selectedCategory: 'all' | 'videos' | 'images' = 'all';

  mediaItems: MediaItem[] = [
    {
      id: 1,
      type: 'video',
      title: 'Detección de Objetos (Video)',
      description: 'Ejemplo de detección de objetos en un video de stock',
      url: 'https://www.youtube.com/embed/rMfi7GXlFV8?si=5ERVj9Ir0nuYCRvT',
      thumbnail: 'assets/thumbnails/vd1.png'
    },
    {
      id: 2,
      type: 'video',
      title: 'Contador Vehicular (Video)',
      description: 'Ubicación: Chimayoy',
      url: 'https://www.youtube.com/embed/XmmnDo_77KU',
      thumbnail: 'assets/thumbnails/counter.png'
    },
    {
      id: 3,
      type: 'image',
      title: 'Detección en Imagen',
      description: 'Vuelta Nariño',
      url: 'assets/images/example1.jpg'
    },
    {
      id: 4,
      type: 'image',
      title: 'Detección en Imagen',
      description: 'Ubicación: Altos de Daza',
      url: 'assets/images/example2.jpg'
    },
    {
      id: 5,
      type: 'image',
      title: 'Detección en Imagen',
      description: 'Ubicación: Volcan Cumbal',
      url: 'assets/images/example3.png'
    },
    {
      id: 6,
      type: 'image',
      title: 'Detección en Imagen',
      description: 'Ubicación: Laguna de la Cocha',
      url: 'assets/images/example4.png'
    },
    {
      id: 7,
      type: 'image',
      title: 'Detección en Imagen',
      description: 'Ciclopaseo Facing',
      url: 'assets/images/example5.png'
    },
    {
      id: 8,
      type: 'video',
      title: 'Detección Noche (Video)',
      description: 'Ejemplo de uso del modelo YOLOv11 en condiciones de poca luz',
      url: 'https://www.youtube.com/embed/Z-_jCn__GP8?si=82OQChgDrTIMgc-L',
      thumbnail: 'assets/thumbnails/vn.png'
    }
  ];

  constructor(public sanitizer: DomSanitizer) {}

  abrirModalMedia(item: MediaItem) {
    this.mediaSeleccionada = item;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.mediaSeleccionada = null;
  }

  filterByType(type: 'all' | 'videos' | 'images') {
    this.selectedCategory = type;
  }

  getFilteredItems() {
    if (this.selectedCategory === 'all') return this.mediaItems;
    return this.mediaItems.filter(item =>
      this.selectedCategory === 'videos' ? item.type === 'video' : item.type === 'image'
    );
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

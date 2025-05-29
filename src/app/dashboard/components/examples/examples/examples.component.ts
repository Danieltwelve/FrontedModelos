import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // Add this import
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
  imports: [CommonModule, FormsModule],  // Add FormsModule here
  templateUrl: './examples.component.html',
  styleUrl: './examples.component.css'
})
export class ExamplesComponent {
  modalAbierto = false;
  modalContenido: 'video' | 'imagen' | 'contador' | '' = '';
  videoUrl: string = '';
  videoIniciado = false;
  imagenUrl: string | ArrayBuffer | null = null;
  selectedCategory: 'all' | 'videos' | 'images' = 'all';
  mediaSeleccionada: MediaItem | null = null;
  
  mediaItems: MediaItem[] = [
    {
      id: 1,
      type: 'video',
      title: 'Detección de Objetos',
      description: 'Ejemplo de detección de objetos en video',
      url: 'assets/videos/detection.mp4',
      thumbnail: 'assets/thumbnails/detection.jpg'
    },
    {
      id: 2,
      type: 'video',
      title: 'Contador Vehicular',
      description: 'Ejemplo de conteo de vehículos',
      url: 'https://www.youtube.com/embed/XmmnDo_77KU', // Cambia aquí
      thumbnail: 'assets/thumbnails/counter.jpg'
    },
    {
      id: 3,
      type: 'image',
      title: 'Detección en Imagen',
      description: 'Ejemplo de detección en imagen estática',
      url: 'assets/images/detection1.jpg'
    }
    
  ];

  constructor(private http: HttpClient, public sanitizer: DomSanitizer) {}

  enviarVideoUrl() {
    const body = { url: this.videoUrl };
    this.http.post('http://localhost:5001/videourl', body).subscribe({
      next: () => {
        this.videoIniciado = true;
      },
      error: (err) => {
        alert('Error al enviar la URL del video');
        console.error(err);
      }
    });
  }

  abrirModal(tipo: 'video' | 'imagen' | 'contador') {
    this.modalAbierto = true;
    this.modalContenido = tipo;
    this.videoUrl = '';
    this.videoIniciado = false;
    this.imagenUrl = null;
  }

  abrirModalMedia(item: MediaItem) {
    this.mediaSeleccionada = item;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.mediaSeleccionada = null;
    this.modalContenido = '';
    this.videoUrl = '';
    this.imagenUrl = null;
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenUrl = reader.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  cancelarVideoUrl() {
    this.http.post('http://localhost:5002/stop', {}, { responseType: 'text' }).subscribe({
      next: () => {
        this.videoIniciado = false;
        this.videoUrl = '';
      },
      error: (err) => {
        alert('Error al detener el video');
        console.error(err);
        this.videoIniciado = false;
        this.videoUrl = '';
      }
    });
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

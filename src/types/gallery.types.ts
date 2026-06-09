export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category: 'platos' | 'ambiente' | 'cocina' | 'equipo';
  speed?: number;
}

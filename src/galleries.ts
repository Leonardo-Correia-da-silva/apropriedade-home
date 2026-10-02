import allGalleries from 'virtual:galleries';

// Todas as fotos de public/categorias/<pasta>, em ordem numérica (1.jpg, 2.jpg, ..., 10.jpg)
export const gallery = (folder: string): string[] => allGalleries[folder] ?? [];

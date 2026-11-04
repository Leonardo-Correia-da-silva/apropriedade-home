import { gallery } from './galleries';

// Revistas da página Magazine, na ordem em que aparecem (a primeira é a mais recente).
// As páginas vêm da pasta public/magazine/<slug>, em ordem numérica (1.jpg, 2.jpg, ...);
// a primeira página é a capa. Revista sem páginas na pasta não aparece no site.
export interface Magazine {
  slug: string;
  title: string;
  titleEn: string;
  pages: string[];
}

export const magazines: Magazine[] = [
  { slug: 'casa-oasis', title: 'Casa Oásis', titleEn: 'Oasis House', pages: gallery('magazine/casa-oasis') },
  { slug: 'casa-de-campo', title: 'Casa de Campo', titleEn: 'Country House', pages: gallery('magazine/casa-de-campo') },
].filter((m) => m.pages.length > 0);

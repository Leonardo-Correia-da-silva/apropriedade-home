import React, { useEffect, useState, memo } from 'react';
import {
  ArrowLeft,
  MapPin,
  Maximize,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUp
} from 'lucide-react';

// 1. ISOLANDO OS ESTILOS COM MEMO PARA EVITAR O PULO DA FONTE
const StyleInjector = memo(() => (
  <style dangerouslySetInnerHTML={{
    __html: `
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap');
    @import url('https://fonts.cdnfonts.com/css/segoe-ui-4');

    @font-face { font-family: 'Qlassy'; src: url('/fonts/qlassy.ttf') format('truetype'); }
    @font-face { font-family: 'NeueHelvetica'; src: url('/fonts/helvetica-condensed.ttf') format('truetype'); }

    .font-qlassy { font-family: 'Qlassy', serif !important; }
    .font-helvetica { font-family: 'NeueHelvetica', sans-serif !important; }
    .font-garamond { font-family: 'EB Garamond', serif !important; }
    .font-segoe { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif !important; }

    h1, h2, h3 { font-family: 'Qlassy', serif !important; }
    .nav-label, .btn-label { font-family: 'NeueHelvetica', sans-serif !important; text-transform: uppercase; }
    
    .editorial-description {
      font-family: 'EB Garamond', serif !important;
      font-size: 1.1rem !important;
      color: #555555 !important;
      line-height: 1.65 !important;
      text-align: justify;
    }

    .animate-fadeIn {
      animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }
  `}} />
));

// Interface para as propriedades de terrenos
interface PropertyListItem {
  id: number;
  title: string;
  titleEn?: string;
  location: string;
  price: string;
  images: string[];
  gallery: string[];
  specs: {
    size: string;
  };
  description?: string;
  descriptionEn?: string;
}

const translations = {
  pt: {
    segmentTitle: "Terrenos Exclusivos",
    back: "VOLTAR",
    details: "VER DETALHES",
    value: "Valor",
    overview: "Visão Geral",
    features: "Características"
  },
  en: {
    segmentTitle: "Exclusive Plots",
    back: "BACK",
    details: "VIEW DETAILS",
    value: "Value",
    overview: "Overview",
    features: "Features"
  }
};

export default function Terrenos() {
  const cyanBase = "#00B6E3";
  const [isLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  const [selectedProperty, setSelectedProperty] = useState<PropertyListItem | null>(null);
  const [currentImgIndices, setCurrentImgIndices] = useState<{ [key: number]: number }>({});
  
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Estado para controlar a exibição do botão de voltar ao topo
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem('language') as 'pt' | 'en';
      if (savedLang) {
        setLang((prevLang) => (prevLang !== savedLang ? savedLang : prevLang));
      }
    };

    checkLang();
    setIsLoaded(true);
    window.scrollTo(0, 0);

    const langInterval = setInterval(checkLang, 300);
    window.addEventListener('storage', checkLang);
    window.addEventListener('languageChange', checkLang);

    return () => {
      clearInterval(langInterval);
      window.removeEventListener('storage', checkLang);
      window.removeEventListener('languageChange', checkLang);
    };
  }, []);

  // Monitorar o scroll da página para o botão "Voltar ao topo"
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, lightboxIndex, selectedProperty]);

  const t = translations[lang];

  // 3 TERRENOS CONFIGURADOS
  const properties: PropertyListItem[] = [
    {
      id: 1,
      title: "Condomínio Tamboré",
      titleEn: "Exclusive Plot in Gated Community",
      location: "Jaguariúna, SP",
      price: "R$ 480.000,00",
      images: [
        "/categorias/terrenos/lotetambore/5.jpg",
        "/categorias/terrenos/lotetambore/2.jpg",
        "/categorias/terrenos/lotetambore/3.jpg",
        "/categorias/terrenos/lotetambore/4.jpg",
        "/categorias/terrenos/lotetambore/1.jpg",
        "/categorias/terrenos/lotetambore/6.jpg"
        
        
      ],
      gallery: Array.from({ length: 22 }, (_, i) =>
        `/categorias/terrenos/lotetambore/${i + 1}.jpg`
      ),
      specs: { size: "510m²" },
      description: "Terreno com topografia privilegiada, localizado em um dos condomínios mais prestigiados da região. Perfeito para projetos arquitetônicos de alto padrão, oferecendo total segurança, privacidade e uma vista panorâmica incrível.",
      descriptionEn: "Plot with privileged topography, located in one of the most prestigious gated communities in the region. Perfect for high-end architectural projects, offering complete security, privacy, and an incredible panoramic view."
    },
    {
      id: 2,
      title: "Condomínio - Fazenda da Grama",
      titleEn: "Plot in Prime Area",
      location: "Itupeva, SP",
      price: "R$ 6.899.900,00",
      images: [
        "/categorias/terrenos/lotefazendadagrama/6.jpg",
        "/categorias/terrenos/lotefazendadagrama/2.jpg",
        "/categorias/terrenos/lotefazendadagrama/3.jpg",
        "/categorias/terrenos/lotefazendadagrama/4.jpg",
        "/categorias/terrenos/lotefazendadagrama/1.jpg",
        "/categorias/terrenos/lotefazendadagrama/6.jpg"
        
        
      ],
      gallery: Array.from({ length: 39 }, (_, i) =>
        `/categorias/terrenos/lotefazendadagrama/${i + 1}.jpg`
      ),
      specs: { size: "2.669m²" },
      description: "Excelente lote plano em área residencial nobre. Pronto para construir, com infraestrutura completa subterrânea, portaria 24 horas e cercado por uma área verde preservada.",
      descriptionEn: "Excellent flat plot in a prime residential area. Ready to build, featuring complete underground infrastructure, 24-hour security, and surrounded by preserved green areas."
    },
    {
      id: 3,
      title: "Condomínio - Alphaville Dom Pedro II",
      titleEn: "Panoramic Plot",
      location: "Campinas, SP",
      price: "R$ 1.460.000,00",
     images: [
        "/categorias/terrenos/lote25/6.jpg",
        "/categorias/terrenos/lote25/2.jpg",
        "/categorias/terrenos/lote25/3.jpg",
        "/categorias/terrenos/lote25/4.jpg",
        "/categorias/terrenos/lote25/1.jpg",
        "/categorias/terrenos/lote25/6.jpg"
        
        
      ],
      gallery: Array.from({ length: 21 }, (_, i) =>
        `/categorias/terrenos/lote25/${i + 1}.jpg`
      ),
      specs: { size: "537m²" },
      description: "Lote amplo com vista definitiva para as montanhas. Ideal para quem busca tranquilidade, contato direto com a natureza e exclusividade em condomínio fechado de alto padrão.",
      descriptionEn: "Spacious plot with definitive mountain views. Ideal for those seeking tranquility, direct contact with nature, and exclusivity in a high-end gated community."
    }
  ];

  const nextImage = (e: React.MouseEvent<HTMLButtonElement>, id: number, totalImages: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.blur(); 
    setCurrentImgIndices((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (e: React.MouseEvent<HTMLButtonElement>, id: number, totalImages: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.blur(); 
    setCurrentImgIndices((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const nextLightboxImage = () => {
    if (!selectedProperty) return;
    setLightboxIndex((prev) => (prev + 1) % selectedProperty.gallery.length);
  };

  const prevLightboxImage = () => {
    if (!selectedProperty) return;
    setLightboxIndex((prev) => (prev - 1 + selectedProperty.gallery.length) % selectedProperty.gallery.length);
  };

  const handleOpenDetails = (property: PropertyListItem) => {
    setSelectedProperty(property);
    window.scrollTo(0, 0);
  };

  const handleCloseDetails = () => {
    setSelectedProperty(null);
    setIsLightboxOpen(false);
    window.scrollTo(0, 0);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#00B6E3] selection:text-white antialiased relative">
      
      <StyleInjector />

      {showScrollTop && !isLightboxOpen && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 bg-white text-gray-800 w-12 h-12 rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:scale-105 transition-all duration-300 flex items-center justify-center animate-fadeIn border border-gray-100"
          aria-label="Voltar ao topo"
        >
          <ArrowUp size={20} className="stroke-[1.5]" />
        </button>
      )}

      {selectedProperty ? (
        <main className="pb-32 animate-fadeIn">

          <div className="absolute top-6 left-6 lg:top-8 lg:left-16 z-30">
            <button
              onClick={handleCloseDetails}
              className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 lg:px-5 lg:py-3 rounded-none shadow-sm hover:bg-white transition-all text-gray-800 nav-label text-[10px] tracking-widest font-bold"
            >
              <ArrowLeft size={14} /> {t.back}
            </button>
          </div>

          <div className="w-full h-[80vh] md:h-screen relative bg-gray-900">
            <img
              src={selectedProperty.images[0]}
              alt={lang === 'en' && selectedProperty.titleEn ? selectedProperty.titleEn : selectedProperty.title}
              className="w-full h-full object-cover opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
            <div className="absolute bottom-12 md:bottom-24 left-6 md:left-16 right-6 text-white max-w-4xl">
              <span className="nav-label text-[10px] md:text-[11px] tracking-[0.25em] text-white/70 block mb-2 md:mb-3">{selectedProperty.location}</span>
              <h1 className="text-3xl md:text-6xl font-qlassy uppercase tracking-tight leading-none mb-4">
                {lang === 'en' && selectedProperty.titleEn ? selectedProperty.titleEn : selectedProperty.title}
              </h1>
            </div>
          </div>

          <div className="w-full px-6 md:px-16 mt-16 md:mt-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-16 md:space-y-24">
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 font-helvetica">{t.overview}</h2>
                <div className="editorial-description">
                  {lang === 'en' && selectedProperty.descriptionEn ? selectedProperty.descriptionEn : selectedProperty.description}
                </div>
              </div>

              <div className="space-y-8 md:space-y-16">
                {selectedProperty.gallery.map((img, index) => (
                  <div
                    key={index}
                    className="w-full overflow-hidden bg-gray-50 aspect-[16/10] cursor-zoom-in group/item relative"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={img}
                      alt={`Galeria Detalhe ${index + 1}`}
                      className="w-full h-full object-cover sm:hover:scale-102 transition-transform duration-[2s] ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32 space-y-8 md:space-y-10 border-t lg:border-t-0 border-gray-100 pt-10 lg:pt-0">
                <div>
                  <span className="nav-label text-[10px] text-gray-400 block mb-1 md:mb-2">{t.value}</span>
                  <div className="font-segoe font-light text-3xl md:text-4xl text-gray-900 tracking-tight">
                    {selectedProperty.price}
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-200" />

                <div className="space-y-6">
                  <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 font-helvetica">{t.features}</h2>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 font-segoe text-sm text-gray-700">
                    <div className="flex items-center gap-4 py-2 border-b border-gray-50">
                      <Maximize size={20} className="text-gray-400 stroke-[1.5]" />
                      <div>
                        <span className="text-[10px] text-gray-400 block font-helvetica tracking-wider">
                          {lang === 'en' ? 'TOTAL AREA' : 'ÁREA TOTAL'}
                        </span>
                        <span className="font-medium">{selectedProperty.specs.size}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      ) : (
        <main className={`pt-16 pb-32 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="w-full px-8 md:px-16 mb-20 text-center">
            <h1 className="text-3xl md:text-4xl font-qlassy mb-4 md:mb-6 uppercase tracking-tighter text-gray-700">
              {t.segmentTitle}
            </h1>
            <div className="w-12 h-[1px] bg-gray-300 mx-auto mt-8"></div>
          </div>

          <section className="w-full px-8 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {properties.map((item) => {
                const imgIndex = currentImgIndices[item.id] || 0;

                return (
                  <div key={item.id} className="group cursor-pointer" onClick={() => handleOpenDetails(item)}>
                    <div className="relative overflow-hidden rounded-sm mb-6 w-full pt-[62.5%] bg-gray-50">
                      {item.images.map((imgSrc, idx) => (
                        <img
                          key={idx}
                          src={imgSrc}
                          alt={`${lang === 'en' && item.titleEn ? item.titleEn : item.title} - ${idx + 1}`}
                          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-[1.5s] ease-out sm:group-hover:scale-105 ${
                            idx === imgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                          }`}
                        />
                      ))}
                      
                      <div className="absolute inset-0 bg-black/5 sm:group-hover:bg-black/20 transition-colors z-20 pointer-events-none" />

                      {item.images.length > 1 && (
                        <>
                          <button
                            type="button"
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white text-gray-800 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-30 shadow-md"
                            onClick={(e) => prevImage(e, item.id, item.images.length)}
                          >
                            <ChevronLeft size={24} />
                          </button>

                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white text-gray-800 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-30 shadow-md"
                            onClick={(e) => nextImage(e, item.id, item.images.length)}
                          >
                            <ChevronRight size={24} />
                          </button>

                          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white font-segoe text-[11px] px-3 py-1 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-30 pointer-events-none">
                            {imgIndex + 1} / {item.images.length}
                          </div>
                        </>
                      )}

                      <div
                        className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 flex items-center gap-2 nav-label text-[10px] font-bold tracking-widest bg-white px-4 py-2 shadow-xl cursor-pointer hover:scale-105 z-30"
                        style={{ color: cyanBase }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetails(item);
                        }}
                      >
                        {t.details} <ArrowUpRight size={14} />
                      </div>
                    </div>

                    <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start mb-4 gap-4 xl:gap-0">
                      <div>
                        <h3 className="text-2xl font-qlassy uppercase tracking-tight mb-1 text-gray-700">
                          {lang === 'en' && item.titleEn ? item.titleEn : item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 font-garamond">
                          <MapPin size={16} className="text-gray-400" />
                          {item.location}
                        </div>
                      </div>
                      <div className="text-left xl:text-right">
                        <span className="nav-label text-[10px] text-gray-400 block mb-1">{t.value}</span>
                        <span className="font-segoe font-semibold text-lg text-gray-800 tracking-tight">{item.price}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2">
                        <Maximize size={18} className="text-gray-500" />
                        <span className="nav-label text-[10px] text-gray-500">{item.specs.size}</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </section>
        </main>
      )}

      {isLightboxOpen && selectedProperty && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 select-none backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2.5 z-50 transition-colors bg-white/10 hover:bg-white/20 rounded-full"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X size={24} />
          </button>

          {selectedProperty.gallery.length > 1 && (
            <button
              type="button"
              className="absolute left-4 md:left-8 text-white/70 hover:text-white p-3 z-50 transition-colors bg-white/5 hover:bg-white/10 rounded-full shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                prevLightboxImage();
              }}
            >
              <ChevronLeft size={32} />
            </button>
          )}

          <div
            className="max-w-full max-h-[85vh] flex items-center justify-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedProperty.gallery[lightboxIndex]}
              alt={`Fullscreen view ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain select-none shadow-2xl rounded-sm"
            />
          </div>

          {selectedProperty.gallery.length > 1 && (
            <button
              type="button"
              className="absolute right-4 md:right-8 text-white/70 hover:text-white p-3 z-50 transition-colors bg-white/5 hover:bg-white/10 rounded-full shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                nextLightboxImage();
              }}
            >
              <ChevronRight size={32} />
            </button>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs font-segoe tracking-widest bg-black/40 px-5 py-2 rounded-full backdrop-blur-sm">
            {lightboxIndex + 1} / {selectedProperty.gallery.length}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState, memo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ArrowLeft, 
  MapPin, 
  BedDouble,
  Bath,
  Maximize,
  Square,
  ArrowUpRight,
  Car,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  X
} from 'lucide-react';

// Interface para as propriedades da listagem
interface PropertyListItem {
  id: number;
  title: string; 
  titleEn?: string; 
  location: string;
  price: string;
  images: string[];  // Apenas as fotos do carrossel inicial
  gallery: string[]; // Todas as 170 fotos da casa
  specs: {
    beds: number;
    baths: number;
    cars: number;
    totalArea: string;
    builtArea: string;
  };
  description?: string;
  descriptionEn?: string;
  sold?: boolean;
}

// Objeto de tradução para elementos da interface (UI)
const translations = {
  pt: {
    segmentTitle: "Casas de Campo e Montanha",
    back: "VOLTAR",
    details: "VER DETALHES",
    value: "Valor",
    overview: "Visão Geral",
    features: "Características",
    sold: "VENDIDO"
  },
  en: {
    segmentTitle: "Country & Mountain Houses",
    back: "BACK",
    details: "VIEW DETAILS",
    value: "Value",
    overview: "Overview",
    features: "Features",
    sold: "SOLD"
  }
};

// Componente isolado com React.memo para evitar que a tag style recarregue a fonte a cada clique
const StyleInjector = memo(() => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap');
    @import url('https://fonts.cdnfonts.com/css/segoe-ui-4');

    @font-face { font-family: 'Qlassy'; src: url('/fonts/Qlassy.ttf') format('truetype'); }
    @font-face { font-family: 'NeueHelvetica'; src: url('/fonts/helvetica-condensed.ttf') format('truetype'); }

    .font-qlassy { font-family: 'Qlassy', serif !important; }
    .font-helvetica { font-family: 'NeueHelvetica', sans-serif !important; }
    .font-garamond { font-family: 'EB Garamond', serif !important; }
    .font-segoe { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif !important; }

    h1, h2, h3 { font-family: 'Qlassy', serif !important; }
    .nav-label, .btn-label { font-family: 'NeueHelvetica', sans-serif !important; text-transform: uppercase; }

    .icon-tooltip-wrapper { position: relative; display: inline-flex; align-items: center; justify-content: center; }
    .icon-tooltip { position: absolute; left: 50%; bottom: calc(100% + 8px); transform: translateX(-50%) translateY(4px); background: #1a1a1a; color: white; padding: 6px 9px; border-radius: 3px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 10px; line-height: 1.2; white-space: nowrap; opacity: 0; visibility: hidden; pointer-events: none; transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease; z-index: 50; box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
    .icon-tooltip-wrapper:hover .icon-tooltip { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }
    
    .editorial-description {
      font-family: 'EB Garamond', serif !important;
      font-size: 1.1rem !important;
      color: #555555 !important;
      line-height: 1.65 !important;
      text-align: justify;
    }

    .sold-ribbon-wrapper { position: absolute; top: 0; left: 0; width: 140px; height: 140px; overflow: hidden; z-index: 40; pointer-events: none; }
    .sold-ribbon { position: absolute; top: 28px; left: -38px; width: 180px; transform: rotate(-45deg); background: #1a1a1a; color: #fff; text-align: center; padding: 6px 0; font-family: 'NeueHelvetica', sans-serif; font-size: 11px; font-weight: bold; letter-spacing: 0.2em; box-shadow: 0 2px 8px rgba(0,0,0,0.25); }
    .sold-badge { position: absolute; top: 24px; right: 24px; z-index: 40; background: #1a1a1a; color: #fff; font-family: 'NeueHelvetica', sans-serif; font-size: 12px; font-weight: bold; letter-spacing: 0.2em; padding: 10px 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.25); pointer-events: none; }
    @media (min-width: 768px) { .sold-badge { top: 32px; right: 48px; } }

    .animate-fadeIn {
      animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1);
    }
  `}} />
));

StyleInjector.displayName = 'StyleInjector';

export default function CasadeCampoeMontanha() {
  const cyanBase = "#00B6E3";
  const [isLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  
  // Estado para controlar qual imóvel está selecionado (Visualização de Detalhes)
  const [selectedProperty, setSelectedProperty] = useState<PropertyListItem | null>(null);
  
  // Estado para controlar a foto atual de cada imóvel independentemente
  const [currentImgIndices, setCurrentImgIndices] = useState<Record<number, number>>({});

  // Estado para controlar a visibilidade do botão "Voltar ao topo"
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ESTADOS DO MODAL FULLSCREEN (LIGHTBOX)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    // Função para verificar e atualizar o idioma dinamicamente
    const checkLang = () => {
      const savedLang = localStorage.getItem('language') as 'pt' | 'en';
      if (savedLang) {
        setLang((prevLang) => (prevLang !== savedLang ? savedLang : prevLang));
      }
    };

    // 1. Carga inicial
    checkLang();
    setIsLoaded(true);
    window.scrollTo(0, 0);

    // 2. Observador contínuo
    const langInterval = setInterval(checkLang, 300);

    // 3. Listeners de eventos de backup
    window.addEventListener('storage', checkLang);
    window.addEventListener('languageChange', checkLang);

    return () => {
      clearInterval(langInterval);
      window.removeEventListener('storage', checkLang);
      window.removeEventListener('languageChange', checkLang);
    };
  }, []);

  // EFFECT: Monitorar o scroll da página
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

  // Atalhos de teclado para o Lightbox (Esc, Esquerda, Direita)
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

  // Função auxiliar interna para gerar dinamicamente o array de 3 a 170
  const generateFullGallery = (folder = "nazare-paulista"): string[] => {
    const paths: string[] = [];
    for (let i = 3; i <= 39; i++) {
      paths.push(`/categorias/casas_montanha/${folder}/${i}.jpg`);
    }
    return paths;
  };

  const properties: PropertyListItem[] = [
    {
      id: 1,
      title: "Refúgio na Montanha",
      titleEn: "Mountain Refuge",
      location: "Nazaré Paulista, SP",
      price: "R$ 2.950.000,00",
      sold: true,
      images: [
        "/categorias/casas_montanha/nazare-paulista/5.jpg",
        "/categorias/casas_montanha/nazare-paulista/14.jpg",
        "/categorias/casas_montanha/nazare-paulista/16.jpg",
        "/categorias/casas_montanha/nazare-paulista/30.jpg",
        "/categorias/casas_montanha/nazare-paulista/27.jpg",
        "/categorias/casas_montanha/nazare-paulista/35.jpg",
      ],
      gallery: Array.from({ length: 39 }, (_, i) =>
        `/categorias/casas_montanha/nazare-paulista/${i + 1}.jpg`
      ),
      specs: { beds: 6, baths: 6, cars: 4, totalArea: "55.000m²", builtArea: "450m²" },
     description: "O sítio, com cerca de 55 mil m², fica localizado no alto de uma montanha isolada, que proporciona um estilo de vida que traz muita qualidade de vida, desapego da agitação da cidade e um encontro com a natureza abundante em árvores floridas, paisagens de tirar o fôlego e muita privacidade.\n\nA vista do solarium da piscina contempla algumas cidades a dezenas de quilômetros de distância. Dali, é possível observar parte do mundo em silêncio, no aconchego de uma casa de campo que reúne características de uma mini fazenda. Pomar com centenas de árvores, lago, casa de caseiro habitada, galinheiro, horta, estufa, espaço gourmet externo, sauna e piscina com raia. A casa principal é a alma da propriedade: com arquitetura brasileira, rica em iluminação e ventilação naturais, é o verdadeiro símbolo de casa de montanha. Lareira central para noites frias, pé-direito duplo com forro de madeira no teto, diversos ambientes integrados, cozinha com balcão americano, despensa, sala de almoço, sala de jantar com fogão à lenha e paredes de vidro com vistas do jardim e do horizonte infinito.\n\nNo andar superior, há um escritório independente e a suíte principal, que conta com closet, banheiro e varanda com vistas incomparáveis. Ao todo, são quatro suítes, sendo três no piso térreo. É a propriedade ideal para quem quer sair do ritmo acelerado da cidade e da vida moderna, para um refúgio seguro, longe do ruído da cidade grande e perto da sinfonia da mãe natureza.",

descriptionEn: "The estate, spanning approximately 55,000 m², is located atop an isolated mountain, offering a lifestyle centered on well-being, distance from the hustle and bustle of the city, and a deep connection with nature, surrounded by flowering trees, breathtaking landscapes, and complete privacy.\n\nThe pool solarium offers panoramic views of several cities dozens of kilometers away. From there, one can quietly observe the world while enjoying the comfort of a country house that combines the charm and features of a private mini farm. The property includes an orchard with hundreds of trees, a lake, an occupied caretaker's house, chicken coop, vegetable garden, greenhouse, outdoor gourmet area, sauna, and a swimming pool with a dedicated lap lane. The main house is the soul of the property. Featuring Brazilian architecture, abundant natural light and ventilation, it is a true expression of a mountain home. A central fireplace provides warmth on cold nights, while the double-height ceiling with a wooden finish, integrated living spaces, American-style kitchen counter, pantry, breakfast room, dining room with a wood-burning stove, and floor-to-ceiling glass walls create a seamless connection with the garden and the endless horizon.\n\n Upstairs, there is an independent home office and the master suite, complete with a walk-in closet, bathroom, and balcony offering unparalleled views. In total, the property features four suites, three of them located on the ground floor. It is the ideal property for those seeking to escape the fast-paced rhythm of the city and modern life, offering a safe and peaceful retreat away from the noise of the big city and close to the symphony of nature."
    },
    {
      id: 2,
      title: "Sítio com Casa de Campo",
      titleEn: "Country Estate",
      location: "Pilar do Sul, SP",
      price: "R$ 15.000.000,00",
      images: [
        "/categorias/casas_montanha/PilarDoSul/28.jpg",
        "/categorias/casas_montanha/PilarDoSul/37.jpg",
        "/categorias/casas_montanha/PilarDoSul/10.jpg",
        "/categorias/casas_montanha/PilarDoSul/25.jpg",
        "/categorias/casas_montanha/PilarDoSul/32.jpg",
        "/categorias/casas_montanha/PilarDoSul/35.jpg",
      ],
      gallery: Array.from({ length: 37 }, (_, i) =>
        `/categorias/casas_montanha/PilarDoSul/${i + 1}.jpg`
      ),
      specs: {
        beds: 10,
        baths: 11,
        cars: 6,
        totalArea: "278.000m²",
        builtArea: "4.000m²"
      },
      description: "Sítio com Casa de Campo com aproximadamente 11,5 alqueires, localizada no município de Pilar do Sul. Já emoldurou a capa de uma revista de arquitetura, a propriedade conta com uma gama de opções para quem busca um refúgio longe do estresse das cidades, usufruindo de uma infraestrutura completa de espaços para recreação, lazer e produção.\n\nA casa sede é a verdadeira atração principal, com sua arquitetura exuberante, rica em madeiras tratadas, vidros e integração dos ambientes. Ventilação e iluminação naturais abundam os ambientes através de seu pé-direito alto. A sede é térrea e conta com cinco suítes, ampla sala de estar com vários ambientes, cozinha completa gourmet com fogão a lenha, forno de pizza do renomado artesão Oficina Victorello, integração com varanda gourmet com churrasqueira, chopeira e ao quintal com piscinas adulto e infantil e solarium.\n\nA propriedade também possui casa de hóspedes com três suítes, cozinha, sala de estar, espaço gourmet e infraestrutura completa para seus convidados. Casa de hidromassagem, sauna, salão de jogos, capela, casa de caseiro com infraestrutura para os colaboradores. O lago imenso com deck acessível por uma passarela é um verdadeiro escape do estress do dia-a-dia: com muitos peixes, é possível passar horas ali sem perceber o tempo passar. O quiosque sobre o lago tem cozinha pronta para refeições contemplando a vista da água.\n\nAlém dos espaços sociais e de lazer, o imóvel possui vários galpões grandes para animais, poço artesiano, canil, pomar, piquete de cavalos, viveiros e muitos animais de várias espécies.",
      descriptionEn: "Country estate of approximately 11.5 alqueires, located in the municipality of Pilar do Sul. Having already graced the cover of an architecture magazine, the property offers a wide range of options for those seeking a retreat far from the stress of the city, with complete infrastructure for recreation, leisure, and production.\n\nThe main house is the true highlight, with its exuberant architecture rich in treated wood, glass, and integrated spaces. Natural light and ventilation fill every room through its high ceilings. The single-story main house features five suites, a spacious living room with several areas, a complete gourmet kitchen with a wood-burning stove, a pizza oven by the renowned artisan Oficina Victorello, and seamless integration with the gourmet veranda, featuring a barbecue grill and draft beer tap, and with the backyard, which has adult and children's pools and a solarium.\n\nThe property also includes a guest house with three suites, kitchen, living room, gourmet area, and complete infrastructure for guests. There is also a hydromassage house, sauna, game room, chapel, and a caretaker's house with facilities for staff. The immense lake, with a deck reached by a walkway, is a true escape from everyday stress: full of fish, it is a place where you can spend hours without noticing time go by. The kiosk over the lake has a kitchen ready for meals while contemplating the view of the water.\n\nIn addition to the social and leisure spaces, the property has several large animal barns, an artesian well, kennel, orchard, horse paddock, nurseries, and many animals of various species."
    }
  ];

  // Funções de navegação do carrossel na listagem
  const nextImage = (e: React.MouseEvent, id: number, totalImages: number) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    e.currentTarget.blur(); 
    setCurrentImgIndices((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (e: React.MouseEvent, id: number, totalImages: number) => {
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
    window.scrollTo(0, 0);
  };

  const routerLocation = useLocation();
  useEffect(() => {
    const openId = (routerLocation.state as { openId?: number } | null)?.openId;
    if (openId) {
      const match = properties.find((p) => p.id === openId);
      if (match) handleOpenDetails(match);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerLocation.state]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#00B6E3] selection:text-white antialiased relative">
      {/* Estilos injetados de forma estática via React.memo para evitar recarregamento de fonte e pulos */}
      <StyleInjector />

      {/* 1. VISUALIZAÇÃO DE DETALHES */}
      {selectedProperty ? (
        <main className="pb-32 animate-fadeIn">
          {/* Botão de Voltar Minimalista */}
          <div className="absolute top-6 left-6 lg:top-8 lg:left-16 z-30">
            <button 
              type="button"
              onClick={handleCloseDetails}
              className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 lg:px-5 lg:py-3 rounded-none shadow-sm hover:bg-white transition-all text-gray-800 nav-label text-[10px] tracking-widest font-bold"
            >
              <ArrowLeft size={14} /> {t.back}
            </button>
          </div>

          {/* Imagem de Capa em Tela Cheia */}
          <div className="w-full h-[80vh] md:h-screen relative bg-gray-900">
            {selectedProperty.sold && (
              <div className="sold-badge">{t.sold}</div>
            )}
            <img
              src={selectedProperty.images[0]} 
              alt={lang === 'en' && selectedProperty.titleEn ? selectedProperty.titleEn : selectedProperty.title} 
              className="w-full h-full object-cover opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
            <div className="absolute bottom-12 md:bottom-24 left-6 md:left-16 right-6 text-white max-w-4xl">
              <span className="nav-label text-[11px] tracking-[0.25em] text-white/70 block mb-2 md:mb-3">{selectedProperty.location}</span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-qlassy uppercase tracking-tight leading-none mb-4">
                {lang === 'en' && selectedProperty.titleEn ? selectedProperty.titleEn : selectedProperty.title}
              </h1>
            </div>
          </div>

          {/* Grid de Conteúdo Principal */}
          <div className="w-full px-6 md:px-16 mt-16 md:mt-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            <div className="contents lg:block lg:col-span-7 lg:space-y-24">
              <div className="order-1 lg:order-none space-y-4 md:space-y-6">
                <h2 className="text-base tracking-[0.2em] uppercase text-black font-[HeadingNow,sans-serif]!">{t.overview}</h2>
                <div className="editorial-description space-y-4">
                  {(lang === 'en' && selectedProperty.descriptionEn ? selectedProperty.descriptionEn : selectedProperty.description)
                    ?.split('\n\n')
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                </div>
              </div>

              <div className="order-3 lg:order-none space-y-8 md:space-y-16">
                {selectedProperty.gallery.map((img, index) => {
                  return (
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
                  );
                })}
              </div>
            </div>

            <div className="order-2 lg:order-none lg:col-span-5">
              <div className="lg:sticky lg:top-32 space-y-8 md:space-y-10 border-t lg:border-t-0 border-gray-100 pt-10 lg:pt-0 text-center lg:text-left">
                <div>
                  <span className="text-sm uppercase text-black block mb-1 md:mb-2 font-[HeadingNow,sans-serif]!">{t.value}</span>
                  <div className="font-segoe font-light text-4xl text-gray-900 tracking-tight">
                    {selectedProperty.price}
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-200" />

                <div className="space-y-6">
                  <h2 className="text-base tracking-[0.2em] uppercase text-black font-[HeadingNow,sans-serif]!">{t.features}</h2>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 font-segoe text-sm text-gray-700">
                    <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 py-2 border-b border-gray-50 text-center lg:text-left">
                      <span className="icon-tooltip-wrapper">
                        <BedDouble size={20} className="text-gray-400 stroke-[1.5]" />
                        <span className="icon-tooltip">{lang === 'en' ? 'Bedrooms' : 'Quartos'}</span>
                      </span>
                      <div>
                        <span className="text-sm text-black block font-[HeadingNow,sans-serif]! tracking-wider">
                          {lang === 'en' ? 'BEDROOMS' : 'QUARTOS'}
                        </span>
                        <span className="font-medium">
                          {selectedProperty.specs.beds} 
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 py-2 border-b border-gray-50 text-center lg:text-left">
                      <span className="icon-tooltip-wrapper">
                        <Bath size={20} className="text-gray-400 stroke-[1.5]" />
                        <span className="icon-tooltip">{lang === 'en' ? 'Bathrooms' : 'Banheiros'}</span>
                      </span>
                      <div>
                        <span className="text-sm text-black block font-[HeadingNow,sans-serif]! tracking-wider">
                          {lang === 'en' ? 'BATHROOMS' : 'BANHEIROS'}
                        </span>
                        <span className="font-medium">{selectedProperty.specs.baths}</span>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 py-2 border-b border-gray-50 text-center lg:text-left">
                      <span className="icon-tooltip-wrapper">
                        <Car size={20} className="text-gray-400 stroke-[1.5]" />
                        <span className="icon-tooltip">{lang === 'en' ? 'Parking spaces' : 'Vagas de garagem'}</span>
                      </span>
                      <div>
                        <span className="text-sm text-black block font-[HeadingNow,sans-serif]! tracking-wider">
                          {lang === 'en' ? 'PARKING' : 'VAGAS'}
                        </span>
                        <span className="font-medium">{selectedProperty.specs.cars}</span>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 py-2 border-b border-gray-50 text-center lg:text-left">
                      <span className="icon-tooltip-wrapper">
                        <Maximize size={20} className="text-gray-400 stroke-[1.5]" />
                        <span className="icon-tooltip">{lang === 'en' ? 'Built area' : 'Área construída'}</span>
                      </span>
                      <div>
                        <span className="text-sm text-black block font-[HeadingNow,sans-serif]! tracking-wider">
                          {lang === 'en' ? 'BUILT AREA' : 'ÁREA CONSTRUÍDA'}
                        </span>
                        <span className="font-medium">{selectedProperty.specs.builtArea}</span>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 py-2 border-b border-gray-50 text-center lg:text-left">
                      <span className="icon-tooltip-wrapper">
                        <Square size={20} className="text-gray-400 stroke-[1.5]" />
                        <span className="icon-tooltip">{lang === 'en' ? 'Total land area' : 'Área total do terreno'}</span>
                      </span>
                      <div>
                        <span className="text-sm text-black block font-[HeadingNow,sans-serif]! tracking-wider">
                          {lang === 'en' ? 'TOTAL AREA' : 'ÁREA TOTAL'}
                        </span>
                        <span className="font-medium">{selectedProperty.specs.totalArea}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      ) : (
        /* 2. VISUALIZAÇÃO DA LISTAGEM ORIGINAL */
        <main className={`pt-16 pb-32 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          <div className="w-full px-8 md:px-16 mb-20 text-center">
            <h1 className="text-4xl font-qlassy mb-4 md:mb-6 uppercase tracking-tighter text-gray-700">
              {t.segmentTitle}
            </h1>
            <div className="w-12 h-[1px] bg-gray-300 mx-auto mt-6 md:mt-8"></div>
          </div>

          <section className="w-full px-8 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {properties.map((item) => {
                const currentImgIdx = currentImgIndices[item.id] || 0;

                return (
                  <div key={item.id} className="group cursor-pointer" onClick={() => handleOpenDetails(item)}>
                    
                    <div className="relative overflow-hidden rounded-sm mb-6 w-full pt-[62.5%] bg-gray-50">
                      {item.sold && (
                        <div className="sold-ribbon-wrapper">
                          <div className="sold-ribbon">{t.sold}</div>
                        </div>
                      )}
                      {item.images.map((imgSrc, idx) => (
                        <img 
                          key={idx}
                          src={imgSrc} 
                          alt={`${lang === 'en' && item.titleEn ? item.titleEn : item.title} - ${idx + 1}`}
                          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-[1.5s] ease-out sm:group-hover:scale-105 ${
                            currentImgIdx === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
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
                            {currentImgIdx + 1} / {item.images.length}
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
                        <span className="icon-tooltip-wrapper">
                          <BedDouble size={18} className="text-gray-500" />
                          <span className="icon-tooltip">{lang === 'en' ? 'Bedrooms' : 'Quartos'}</span>
                        </span>
                        <span className="nav-label text-[10px] text-gray-500">{item.specs.beds}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="icon-tooltip-wrapper">
                          <Bath size={18} className="text-gray-500" />
                          <span className="icon-tooltip">{lang === 'en' ? 'Bathrooms' : 'Banheiros'}</span>
                        </span>
                        <span className="nav-label text-[10px] text-gray-500">{item.specs.baths}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="icon-tooltip-wrapper">
                          <Car size={18} className="text-gray-500" />
                          <span className="icon-tooltip">{lang === 'en' ? 'Parking spaces' : 'Vagas de garagem'}</span>
                        </span>
                        <span className="nav-label text-[10px] text-gray-500">{item.specs.cars}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="icon-tooltip-wrapper">
                          <Maximize size={18} className="text-gray-500" />
                          <span className="icon-tooltip">{lang === 'en' ? 'Built area' : 'Área construída'}</span>
                        </span>
                        <span className="nav-label text-[10px] text-gray-500">{item.specs.builtArea}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="icon-tooltip-wrapper">
                          <Square size={20} className="text-gray-400 stroke-[1.5]" />
                          <span className="icon-tooltip">{lang === 'en' ? 'Total land area' : 'Área total do terreno'}</span>
                        </span>
                        <span className="nav-label text-[10px] text-gray-500">{item.specs.totalArea}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      )}

      {/* BOTÃO VOLTAR AO TOPO (Estilo quadrado com sombra suave igual à referência) */}
      {showScrollTop && !isLightboxOpen && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 bg-white text-gray-800 w-12 h-12 rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:scale-105 transition-all duration-300 flex items-center justify-center animate-fadeIn border border-gray-100"
          aria-label={lang === 'en' ? 'Back to top' : 'Voltar ao topo'}
        >
          <ArrowUp size={20} className="stroke-[1.5]" />
        </button>
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
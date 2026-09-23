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
  X,
  ArrowUp
} from 'lucide-react';

// 1. ISOLANDO OS ESTILOS COM MEMO PARA EVITAR O PULO DA FONTE
const StyleInjector = memo(() => (
  <style dangerouslySetInnerHTML={{
    __html: `
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

    .animate-fadeIn {
      animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }
  `}} />
));

// Interface para as propriedades da listagem
interface PropertyListItem {
  id: number;
  title: string;
  titleEn?: string;
  location: string;
  price: string;
  images: string[];
  gallery: string[];
  specs: {
    beds: number;
    baths: number;
    cars: number;
    builtArea: string;
    totalArea: string;
  };
  description?: string;
  descriptionEn?: string;
}

const translations = {
  pt: {
    segmentTitle: "Casas Urbanas",
    back: "VOLTAR",
    details: "VER DETALHES",
    value: "Valor",
    overview: "Visão Geral",
    features: "Características"
  },
  en: {
    segmentTitle: "Urban Houses",
    back: "BACK",
    details: "VIEW DETAILS",
    value: "Value",
    overview: "Overview",
    features: "Features"
  }
};

export default function Urbanas() {
  const cyanBase = "#00B6E3";
  const [isLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  const [selectedProperty, setSelectedProperty] = useState<PropertyListItem | null>(null);
  const [currentImgIndices, setCurrentImgIndices] = useState<{ [key: number]: number }>({});
  
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // ESTADO: Controle da exibição do botão de voltar ao topo
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

  const properties: PropertyListItem[] = [
    {
      id: 1,
      title: "Mansão no condomínio, Alphaville Campinas",
      titleEn: "Mansion in the Condominium, Alphaville Campinas",
      location: "Campinas, SP",
      price: "R$ 22.900.000",
      images: [
        "/categorias/casas_urbanas/neoclassica-alphavile/capa1.jpg",
        "/categorias/casas_urbanas/neoclassica-alphavile/capa2.jpg",
        "/categorias/casas_urbanas/neoclassica-alphavile/capa3.jpg",
        "/categorias/casas_urbanas/neoclassica-alphavile/capa4.jpg",
        "/categorias/casas_urbanas/neoclassica-alphavile/capa5.jpg",
        "/categorias/casas_urbanas/neoclassica-alphavile/capa6.jpg"
      ],
      gallery: Array.from({ length: 56 }, (_, i) =>
        `/categorias/casas_urbanas/neoclassica-alphavile/fotos-mansao-neoclassica/${i + 1}.jpg`
      ),
      specs: { beds: 5, baths: 7, cars: 6, builtArea: "1.280m²", totalArea: "3.840m²" },
      description: "Mansão com arquitetura neoclássica disponível para venda no renomado condomínio clube Alphaville Campinas. Térrea, é destaque no residencial pela sua imponência, que impõe presença marcante e desperta admiração.\n\nIntegração dos ambientes, salas de estar para sete ambientes, cozinha com ilha central, espaço gourmet independente e conectado ao quintal. Piscina com hidromassagem e tratamento de ozônio, ideal para aquele relaxamento após um dia longo de trabalho. Academia e sala para massagem ou beauty care, home TV independente com sistema de som profissional, escritório amplo com total privacidade. Luz e ventilação naturais abundam em todos os ambientes, que possuem pé-direito alto. A área íntima contempla quatro amplas suítes, e os pisos receberam aquecimento controlado eletronicamente. A suíte principal conta com dois closets e banheiros separados, e se encontram em uma bela banheira de imersão - um spa dentro da suíte.\n\nDependência de empregada, despensa grande, quintal gramado espaçoso para recreação, praça externa italiana com fonte e paisagismo que acolhe.\n\nO terreno é bem amplo, um dos maiores do condomínio, e conta no fundo dele com um bosque privativo, onde não é permitido construção, mas sim contemplação. Lá de cima, é possível avistar os prédios da cidade, e assistir a uma bela paisagem.\n\nO condomínio Alphaville Campinas oferece uma gama completa de lazer, contando com quadras de tênis, futebol, academia ampla, salão de festas, playground, piscinas adulto e infantil, pista de caminhada e lagos. A segurança opera com portaria 24 horas, monitoramento por câmeras e ronda, além de total controle de acesso de moradores, visitantes e prestadores de serviços. Super bem localizado, fica às margens da rodovia SP-340 (Mogi-Campinas), e se conecta rapidamente aos principais shoppings da cidade e à rodovia Dom Pedro. Além disso, o residencial está ao lado do Alphaville Comercial, que oferece diversos serviços diariamente, como farmácia, banco, padaria, mercados, posto de combustível, salão de beleza e muito mais!"
    },
    {
      id: 2,
      title: "Casa no condomínio, Fazenda Duas Marias Jaguariúna",
      titleEn: "House in the Condominium, Fazenda Duas Marias Jaguariúna",
      location: "Jaguariúna, SP",
      price: "R$ 17.990.000,00",
      images: [
        "/categorias/casas_urbanas/duasMarias/45.jpg",
        "/categorias/casas_urbanas/duasMarias/37.jpg",
        "/categorias/casas_urbanas/duasMarias/39.jpg",
        "/categorias/casas_urbanas/duasMarias/27.jpg",
        "/categorias/casas_urbanas/duasMarias/52.jpg",
        "/categorias/casas_urbanas/duasMarias/56.jpg",
      ],
      gallery: Array.from({ length: 56 }, (_, i) =>
        `/categorias/casas_urbanas/duasMarias/${i + 1}.jpg`
      ),
      specs: { beds: 6, baths: 10, cars: 8, builtArea: "850m²", totalArea: "10.004m²" },
      description: "Casa localizada no condomínio fechado Fazenda Duas Marias, na cidade de Jaguariúna, interior de São Paulo, a aproximadamente 01h40 da capital. Conta com segurança profissional 24 horas, ronda e controle de acesso.\n\nDistribuída em blocos, oferece casa principal com seis dormitórios, sendo um de serviço, amplo living com pé-direito alto, cozinha com fogão assinado pela renomada Oficina Victorello, sala de TV independente, escritório, despensa, lavanderia, varanda social, piscina aquecida com iluminação, Spa e prainha, rodeada pelo solarium para um belo banho de sol. As suítes da casa principal e a sala de estar contam com piso aquecido eletronicamente, além de oferecer sistema de aspiração central. Casa automatizada com sistema Alexa.\n\nDuas garagens, sendo uma delas climatizada com mini-oficina para vários veículos, fogo de chão (firepit), rooftop em deck de madeira com vista panorâmica, lago ornamental cristalino para mergulho com peixes e tratamento de ozônio, salão de jogos climatizado, equipado e decorado, campo de futebol com grama especial e sistema de drenagem, vestiário com armários, banheiro e chuveiros, academia e sauna. Sistema de geração de energia fotovoltaica, irrigação, captação de água por cisterna e poço artesiano.\n\nO salão de festas gourmet, que fica no centro do terreno, tem mais de 130 m² de área, climatizado, lavabo, churrasqueiras a gás e carvão, sistema de som ambiente, bar, integração total com o quintal e paisagismo. Ideal para suas festas em família e amigos, isolada da casa principal, sem abrir mão da sua privacidade. O paisagismo assinado por Marcelo Novaes, conta com diversas espécies de plantas e árvores maduras adultas, como o pau-brasil que fica no jardim principal de boas-vindas. A parte mais densa do jardim guia, através de uma mini-trilha, aos redários acolhidos sob as imensas árvores adultas. No topo do terreno, horta, espaço zen, casa de árvore de madeira especial e o acesso social."
    },
    {
      id: 5,
      title: "Casa no Condomínio Monte Sankhya",
      titleEn: "House in the Monte Sankhya Condominium",
      location: "Serra Negra, SP",
      price: "R$ 3.600.000,00",
      images: [
        "/categorias/casas_urbanas/serranegra/4.jpg",
        "/categorias/casas_urbanas/serranegra/2.jpg",
        "/categorias/casas_urbanas/serranegra/28.jpg",
        "/categorias/casas_urbanas/serranegra/22.jpg",
        "/categorias/casas_urbanas/serranegra/9.jpg",
        "/categorias/casas_urbanas/serranegra/31.jpg",
      ],
      gallery: Array.from({ length: 36 }, (_, i) =>
        `/categorias/casas_urbanas/serranegra/${i + 1}.jpg`
      ),
      specs: { beds: 4, baths: 5, cars: 4, builtArea: "400m²", totalArea: "2.600m²" },
      description: "Com quatro suítes confortáveis com armários, sendo a principal com closet grande, esta casa de montanha dentro de condomínio fechado possui ampla varanda que integra duas das suítes, com vista para as montanhas. A sala de estar com vários ambientes possui sala de lareira, estar e TV.\n\nA cozinha foi alocada em um espaço externo ao da casa principal, mas facilmente acessada. Foi onde os proprietários destinaram para receber familiares e amigos, aproveitando o prestígio das belas paisagens e vistas de tirar o fôlego de qualquer canto do ambiente. Fogão à lenha, churrasqueira, ilha central grande, sala de TV integrada para apoio aos eventos, sala de jogos, lavabo e sala de jantar. Com teto revestido de madeira e iluminação projetada, é o ponto mais utilizado da casa.\n\nO quintal é muito espaçoso e com vários níveis de topografia, devido a tipologia do terreno. Jardins e plantas compõem o quintal, que o convida para o descanso e apreciação da natureza. No nível mais baixo utilizado do terreno, há a área de lazer externa, com ampla piscina, solarium e pergolado.\n\nO condomínio oferece portaria com controle de acesso, sistema de câmeras, área de lazer com quadra, campo de futebol, salão de festas, jogos, biblioteca, mirante."
    },
    {
      id: 6,
      title: "Parque Portugal, Taquaral",
      titleEn: "Parque Portugal, Taquaral",
      location: "Campinas, SP",
      price: "R$ 2.500.000",
      images: [
        "/categorias/casas_urbanas/parqueportugal/52.jpg",
        "/categorias/casas_urbanas/parqueportugal/6.jpg",
        "/categorias/casas_urbanas/parqueportugal/11.jpg",
        "/categorias/casas_urbanas/parqueportugal/21.jpg",
        "/categorias/casas_urbanas/parqueportugal/24.jpg",
        "/categorias/casas_urbanas/parqueportugal/59.jpg",
      ],
      gallery: Array.from({ length: 59 }, (_, i) =>
        `/categorias/casas_urbanas/parqueportugal/${i + 1}.jpg`
      ),
      specs: { beds: 4, baths: 6, cars: 4, builtArea: "", totalArea: "350m²" },
      description: "Uma residência charmosa no cobiçado Condomínio Residências Parque Portugal, a poucos minutos da Lagoa do Taquaral. O imóvel se destaca pelos seus ambientes sociais fluídos, piso em madeira, excelente iluminação natural, 4 dormitórios (2 suítes) e 4 vagas, oferecendo máxima privacidade e segurança em um dos endereços mais desejados de Campinas.",
      descriptionEn: "A charming residence in the highly sought-after Residências Parque Portugal Condominium, just minutes from the Taquaral Lagoon. The property stands out for its fluid social spaces, hardwood flooring, abundant natural light, 4 bedrooms (2 suites), and 4 parking spaces, offering ultimate privacy and security in one of Campinas' most desirable locations."
    },
    {
      id: 7,
      title: "Villaggio Via Condotti, Gramado (VENDIDO)",
      titleEn: "Villaggio Via Condotti, Gramado (SOLD)",
      location: "Campinas, SP",
      price: "R$ 3.500.000",
      images: [
        "/categorias/casas_urbanas/villaggio/83.jpg",
        "/categorias/casas_urbanas/villaggio/70.jpg",
        "/categorias/casas_urbanas/villaggio/47.jpg",
        "/categorias/casas_urbanas/villaggio/5.jpg",
        "/categorias/casas_urbanas/villaggio/26.jpg",
        "/categorias/casas_urbanas/villaggio/25.jpg",
      ],
      gallery: Array.from({ length: 84 }, (_, i) =>
        `/categorias/casas_urbanas/villaggio/${i + 1}.jpg`
      ),
      specs: { beds: 5, baths: 7, cars: 6, builtArea: "", totalArea: "691m²" },
      description: "[Imóvel Vendido] Imponente casa no Condomínio Villaggio Via Condotti, no tradicional bairro Gramado em Campinas. Com distribuição fluida, 4 suítes confortáveis, riqueza em armários sob medida e um convidativo deck com piscina para os dias de sol, a propriedade oferece uma experiência de morar única, cercada por tranquilidade e segurança.",
      descriptionEn: "[Sold Property] An impressive home in the Villaggio Via Condotti Condominium, in Campinas' traditional Gramado neighborhood. Featuring a fluid layout, 4 comfortable suites, abundant custom storage, and an inviting pool deck for sunny days, this property offered a unique living experience surrounded by peace and security."
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

  const routerLocation = useLocation();
  useEffect(() => {
    const openId = (routerLocation.state as { openId?: number } | null)?.openId;
    if (openId) {
      const match = properties.find((p) => p.id === openId);
      if (match) handleOpenDetails(match);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerLocation.state]);

  // FUNÇÃO: Rola a página para o topo de forma suave
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#00B6E3] selection:text-white antialiased relative">
      
      <StyleInjector />

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
              <span className="nav-label text-[11px] tracking-[0.25em] text-white/70 block mb-2 md:mb-3">{selectedProperty.location}</span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-qlassy uppercase tracking-tight leading-none mb-4">
                {lang === 'en' && selectedProperty.titleEn ? selectedProperty.titleEn : selectedProperty.title}
              </h1>
            </div>
          </div>

          <div className="w-full px-6 md:px-16 mt-16 md:mt-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-16 md:space-y-24">
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-xs tracking-[0.2em] uppercase text-gray-400 font-qlassy">{t.overview}</h2>
                <div className="editorial-description space-y-4">
                  {(lang === 'en' && selectedProperty.descriptionEn ? selectedProperty.descriptionEn : selectedProperty.description)
                    ?.split('\n\n')
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
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
                  <div className="font-segoe font-light text-4xl text-gray-900 tracking-tight">
                    {selectedProperty.price}
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-200" />

                <div className="space-y-6">
                  <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 font-helvetica">{t.features}</h2>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 font-segoe text-sm text-gray-700">
                    <div className="flex items-center gap-4 py-2 border-b border-gray-50">
                      <span className="icon-tooltip-wrapper">
                        <BedDouble size={20} className="text-gray-400 stroke-[1.5]" />
                        <span className="icon-tooltip">{lang === 'en' ? 'Bedrooms' : 'Quartos'}</span>
                      </span>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-helvetica tracking-wider">
                          {lang === 'en' ? 'BEDROOMS' : 'QUARTOS'}
                        </span>
                        <span className="font-medium">
                          {selectedProperty.specs.beds} {lang === 'en' ? 'Suites' : 'Suítes'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 py-2 border-b border-gray-50">
                      <span className="icon-tooltip-wrapper">
                        <Bath size={20} className="text-gray-400 stroke-[1.5]" />
                        <span className="icon-tooltip">{lang === 'en' ? 'Bathrooms' : 'Banheiros'}</span>
                      </span>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-helvetica tracking-wider">
                          {lang === 'en' ? 'BATHROOMS' : 'BANHEIROS'}
                        </span>
                        <span className="font-medium">{selectedProperty.specs.baths} {lang === 'en' ? 'Bathrooms' : 'Banheiros'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 py-2 border-b border-gray-50">
                      <span className="icon-tooltip-wrapper">
                        <Car size={20} className="text-gray-400 stroke-[1.5]" />
                        <span className="icon-tooltip">{lang === 'en' ? 'Parking spaces' : 'Vagas de garagem'}</span>
                      </span>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-helvetica tracking-wider">
                          {lang === 'en' ? 'PARKING' : 'VAGAS'}
                        </span>
                        <span className="font-medium">{selectedProperty.specs.cars} {lang === 'en' ? 'Spaces' : 'Vagas'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 py-2 border-b border-gray-50">
                      <span className="icon-tooltip-wrapper">
                        <Maximize size={20} className="text-gray-400 stroke-[1.5]" />
                        <span className="icon-tooltip">{lang === 'en' ? 'Built area' : 'Área construída'}</span>
                      </span>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-helvetica tracking-wider">
                          {lang === 'en' ? 'BUILT AREA' : 'ÁREA CONSTRUÍDA'}
                        </span>
                        <span className="font-medium">{selectedProperty.specs.builtArea}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 py-2 border-b border-gray-50">
                      <span className="icon-tooltip-wrapper">
                        <Square size={20} className="text-gray-400 stroke-[1.5]" />
                        <span className="icon-tooltip">{lang === 'en' ? 'Total land area' : 'Área total do terreno'}</span>
                      </span>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-helvetica tracking-wider">
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
        <main className={`pt-16 pb-32 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="w-full px-8 md:px-16 mb-20 text-center">
            <h1 className="text-4xl font-qlassy mb-4 md:mb-6 uppercase tracking-tighter text-gray-700">
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
                          <Maximize size={20} className="text-gray-400 stroke-[1.5]" />
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
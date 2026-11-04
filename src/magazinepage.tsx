import { useRef, useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { magazines } from './magazines';

const magazineTranslations = {
  'pt': {
    back: "VOLTAR",
    edition: "EDIÇÃO",
    instruction: "ARRASTE PARA FOLHEAR OU USE AS SETAS",
    magazine: "REVISTA"
  },
  'en': {
    back: "BACK",
    edition: "EDITION",
    instruction: "DRAG TO FLIP OR USE ARROWS",
    magazine: "MAGAZINE"
  }
};

const cyanBrand = "#49BFEA";

// Páginas carregadas à frente da página atual (revistas grandes não baixam tudo de uma vez)
const PRELOAD_AHEAD = 8;

const magazineStyles = `
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
  @font-face { font-family: 'Qlassy'; src: url('/fonts/Qlassy.ttf') format('truetype'); }
  @font-face { font-family: 'NeueHelvetica'; src: url('/fonts/helvetica-condensed.ttf') format('truetype'); }

  .font-qlassy { font-family: 'Qlassy', serif !important; text-transform: uppercase; }
  .font-helvetica { font-family: 'NeueHelvetica', sans-serif !important; text-transform: uppercase; }
  .font-garamond { font-family: 'EB Garamond', serif !important; }

  .magazine-book { cursor: grab; }
  .magazine-book:active { cursor: grabbing; }
  .stf__parent { background-color: transparent !important; }

  /* Limpa fundos padrão da biblioteca e adiciona a sombra na raiz wrapper */
  .stf__block { background-color: transparent !important; }
  .stf__wrapper { box-shadow: 0 50px 100px -30px rgba(0,0,0,0.2); }
`;

const useLang = () => {
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem('language') as 'pt' | 'en';
      if (savedLang) {
        setLang((prevLang) => (prevLang !== savedLang ? savedLang : prevLang));
      }
    };
    checkLang();
    const langInterval = setInterval(checkLang, 300);
    window.addEventListener('storage', checkLang);
    window.addEventListener('languageChange', checkLang);
    return () => {
      clearInterval(langInterval);
      window.removeEventListener('storage', checkLang);
      window.removeEventListener('languageChange', checkLang);
    };
  }, []);
  return lang;
};

// /magazinepage: capas das revistas, uma embaixo da outra no celular e lado a lado no computador
const MagazineList = () => {
  const lang = useLang();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f4f4] selection:bg-[#49BFEA] selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: magazineStyles }} />
      <main className="w-full max-w-5xl mx-auto px-8 pt-12 pb-24 md:pt-20 flex flex-col md:flex-row items-center md:items-start justify-center gap-16 md:gap-20">
        {magazines.map((magazine) => {
          const title = lang === 'en' ? magazine.titleEn : magazine.title;
          return (
            <Link key={magazine.slug} to={`/magazinepage/${magazine.slug}`} className="group flex flex-col items-center w-full max-w-[300px] md:w-[340px] md:max-w-none">
              <div className="w-full aspect-[1/1.41] bg-white overflow-hidden shadow-[12px_16px_30px_-8px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:-translate-y-1">
                <img src={magazine.pages[0]} alt={title} className="w-full h-full object-cover" />
              </div>
              <p className="font-qlassy text-gray-700 text-2xl md:text-3xl tracking-tighter mt-8 text-center transition-colors group-hover:text-[#49BFEA]">
                {lang === 'en' ? `${title} ${t(lang).magazine}` : `${t(lang).magazine} ${title}`}
              </p>
            </Link>
          );
        })}
      </main>
    </div>
  );
};

const t = (lang: 'pt' | 'en') => magazineTranslations[lang];

// /magazinepage/<revista>: o livro folheável
const MagazineViewer = ({ pages }: { pages: string[] }) => {
  const bookRef = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [loadedUntil, setLoadedUntil] = useState(PRELOAD_AHEAD);
  const [isMobile, setIsMobile] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const lang = useLang();

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w < 768;
      setIsMobile(mobile);

      if (mobile) {
        // Aproveita mais o espaço em telas menores
        const availableHeight = h - 140;
        const availableWidth = w - 32;
        let calcWidth = availableWidth;
        let calcHeight = calcWidth * 1.41;

        if (calcHeight > availableHeight) {
          calcHeight = availableHeight;
          calcWidth = calcHeight / 1.41;
        }
        setDimensions({ width: calcWidth, height: calcHeight });
      } else {
        // Mantido exatamente igual para Desktop
        const availableHeight = h - 250;
        const availableWidth = w - 260;
        let calcHeight = availableHeight;
        let calcWidth = calcHeight / 1.41;

        if (calcWidth * 2 > availableWidth) {
          calcWidth = availableWidth / 2;
          calcHeight = calcWidth * 1.41;
        }
        setDimensions({ width: calcWidth, height: calcHeight });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // O SEGREDO DO ALINHAMENTO:
  // Calcula dinamicamente o quanto o livro deve deslizar para o lado para que a capa fique no centro
  const getContainerTransform = () => {
    // No mobile (retrato), ele já ocupa o centro nativamente por ser 1 página só
    if (isMobile) return 'translateX(0px)';

    // Na Capa: Desloca o equivalente a metade da largura de uma página para a esquerda
    if (page === 0) return `translateX(-${dimensions.width / 2}px)`;

    // Na Contracapa: Desloca o equivalente a metade da largura de uma página para a direita
    if (page === pages.length - 1) return `translateX(${dimensions.width / 2}px)`;

    // Páginas abertas no meio: Fica exatamente no centro
    return 'translateX(0px)';
  };

  return (
    <div className="h-screen bg-[#f4f4f4] flex flex-col items-center justify-between overflow-hidden relative selection:bg-[#49BFEA] selection:text-white">

      <style dangerouslySetInnerHTML={{ __html: magazineStyles }} />

      {/* Conteúdo Principal (Magazine) */}
      <main className="relative flex flex-1 items-center justify-center w-full z-10 h-full overflow-hidden px-4 pt-6">
        {/* Volta para a lista de revistas */}
        <Link
          to="/magazinepage"
          className="absolute top-3 left-3 md:top-6 md:left-8 z-40 flex items-center gap-2 md:gap-3 bg-white/90 backdrop-blur-md px-3 py-2 md:px-5 md:py-3 shadow-sm hover:bg-white transition-all text-gray-800 font-helvetica text-[10px] tracking-widest font-bold"
        >
          <ArrowLeft size={14} /> {t(lang).back}
        </Link>

        <nav className="absolute inset-x-0 flex justify-between px-2 md:px-8 z-30 pointer-events-none">
          <button
            onClick={() => bookRef.current?.pageFlip().flipPrev()}
            className="pointer-events-auto w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/90 border-2 flex items-center justify-center transition-all duration-500 shadow-xl backdrop-blur-sm"
            style={{ borderColor: cyanBrand, color: cyanBrand }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = cyanBrand; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = cyanBrand; }}
          >
            <ChevronLeft size={isMobile ? 20 : 32} strokeWidth={2} />
          </button>
          <button
            onClick={() => bookRef.current?.pageFlip().flipNext()}
            className="pointer-events-auto w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/90 border-2 flex items-center justify-center transition-all duration-500 shadow-xl backdrop-blur-sm"
            style={{ borderColor: cyanBrand, color: cyanBrand }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = cyanBrand; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = cyanBrand; }}
          >
            <ChevronRight size={isMobile ? 20 : 32} strokeWidth={2} />
          </button>
        </nav>

        {/* CONTAINER COM ANIMAÇÃO DE DESLOCAMENTO INTELIGENTE */}
        <div
          className="relative flex items-center justify-center transition-transform duration-700 ease-in-out"
          style={{ transform: getContainerTransform() }}
        >
          {dimensions.width > 0 && (
            // @ts-expect-error a tipagem do react-pageflip exige props opcionais (maxHeight, mobileScrollSupport)
            <HTMLFlipBook
              width={Math.round(dimensions.width)}
              height={Math.round(dimensions.height)}
              size="fixed"
              minWidth={isMobile ? 100 : 300}    /* Ajuste responsivo crucial */
              maxWidth={3000}
              minHeight={isMobile ? 150 : 400}   /* Ajuste responsivo crucial */
              maxShadowOpacity={0.4}
              showCover={true}
              ref={bookRef}
              onFlip={(e: any) => {
                setPage(e.data);
                setLoadedUntil((prev) => Math.max(prev, e.data + PRELOAD_AHEAD));
              }}
              className="magazine-book"
              style={{ backgroundColor: 'transparent' }}
              startPage={0}
              drawShadow={true}
              flippingTime={1000}
              usePortrait={isMobile}
              startZIndex={0}
              autoSize={false}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
            >
              {pages.map((image, index) => {
                const isFirstPage = index === 0;
                const isLastPage = index === pages.length - 1;

                return (
                  <div
                    key={index}
                    className="bg-white relative overflow-hidden"
                    data-density={(isFirstPage || isLastPage) ? "hard" : "soft"}
                  >
                    {/* Sombra da dobra central apenas nas páginas abertas */}
                    {!isFirstPage && !isLastPage && (
                      <div className={`absolute inset-0 z-20 pointer-events-none ${
                        index % 2 === 0
                          ? 'bg-gradient-to-r from-black/15 via-transparent'
                          : 'bg-gradient-to-l from-black/15 via-transparent'
                      }`} />
                    )}

                    {(index < loadedUntil || isLastPage) && (
                      <img
                        src={image}
                        alt={`Página ${index + 1}`}
                        className="w-full h-full object-cover select-none"
                        loading="eager"
                      />
                    )}
                  </div>
                );
              })}
            </HTMLFlipBook>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full flex flex-col items-center gap-3 z-50 h-24 justify-center bg-[#f4f4f4] pb-6">
        <div className="w-48 md:w-[300px] h-[1px] bg-black/10 rounded-full relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full transition-all duration-700 ease-in-out"
            style={{
              width: `${((page + 1) / pages.length) * 100}%`,
              backgroundColor: cyanBrand
            }}
          />
        </div>

        <p className="font-helvetica text-black/30 text-[8px] tracking-[0.4em] font-bold text-center">
          {t(lang).instruction}
        </p>
      </footer>

    </div>
  );
};

const MagazinePage = () => {
  const { revista } = useParams();
  if (!revista) return <MagazineList />;
  const magazine = magazines.find((m) => m.slug === revista);
  if (!magazine) return <Navigate to="/magazinepage" replace />;
  return <MagazineViewer key={magazine.slug} pages={magazine.pages} />;
};

export default MagazinePage;

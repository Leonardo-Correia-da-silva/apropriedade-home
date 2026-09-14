import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const magazineTranslations = {
  'pt': {
    back: "VOLTAR",
    edition: "EDIÇÃO",
    instruction: "ARRASTE PARA FOLHEAR OU USE AS SETAS"
  },
  'en': {
    back: "BACK",
    edition: "EDITION",
    instruction: "DRAG TO FLIP OR USE ARROWS"
  }
};

const MagazinePage = () => {
  const bookRef = useRef<any>(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  const cyanBrand = "#49BFEA";

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
    return () => {
      clearInterval(langInterval);
      window.removeEventListener('storage', checkLang);
      window.removeEventListener('languageChange', checkLang);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const t = magazineTranslations[lang];
  const pages = Array.from({ length: 16 }, (_, i) => `/magazine/imagem${i + 1}.jpg`);

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
      
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        @font-face { font-family: 'Qlassy'; src: url('/fonts/qlassy.ttf') format('truetype'); }
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
      `}} />

      {/* Conteúdo Principal (Magazine) */}
      <main className="relative flex flex-1 items-center justify-center w-full z-10 h-full overflow-hidden px-4 pt-6">
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
              onFlip={(e: any) => setPage(e.data)}
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
                    
                    <img 
                      src={image} 
                      alt={`Página ${index + 1}`} 
                      className="w-full h-full object-cover select-none"
                      loading="eager" 
                    />
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
          {t.instruction}
        </p>
      </footer>

    </div>
  );
};

export default MagazinePage;
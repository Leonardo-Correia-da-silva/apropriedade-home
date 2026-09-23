import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageCircle, 
  Share2,
  Building2
} from 'lucide-react';

const translations = {
  pt: {
    back: "VOLTAR",
    comingSoon: "Novidades em Breve",
    title: "Apartamentos Alto Padrão",
    desc: "Estamos preparando e catalogando uma nova seleção de apartamentos de alto padrão para integrar nossa plataforma de vendas. Em breve, as primeiras oportunidades exclusivas estarão listadas aqui.",
    card1Label: "Quer comprar?",
    card1Desc: "Fale com a nossa equipe para entrar na lista de interessados. Avisaremos você em primeira mão assim que os primeiros apartamentos forem liberados.",
    card2Label: "Quer vender?",
    card2Desc: "Se você possui um apartamento com alto padrão de design e arquitetura e deseja anunciá-lo conosco, entre em contato para avaliarmos o imóvel.",
    cta: "FALAR COM UM ESPECIALISTA"
  },
  en: {
    back: "BACK",
    comingSoon: "Coming Soon",
    title: "High-End Apartments",
    desc: "We are preparing and cataloging a new selection of high-standard apartments to integrate our sales platform. Soon, the first exclusive opportunities will be listed here.",
    card1Label: "Looking to buy?",
    card1Desc: "Talk to our team to join the list of interested parties. We will notify you first-hand as soon as the first apartments are released.",
    card2Label: "Looking to sell?",
    card2Desc: "If you own an apartment with a high standard of design and architecture and wish to list it with us, please contact us for an evaluation of the property.",
    cta: "TALK TO A SPECIALIST"
  }
};

interface ApartamentosProps {
  language?: 'pt' | 'en';
}

export default function Apartamentos({ language }: ApartamentosProps) {
  const cyanBase = "#00B6E3";
  const [isLoaded, setIsLoaded] = useState(false);
  const context = useOutletContext<any>();

  // Obtém o idioma reativo vindo do App.tsx (props ou outletContext), com fallback dinâmico ao localStorage
  const [lang, setLang] = useState<'pt' | 'en'>(
    language ||
    (typeof context === 'string' ? context : context?.language) ||
    (localStorage.getItem('language') as 'pt' | 'en') ||
    'pt'
  );

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

  const t = translations[lang] || translations.pt;

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#00B6E3] selection:text-white antialiased flex flex-col justify-center py-12 md:py-20">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        @font-face { font-family: 'Qlassy'; src: url('/fonts/Qlassy.ttf') format('truetype'); }
        @font-face { font-family: 'NeueHelvetica'; src: url('/fonts/helvetica-condensed.ttf') format('truetype'); }

        .font-qlassy { font-family: 'Qlassy', serif !important; }
        .font-helvetica { font-family: 'NeueHelvetica', sans-serif !important; }
        .font-garamond { font-family: 'EB Garamond', serif !important; }

        h1, h2, h3 { font-family: 'Qlassy', serif !important; }
        .nav-label, .btn-label { font-family: 'NeueHelvetica', sans-serif !important; text-transform: uppercase; }
      `}} />

      <main className={`pb-40 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Cabeçalho do Segmento */}
        <div className="container mx-auto px-6 mb-12 text-center">
          <span className="nav-label inline-block text-[#00B6E3] text-[10px] tracking-[0.5em] font-bold mb-4">
            {t.comingSoon}
          </span>
          <h1 className="text-4xl font-qlassy mb-6 uppercase tracking-tighter text-gray-700">
            {t.title}
          </h1>
          <div className="flex justify-center mb-6">
            <Building2 size={40} strokeWidth={1} className="text-gray-300" />
          </div>
        </div>

        {/* Mensagem de Captação Corporativa */}
        <section className="container mx-auto px-6 max-w-2xl text-center">
          
          <div className="w-12 h-[1px] bg-gray-300 mx-auto mt-8"></div>
          <p className="font-garamond text-gray-500 text-xl leading-relaxed mb-10 mt-8">
            {t.desc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <div className="border border-gray-100 bg-[#fbfbfb] p-6 rounded-sm">
              <p className="nav-label text-[10px] tracking-widest font-bold text-[#00B6E3] mb-2">{t.card1Label}</p>
              <p className="font-garamond text-gray-600 text-sm leading-relaxed">
                {t.card1Desc}
              </p>
            </div>
            
            <div className="border border-gray-100 bg-[#fbfbfb] p-6 rounded-sm">
              <p className="nav-label text-[10px] tracking-widest font-bold text-gray-400 mb-2">{t.card2Label}</p>
              <p className="font-garamond text-gray-600 text-sm leading-relaxed">
                {t.card2Desc}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
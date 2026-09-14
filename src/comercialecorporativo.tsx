import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageCircle, 
  Share2,
  Briefcase
} from 'lucide-react';

const translations = {
  pt: {
    back: "VOLTAR",
    comingSoon: "Novidades em Breve",
    title: "Comercial e Corporativo",
    desc: "Estamos selecionando imóveis corporativos estratégicos e de alto padrão para integrar nossa plataforma. Em breve, disponibilizaremos salas comerciais e lajes corporativas prontas para o posicionamento do seu negócio.",
    card1Label: "Para sua Empresa",
    card1Desc: "Precisa de uma nova sede corporativa ou espaço comercial com requisitos específicos? Registre sua demanda com nossa equipe de especialistas.",
    card2Label: "Para Proprietários",
    card2Desc: "Se você possui um imóvel comercial de alto padrão para venda e busca um posicionamento de mercado sofisticado, entre em contato.",
    cta: "FALAR COM UM ESPECIALISTA"
  },
  en: {
    back: "BACK",
    comingSoon: "Coming Soon",
    title: "Commercial & Corporate",
    desc: "We are selecting strategic and high-standard corporate properties to integrate into our platform. Soon, we will provide commercial offices and corporate spaces ready for your business positioning.",
    card1Label: "For Your Company",
    card1Desc: "Need a new corporate headquarters or commercial space with specific requirements? Register your demand with our team of specialists.",
    card2Label: "For Owners",
    card2Desc: "If you own a high-standard commercial property for sale and seek a sophisticated market positioning, please get in touch.",
    cta: "TALK TO A SPECIALIST"
  }
};

interface ComercialECorporativoProps {
  language?: 'pt' | 'en';
}

export default function ComercialECorporativo({ language }: ComercialECorporativoProps) {
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
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#00B6E3] selection:text-white antialiased">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        @font-face { font-family: 'Qlassy'; src: url('/fonts/qlassy.ttf') format('truetype'); }
        @font-face { font-family: 'NeueHelvetica'; src: url('/fonts/helvetica-condensed.ttf') format('truetype'); }

        .font-qlassy { font-family: 'Qlassy', serif !important; }
        .font-helvetica { font-family: 'NeueHelvetica', sans-serif !important; }
        .font-garamond { font-family: 'EB Garamond', serif !important; }

        h1, h2, h3 { font-family: 'Qlassy', serif !important; }
        .nav-label, .btn-label { font-family: 'NeueHelvetica', sans-serif !important; text-transform: uppercase; }
      `}} />

      <main className={`pt-20 pb-40 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Cabeçalho do Segmento */}
        <div className="container mx-auto px-6 mb-12 text-center">
          <span className="nav-label inline-block text-[#00B6E3] text-[10px] tracking-[0.5em] font-bold mb-4">
            {t.comingSoon}
          </span>
          <h1 className="text-4xl font-qlassy mb-6 uppercase tracking-tighter text-gray-700">
            {t.title}
          </h1>
          <div className="flex justify-center mb-6">
            <Briefcase size={40} strokeWidth={1} className="text-gray-300" />
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
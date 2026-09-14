import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const translations = {
  pt: {
    tagline: "A Propriedade",
    title: "Termos de Uso",
    headerTitle: "Termos e Condições de Uso",
    lastModified: "Última Modificação: 18/08/2026",
    s1Title: "1. Aceitação dos Termos",
    s1Desc: <>Ao navegar no site <strong>A Propriedade</strong>, você concorda em cumprir os presentes termos de serviço, todas as leis e regulamentos aplicáveis. O conteúdo disponibilizado destina-se à apresentação de propriedades e projetos arquitetônicos exclusivos.</>,
    s2Title: "2. Propriedade Intelectual e Licença",
    s2Desc: "Todo o conteúdo visual, acervo fotográfico, marcas e textos presentes neste site são de propriedade exclusiva de A Propriedade. É concedida permissão para visualização estritamente pessoal e não comercial. É expressamente proibido:",
    s2Item1: "Copiar, modificar ou republicar os materiais sem autorização prévia;",
    s2Item2: "Utilizar o conteúdo para finalidades comerciais ou exibição pública;",
    s2Item3: "Remover quaisquer marcas d'água, direitos autorais ou notações de propriedade das imagens.",
    s3Title: "3. Isenção de Responsabilidade",
    s3Desc: "As especificações dos imóveis, valores e disponibilidades exibidos no site estão sujeitos a alterações sem aviso prévio. Trabalhamos para manter as informações sempre precisas e atualizadas, mas não garantimos a ausência de imprecisões pontuais.",
    s4Title: "4. Alterações nos Termos",
    s4Desc: "A Propriedade se reserva o direito de revisar estes termos de serviço a qualquer momento, sem aviso prévio. A navegação contínua no site implica na aceitação automática das versões atualizadas dos termos."
  },
  en: {
    tagline: "A Propriedade",
    title: "Terms of Use",
    headerTitle: "Terms and Conditions of Use",
    lastModified: "Last Modified: 08/18/2026",
    s1Title: "1. Acceptance of Terms",
    s1Desc: <>By navigating the <strong>A Propriedade</strong> website, you agree to comply with these terms of service, all applicable laws, and regulations. The content provided is intended for the presentation of exclusive properties and architectural projects.</>,
    s2Title: "2. Intellectual Property and License",
    s2Desc: "All visual content, photographic collection, trademarks, and texts present on this site are the exclusive property of A Propriedade. Permission is granted for strictly personal and non-commercial viewing. It is expressly prohibited to:",
    s2Item1: "Copy, modify, or republish materials without prior authorization;",
    s2Item2: "Use content for commercial purposes or public display;",
    s2Item3: "Remove any watermarks, copyrights, or proprietary notations from the images.",
    s3Title: "3. Disclaimer",
    s3Desc: "Property specifications, values, and availability displayed on the website are subject to change without notice. We work to keep the information always accurate and updated, but we do not guarantee the absence of occasional inaccuracies.",
    s4Title: "4. Changes to Terms",
    s4Desc: "A Propriedade reserves the right to revise these terms of service at any time without prior notice. Continuous navigation on the site implies automatic acceptance of the updated terms."
  }
};

interface TermosUsoProps {
  language?: 'pt' | 'en';
}

export default function TermosUso({ language }: TermosUsoProps) {
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
    <main className="min-h-screen bg-white text-gray-900 selection:bg-[#00B6E3] selection:text-white pb-24">
      
      {/* 1. SEÇÃO DA IMAGEM DE FUNDO (HERO) */}
      <div className="relative w-full h-[55vh] min-h-[400px] flex flex-col items-center justify-center md:mt-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center flex flex-col items-center px-4 animate-fadeIn">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/90 mb-4 font-sans drop-shadow-md">
            {t.tagline}
          </span>
          <h1 className="text-6xl font-qlassy uppercase tracking-widest text-white drop-shadow-lg">
            {t.title}
          </h1>
        </div>
      </div>

      {/* 2. SEÇÃO DE CONTEÚDO (BRANCA) */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 pt-16">

        <div className="mb-10 pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold uppercase tracking-[0.1em] text-black font-sans mb-3">
            {t.headerTitle}
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 font-sans">
            {t.lastModified}
          </p>
        </div>
        
        <div className="space-y-8 font-garamond text-base leading-relaxed text-gray-700">
          
          <section className="pt-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] font-sans text-black mb-3">
              {t.s1Title}
            </h2>
            <p>{t.s1Desc}</p>
          </section>

          <section className="pt-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] font-sans text-black mb-3">
              {t.s2Title}
            </h2>
            <p className="mb-3">{t.s2Desc}</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>{t.s2Item1}</li>
              <li>{t.s2Item2}</li>
              <li>{t.s2Item3}</li>
            </ul>
          </section>

          <section className="pt-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] font-sans text-black mb-3">
              {t.s3Title}
            </h2>
            <p className="mb-3">{t.s3Desc}</p>
          </section>

          <section className="pt-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] font-sans text-black mb-3">
              {t.s4Title}
            </h2>
            <p>{t.s4Desc}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

const translations = {
  pt: {
    tagline: "A Propriedade",
    title: "Privacidade",
    lastModified: "Última Modificação: 18/08/2026",
    intro: <>A sua privacidade é fundamental para nós. É compromisso do site <strong>A Propriedade</strong> respeitar a sua privacidade em relação a qualquer informação pessoal que possamos coletar no domínio <em>apropriedade.com.br</em>.</>,
    s1Title: "1. Coleta de Dados",
    s1Desc1: "Solicitamos informações pessoais apenas quando estritamente necessário para lhe fornecer um serviço exclusivo, como o acesso à nossa Revista Digital. O processo ocorre de maneira transparente e sob o seu explícito consentimento.",
    s1Desc2: "Os dados coletados ativamente por meio de nossos formulários de cadastro incluem:",
    s1Item1: "Nome completo",
    s1Item2: "Endereço de e-mail",
    s1Item3: "Telefone de contato / WhatsApp",
    s2Title: "2. Uso e Retenção das Informações",
    s2Desc1: "As informações fornecidas são utilizadas exclusivamente para o envio da Revista Digital, informativos de novos empreendimentos e atendimento personalizado.",
    s2Desc2: "Apenas mantemos os dados armazenados pelo tempo necessário para cumprir com as finalidades solicitadas. Empregamos padrões rígidos de segurança para evitar perdas, acessos não autorizados ou divulgação indevida.",
    s3Title: "3. Compartilhamento de Dados",
    s3Desc: "Não compartilhamos dados de identificação pessoal publicamente nem com terceiros, exceto mediante exigência legal ou integração com plataformas indispensáveis para o envio de e-mails institucionais.",
    s4Title: "4. Direitos do Usuário",
    s4Desc: "Você possui total liberdade para recusar o fornecimento de dados pessoais. É garantido a qualquer tempo o direito de solicitar a atualização, correção ou exclusão completa de seus dados da nossa base.",
    s5Title: "5. Contato Institucional",
    s5Desc: <>Dúvidas sobre nossa Política de Privacidade ou solicitações de remoção de dados podem ser encaminhadas diretamente ao e-mail: <strong>andre@apropriedade.com.br</strong>.</>
  },
  en: {
    tagline: "A Propriedade",
    title: "Privacy Policy",
    lastModified: "Last Modified: 08/18/2026",
    intro: <>Your privacy is important to us. It is the policy of <strong>A Propriedade</strong> to respect your privacy regarding any personal information we may collect on the domain <em>apropriedade.com.br</em>.</>,
    s1Title: "1. Data Collection",
    s1Desc1: "We request personal information only when strictly necessary to provide you with an exclusive service, such as access to our Digital Magazine. The process occurs transparently and with your explicit consent.",
    s1Desc2: "The data actively collected through our registration forms includes:",
    s1Item1: "Full name",
    s1Item2: "Email address",
    s1Item3: "Contact phone / WhatsApp",
    s2Title: "2. Use and Retention of Information",
    s2Desc1: "The information provided is used exclusively for sending the Digital Magazine, updates on new developments, and personalized customer service.",
    s2Desc2: "We only retain stored data for as long as necessary to fulfill the requested purposes. We employ strict security standards to prevent loss, unauthorized access, or improper disclosure.",
    s3Title: "3. Data Sharing",
    s3Desc: "We do not share personally identifying information publicly or with third parties, except when required by law or through integration with essential platforms for sending institutional emails.",
    s4Title: "4. User Rights",
    s4Desc: "You are free to refuse our request for personal information. You are guaranteed the right at any time to request the update, correction, or complete deletion of your data from our database.",
    s5Title: "5. Institutional Contact",
    s5Desc: <>Questions about our Privacy Policy or requests for data removal can be directed to the email: <strong>andre@apropriedade.com.br</strong>.</>
  }
};

interface PoliticaPrivacidadeProps {
  language?: 'pt' | 'en';
}

export default function PoliticaPrivacidade({ language }: PoliticaPrivacidadeProps) {
  const context = useOutletContext<any>();
  
  // Obtém o idioma reativo vindo do App.tsx (props ou outletContext)
  const lang: 'pt' | 'en' = 
    language || 
    (typeof context === 'string' ? context : context?.language) || 
    (localStorage.getItem('language') as 'pt' | 'en') || 
    'pt';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const t = translations[lang] || translations.pt;

  return (
    <main className="min-h-screen bg-white text-gray-900 selection:bg-[#00B6E3] selection:text-white pb-24">
      
      {/* 1. SEÇÃO DA IMAGEM DE FUNDO (HERO) */}
      <div className="relative w-full h-[55vh] min-h-[400px] flex flex-col items-center justify-center md:mt-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')" }}
        ></div>
        
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center flex flex-col items-center px-4 animate-fadeIn">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/90 mb-4 font-sans drop-shadow-md">
            {t.tagline}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-qlassy uppercase tracking-widest text-white drop-shadow-lg">
            {t.title}
          </h1>
        </div>
      </div>

      {/* 2. SEÇÃO DE CONTEÚDO (BRANCA) */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 pt-16">

        <div className="mb-10 pb-6 border-b border-gray-200">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-black font-sans">
            {t.lastModified}
          </p>
        </div>
        
        <div className="space-y-8 font-garamond text-sm md:text-base leading-relaxed text-gray-700">
          <p>{t.intro}</p>

          <section className="pt-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] font-sans text-black mb-3">
              {t.s1Title}
            </h2>
            <p className="mb-3">{t.s1Desc1}</p>
            <p className="mb-2">{t.s1Desc2}</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>{t.s1Item1}</li>
              <li>{t.s1Item2}</li>
              <li>{t.s1Item3}</li>
            </ul>
          </section>

          <section className="pt-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] font-sans text-black mb-3">
              {t.s2Title}
            </h2>
            <p className="mb-3">{t.s2Desc1}</p>
            <p>{t.s2Desc2}</p>
          </section>

          <section className="pt-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] font-sans text-black mb-3">
              {t.s3Title}
            </h2>
            <p>{t.s3Desc}</p>
          </section>

          <section className="pt-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] font-sans text-black mb-3">
              {t.s4Title}
            </h2>
            <p>{t.s4Desc}</p>
          </section>

          <section className="pt-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] font-sans text-black mb-3">
              {t.s5Title}
            </h2>
            <p>{t.s5Desc}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
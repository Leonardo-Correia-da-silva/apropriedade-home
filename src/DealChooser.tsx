import { Link } from 'react-router-dom';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import type { Deal } from './usePropertyRoute';

const texts = {
  pt: {
    question: "O que você procura?",
    comprar: { label: "Comprar" },
    alugar: { label: "Alugar" },
    count: (n: number) => (n === 1 ? "1 imóvel" : `${n} imóveis`),
    soon: "Em breve",
    comingSoon: "Novidades em Breve",
    emptyDesc: {
      comprar: (noun: string) => `Estamos selecionando ${noun} de alto padrão para integrar nossa plataforma. Em breve, novas opções à venda estarão disponíveis aqui.`,
      alugar: (noun: string) => `Estamos selecionando ${noun} de alto padrão para locação. Em breve, novas opções para alugar estarão disponíveis aqui.`
    },
    card1Label: "Para quem Procura",
    card1Desc: "Procura um imóvel com requisitos específicos? Registre sua demanda com nossa equipe de especialistas.",
    card2Label: "Para Proprietários",
    card2Desc: {
      comprar: "Se você possui um imóvel de alto padrão para venda e busca um posicionamento de mercado sofisticado, entre em contato.",
      alugar: "Se você possui um imóvel de alto padrão para locação e busca um posicionamento de mercado sofisticado, entre em contato."
    }
  },
  en: {
    question: "What are you looking for?",
    comprar: { label: "Buy" },
    alugar: { label: "Rent" },
    count: (n: number) => (n === 1 ? "1 property" : `${n} properties`),
    soon: "Coming soon",
    comingSoon: "Coming Soon",
    emptyDesc: {
      comprar: (noun: string) => `We are selecting high-standard ${noun} to integrate into our platform. Soon, new options for sale will be available here.`,
      alugar: (noun: string) => `We are selecting high-standard ${noun} for rent. Soon, new rental options will be available here.`
    },
    card1Label: "For Buyers & Tenants",
    card1Desc: "Looking for a property with specific requirements? Register your demand with our team of specialists.",
    card2Label: "For Owners",
    card2Desc: {
      comprar: "If you own a high-standard property for sale and seek a sophisticated market positioning, please get in touch.",
      alugar: "If you own a high-standard property for rent and seek a sophisticated market positioning, please get in touch."
    }
  }
};

const deals: Deal[] = ['comprar', 'alugar'];

// Tela de escolha mostrada ao entrar em uma categoria
export function DealChooser({ lang, title, basePath, counts }: {
  lang: 'pt' | 'en';
  title: string;
  basePath: string;
  counts?: Record<Deal, number>;
}) {
  const t = texts[lang];
  return (
    <main className="pt-16 pb-32 animate-fadeIn">
      <div className="w-full px-8 md:px-16 mb-14 text-center">
        <h1 className="text-4xl font-qlassy mb-4 md:mb-6 uppercase tracking-tighter text-gray-700">{title}</h1>
        <div className="w-12 h-[1px] bg-gray-300 mx-auto mt-8 mb-8"></div>
        <p className="font-garamond text-gray-500 text-xl">{t.question}</p>
      </div>

      <section className="w-full max-w-3xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {deals.map((deal) => (
          <Link
            key={deal}
            to={`${basePath}/${deal}`}
            className="group border border-gray-200 hover:border-[#00B6E3] bg-[#fbfbfb] hover:bg-white px-8 py-12 text-center transition-all duration-300"
          >
            <span className="block text-3xl md:text-4xl font-qlassy uppercase tracking-tight text-gray-700 group-hover:text-[#00B6E3] transition-colors">
              {t[deal].label}
            </span>
            <span className="nav-label inline-flex items-center gap-2 text-[10px] tracking-widest text-gray-400 group-hover:text-[#00B6E3] mt-6 transition-colors">
              {counts ? (counts[deal] ? t.count(counts[deal]) : t.soon) : t.soon} <ArrowUpRight size={14} />
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}

// Alternância Comprar | Alugar logo abaixo do título da lista
export function DealToggle({ lang, basePath, deal }: { lang: 'pt' | 'en'; basePath: string; deal: Deal }) {
  const t = texts[lang];
  return (
    <div className="flex justify-center gap-8 mt-8">
      {deals.map((d) => (
        <Link
          key={d}
          to={`${basePath}/${d}`}
          replace
          className={`nav-label text-[11px] tracking-[0.25em] pb-1 border-b transition-colors ${
            d === deal ? 'text-[#00B6E3] border-[#00B6E3]' : 'text-gray-400 border-transparent hover:text-gray-700'
          }`}
        >
          {t[d].label}
        </Link>
      ))}
    </div>
  );
}

// Sem imóveis na opção escolhida: mesmo padrão "Novidades em breve" da página Comercial e Corporativo
export function DealComingSoon({ lang, deal, title, basePath, noun, icon: Icon, isLoaded = true }: {
  lang: 'pt' | 'en';
  deal: Deal;
  title: string;
  basePath: string;
  noun: { pt: string; en: string };
  icon: LucideIcon;
  isLoaded?: boolean;
}) {
  const t = texts[lang];
  return (
    <main className={`pt-20 pb-40 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="container mx-auto px-6 mb-12 text-center">
        <span className="nav-label inline-block text-[#00B6E3] text-[10px] tracking-[0.5em] font-bold mb-4">
          {t.comingSoon}
        </span>
        <h1 className="text-4xl font-qlassy mb-6 uppercase tracking-tighter text-gray-700">
          {title}
        </h1>
        <div className="mb-6"><DealToggle lang={lang} basePath={basePath} deal={deal} /></div>
        <div className="flex justify-center mb-6">
          <Icon size={40} strokeWidth={1} className="text-gray-300" />
        </div>
      </div>

      <section className="container mx-auto px-6 max-w-2xl text-center">
        <div className="w-12 h-[1px] bg-gray-300 mx-auto mt-8"></div>
        <p className="font-garamond text-gray-500 text-xl leading-relaxed mb-10 mt-8">
          {t.emptyDesc[deal](noun[lang])}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          <div className="border border-gray-100 bg-[#fbfbfb] p-6 rounded-sm">
            <p className="nav-label text-[10px] tracking-widest font-bold text-[#00B6E3] mb-2">{t.card1Label}</p>
            <p className="font-garamond text-gray-600 text-sm leading-relaxed">{t.card1Desc}</p>
          </div>
          <div className="border border-gray-100 bg-[#fbfbfb] p-6 rounded-sm">
            <p className="nav-label text-[10px] tracking-widest font-bold text-gray-400 mb-2">{t.card2Label}</p>
            <p className="font-garamond text-gray-600 text-sm leading-relaxed">{t.card2Desc[deal]}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

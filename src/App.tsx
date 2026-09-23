import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Instagram,
  MessageCircle,
  ArrowUpRight,
  Search,
  X,
  Menu,
  Mail,
  Home,
  Info,
  Building2,
  Newspaper,
  ShieldCheck,
  FileText,
  MapPin,
  BedDouble,
  Bath,
  Car,
  CornerDownLeft,
} from 'lucide-react';


// --- COMPONENTE EXTERNOS ---
import CasasUrbanas from './casasurbanas';
import Montanha from './terrenos';
import Apartamentos from './apartamentos';
import CasadeCampoeMontanha from './casadecampoemontanha';
import MagazinePage from './magazinepage';
import ComercialECorporativo from './comercialecorporativo';
import PoliticaPrivacidade from './PoliticaPrivacidade'; // Ajuste o caminho
import TermosUso from './TermosUso'; // Ajuste o caminho
import { searchProperties, searchPages, normalizeText } from './searchData';
import type { SearchProperty, SearchPage } from './searchData';

const translations = {
  'pt': {
    nav: ["Início", "Sobre Nós", "Propriedades", "Contato", "Magazine"],
    hero: {
      label: "Propriedades",
      titles: [
        "ARQUITETURA CONTEMPORÂNEA",
        "A ARTE DE VIVER BEM NO CAMPO",
        "DESIGN E SOFISTICAÇÃO INTERIOR",
        "Detalhes que inspiram viver."
      ]
    },
    propTitles: ["Casas de Campo e Montanha", "Casas Urbanas", "Apartamentos", "Terrenos", "Comercial e Corporativo"],
    propPaths: ["/casadecampoemontanha", "/casasurbanas", "/apartamentos", "/casasdemontanha", "/comercialecorporativo"],
    about: { title: "SOBRE NÓS", stats: ["Anos de Mercado", "Em Vendas", "Foco em Luxo"] },
    section: { find: "Encontre sua próxima propriedade", details: "VER DETALHES" },
    footer: { rights: "© 2026 A Propriedade - Todos os direitos reservados" },
    whatsappCTA: "FALE CONOSCO"
  },
  'en': {
    nav: ["Home", "About Us", "Properties", "Contact", "Magazine"],
    hero: {
      label: "Properties",
      titles: [
        "CONTEMPORARY ARCHITECTURE",
        "THE ART OF COUNTRY LIVING",
        "INTERIOR DESIGN & SOPHISTICATION",
        "Details that inspire living."
      ]
    },
    propTitles: ["Country & Mountain Houses", "Urban Houses", "Apartments", "Land Plots", "Commercial & Corporate"],
    propPaths: ["/casadecampoemontanha", "/casasurbanas", "/apartamentos", "/casasdemontanha", "/comercialecorporativo"],
    about: { title: "ABOUT US", stats: ["Years in the Market", "in Sales", "Luxury Focus"] },
    section: { find: "Find your next property", details: "VIEW DETAILS" },
    footer: { rights: "© 2026 A Propriedade - All rights reserved" },
    whatsappCTA: "CONTACT US"
  }
};

const heroContent: { type: string; url: string; link: string; openId?: number }[] = [
  { type: 'image', url: "/hero/hero4.jpg", link: "/casasurbanas", openId: 1 },
  { type: 'image', url: "/hero/hero9.jpg", link: "/casadecampoemontanha" },
  { type: 'image', url: "/hero/hero1.jpg", link: "/casasurbanas" },
  { type: 'image', url: "/hero/hero12.jpg", link: "/casasurbanas" },
];

const instagramUrl = "https://www.instagram.com/apropriedadeimoveis?igsh=MTh3dDlqYmozdXQ3eA==";
const whatsappUrl = "https://wa.me/5519982828990";
const cyanBrand = "#49BFEA";

const menuRoutes = {
  "Início": "/", "Home": "/",
  "Sobre Nós": "#sobre", "About Us": "#sobre",
  "Magazine": "/magazinepage",
  "Propriedades": "#", "Properties": "#",
  "Contato": "#contato", "Contact": "#contato"
};

// --- COMPONENTE HEADER GLOBAL ---
const Header = ({ lang, setLang }: { lang: 'pt' | 'en'; setLang: (l: 'pt' | 'en') => void }) => {
  const t = translations[lang];
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobilePropOpen, setIsMobilePropOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    setIsMobileMenuOpen(false);
    if (path === "/") {
      if (location.pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (path === "#sobre") {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollToAbout: true } });
      } else {
        document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (path === "#contato") {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollToContact: true } });
      } else {
        document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (path === "whatsapp") {
      e.preventDefault();
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const normalizedQuery = normalizeText(searchQuery);
  const queryWords = normalizedQuery.split(' ').filter(Boolean);

  const matchedProperties: SearchProperty[] = queryWords.length
    ? searchProperties.filter((p) => {
        const haystack = normalizeText([
          p.title, p.titleEn, p.location, p.price, p.categoryLabel, p.categoryLabelEn,
          p.beds ? `${p.beds} quartos suites bedrooms suites` : '',
          p.baths ? `${p.baths} banheiros bathrooms` : '',
          p.cars ? `${p.cars} vagas garagem parking` : '',
          p.sold ? 'vendido sold' : ''
        ].join(' '));
        return queryWords.every((word) => haystack.includes(word));
      })
    : [];

  const matchedPages: SearchPage[] = queryWords.length
    ? searchPages.filter((page) => {
        const haystack = normalizeText([page.title, page.titleEn, page.subtitle, page.subtitleEn, page.keywords || ''].join(' '));
        return queryWords.every((word) => haystack.includes(word));
      })
    : [];

  const combinedResultsCount = matchedProperties.length + matchedPages.length;
  const quickCategories = t.propTitles.map((title, idx) => ({ title, path: t.propPaths[idx] }));
  const featuredProperties = searchProperties.filter((p) => !p.sold).slice(0, 3);

  const goToPage = (path: string, external?: boolean) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (external) {
      window.open(path, path.startsWith('mailto:') ? '_self' : '_blank', 'noopener,noreferrer');
      return;
    }
    if (path === '#sobre' || path === '#contato') {
      if (location.pathname !== '/') {
        navigate('/', { state: path === '#sobre' ? { scrollToAbout: true } : { scrollToContact: true } });
      } else {
        document.getElementById(path.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  const goToProperty = (prop: SearchProperty) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(prop.categoryPath, { state: { openId: prop.id } });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!combinedResultsCount) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveResultIndex((i) => (i + 1) % combinedResultsCount);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveResultIndex((i) => (i - 1 + combinedResultsCount) % combinedResultsCount);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeResultIndex < matchedProperties.length) {
        goToProperty(matchedProperties[activeResultIndex]);
      } else {
        const page = matchedPages[activeResultIndex - matchedProperties.length];
        if (page) goToPage(page.path, page.external);
      }
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const normalizedText = normalizeText(text);
    const idx = normalizedText.indexOf(normalizeText(query).split(' ')[0]);
    const wordLen = normalizeText(query).split(' ')[0].length;
    if (idx === -1 || wordLen === 0) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ color: cyanBrand }}>{text.slice(idx, idx + wordLen)}</span>
        {text.slice(idx + wordLen)}
      </>
    );
  };

  const pageIconMap: Record<SearchPage['icon'], typeof Home> = {
    home: Home, info: Info, building: Building2, mail: Mail, newspaper: Newspaper, shield: ShieldCheck, doc: FileText,
    whatsapp: MessageCircle, instagram: Instagram
  };

  return (
    <header className="bg-white pt-3 pb-3 border-b border-gray-100 relative z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center transition-all duration-500">

          {/* Esquerda: Menu Hambúrguer (Mobile) OU Botão "Pesquisar" (Desktop) */}
          <div className="flex-1 flex justify-start items-center gap-3">
            {/* Ícone Hambúrguer visível apenas no Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-900 p-1 focus:outline-none hover:opacity-70 transition-opacity"
              aria-label="Menu"
            >
              <Menu size={26} strokeWidth={1.2} />
            </button>

            {/* Botão de Pesquisa visível apenas no Desktop */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex border border-gray-700 px-3 sm:px-5 py-1.5 rounded-full text-[12px] tracking-widest uppercase hover:bg-gray-50 font-bold transition-all items-center gap-2"
            >
              <Search size={14} className="text-gray-700" />
              <span>{lang === 'pt' ? 'Pesquisar' : 'Search'}</span>
            </button>
          </div>

          {/* Centro: Logo Perfeitamente Centralizada */}
          <div className="flex-1 flex justify-center items-center pt-5">
            <Link to="/">
              <img
                src="/logo/title3.png"
                alt="A Propriedade"
                className={`w-auto cursor-pointer transition-all duration-500 ease-in-out transform scale-x-[1.15] sm:scale-x-100 ${isScrolled ? 'h-6 sm:h-8 lg:h-10' : 'h-8 sm:h-10 lg:h-12'
                  }`}
              />
            </Link>
          </div>

          {/* Direita: Lupa simples (Mobile) OU Redes e Idioma (Desktop) */}
          <div className="flex-1 flex justify-end items-center gap-3 sm:gap-5">
            {/* Ícone de Busca simples visível apenas no Mobile */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden text-gray-900 hover:opacity-70 transition-opacity p-1"
              aria-label={lang === 'en' ? 'Search' : 'Pesquisar'}
            >
              <Search size={22} strokeWidth={1.2} />
            </button>

            {/* Instagram e Idiomas visíveis apenas no Desktop */}
            <div className="hidden md:flex items-center gap-4 text-gray-600">
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="icon-tooltip-wrapper hover:text-black transition-colors">
                <Instagram size={20} strokeWidth={1.2} />
                <span className="icon-tooltip">Instagram</span>
              </a>
              <div className="flex gap-2 items-center border-l border-gray-400 pl-4">
                <button onClick={() => setLang('pt')} className={`${lang === 'pt' ? 'opacity-100' : 'opacity-40'} transition-opacity`}>
                  <img src="https://flagcdn.com/w40/br.png" className="w-5 sm:w-6" alt="PT" />
                </button>
                <button onClick={() => setLang('en')} className={`${lang === 'en' ? 'opacity-100' : 'opacity-40'} transition-opacity`}>
                  <img src="https://flagcdn.com/w40/us.png" className="w-5 sm:w-6" alt="EN" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navegação Desktop (Oculta em Mobile) */}
        <nav className="hidden md:flex justify-center items-center gap-8 lg:gap-12 py-1 mt-4 relative">
          {t.nav.map((item, i) => {
            const path = menuRoutes[item] || "#";
            const isPropItem = item === "Propriedades" || item === "Properties";
            const isScrollItem = path.startsWith('#');

            return (
              <div key={i} className="group flex flex-col items-center mt-2">
                {isScrollItem ? (
                  <a
                    href={path}
                    onClick={(e) => handleNavigation(e, path)}
                    className="relative text-[16px] font-bold tracking-[0.2em] uppercase text-gray-900 pb-2"
                  >
                    <span className="lang-fade-text">{item}</span>
                    <span className="absolute left-0 bottom-1 w-0 h-[1.5px] bg-gray-500 transition-all duration-500 ease-in-out group-hover:w-full"></span>
                  </a>
                ) : (
                  <Link
                    to={path === "#" || path === "whatsapp" ? "" : path}
                    onClick={(e) => handleNavigation(e, path)}
                    className="relative text-[16px] font-bold tracking-[0.2em] uppercase text-gray-900 pb-2"
                  >
                    <span className="lang-fade-text">{item}</span>
                    <span className="absolute left-0 bottom-1 w-0 h-[1.5px] bg-gray-500 transition-all duration-500 ease-in-out group-hover:w-full"></span>
                  </Link>
                )}

                {isPropItem && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-[100%] w-screen bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border-t border-gray-100 py-6 z-50 flex justify-center gap-10 shadow-sm">
                    {t.propTitles.map((title, idx) => (
                      <Link
                        key={idx}
                        to={t.propPaths[idx]}
                        className="relative text-[15px] font-bold tracking-[0.15em] uppercase text-gray-600 hover:text-black transition-colors pb-1 group/sub"
                      >
                        {title}
                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-black transition-all duration-500 ease-in-out group-hover/sub:w-full"></span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Menu Drawer Lateral Retrátil (Exclusivo Mobile) */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[120] flex md:hidden">
            {/* Backdrop escuro */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Painel da Esquerda */}
            <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl z-10 p-6 flex flex-col justify-between overflow-y-auto animate-fade-in">
              <div>
                {/* Botão X para fechar */}
                <div className="flex justify-start mb-8">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-900 hover:opacity-70 transition-opacity p-1"
                    aria-label={lang === 'en' ? 'Close Menu' : 'Fechar Menu'}
                  >
                    <X size={26} strokeWidth={1.2} />
                  </button>
                </div>

                {/* Links da Navegação Mobile */}
                <nav className="flex flex-col space-y-5">
                  {t.nav.map((item, i) => {
                    const path = menuRoutes[item] || "#";
                    const isPropItem = item === "Propriedades" || item === "Properties";
                    const isScrollItem = path.startsWith('#');

                    if (isPropItem) {
                      return (
                        <div key={i} className="flex flex-col">
                          <button
                            onClick={() => setIsMobilePropOpen(!isMobilePropOpen)}
                            className="flex justify-between items-center text-sm font-bold tracking-[0.15em] uppercase text-gray-900 py-1 hover:opacity-70 transition-opacity"
                          >
                            <span>{item}</span>
                            <span className="text-xs">{isMobilePropOpen ? '−' : '+'}</span>
                          </button>
                          {isMobilePropOpen && (
                            <div className="pl-4 flex flex-col space-y-3 py-2 border-l border-gray-200 mt-2">
                              {t.propTitles.map((title, idx) => (
                                <Link
                                  key={idx}
                                  to={t.propPaths[idx]}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="text-xs font-bold tracking-[0.1em] uppercase text-gray-600 hover:text-black transition-colors"
                                >
                                  <span className="lang-fade-text">{title}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return isScrollItem ? (
                      <a
                        key={i}
                        href={path}
                        onClick={(e) => {
                          handleNavigation(e, path);
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-sm font-bold tracking-[0.15em] uppercase text-gray-900 py-1 hover:opacity-70 transition-opacity"
                      >
                        <span className="lang-fade-text">{item}</span>
                      </a>
                    ) : (
                      <Link
                        key={i}
                        to={path === "#" || path === "whatsapp" ? "" : path}
                        onClick={(e) => {
                          handleNavigation(e, path);
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-sm font-bold tracking-[0.15em] uppercase text-gray-900 py-1 hover:opacity-70 transition-opacity"
                      >
                        <span className="lang-fade-text">{item}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Rodapé do Menu Mobile (Social e Idiomas) */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-8">
                <a href={instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-700 text-xs font-bold uppercase tracking-wider hover:text-black transition-colors">
                  <Instagram size={18} strokeWidth={1.5} /> Instagram
                </a>
                <div className="flex gap-3 items-center">
                  <button onClick={() => setLang('pt')} className={`${lang === 'pt' ? 'opacity-100' : 'opacity-40'} transition-opacity`}>
                    <img src="https://flagcdn.com/w40/br.png" className="w-5" alt="PT" />
                  </button>
                  <button onClick={() => setLang('en')} className={`${lang === 'en' ? 'opacity-100' : 'opacity-40'} transition-opacity`}>
                    <img src="https://flagcdn.com/w40/us.png" className="w-5" alt="EN" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE PESQUISA (Para Desktop e Mobile) */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white/98 backdrop-blur-md z-[100] flex flex-col p-4 sm:p-8 md:p-16 animate-fade-in overflow-y-auto">
          <div className="flex justify-end w-full">
            <button
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
              className="text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2 tracking-widest text-xs font-bold uppercase"
            >
              {lang === 'pt' ? 'Fechar' : 'Close'} <X size={20} />
            </button>
          </div>
          <div className="max-w-4xl w-full mx-auto mt-6 md:mt-14">
            <div className="relative">
              <Search size={24} strokeWidth={1.2} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setActiveResultIndex(0); }}
                onKeyDown={handleSearchKeyDown}
                placeholder={lang === 'pt' ? 'Busque por imóvel, cidade, característica ou página...' : 'Search for a property, city, feature or page...'}
                className="w-full bg-transparent border-b border-gray-900 py-3 md:py-4 pl-10 text-2xl sm:text-4xl font-extralight tracking-wide outline-none placeholder:text-gray-300 font-garamond"
              />
            </div>

            <div className="mt-8 md:mt-12 pb-8">
              {queryWords.length === 0 ? (
                <>
                  <p className="text-[11px] tracking-[0.3em] font-bold uppercase text-gray-400 mb-5">
                    {lang === 'pt' ? 'Categorias' : 'Categories'}
                  </p>
                  <div className="flex flex-wrap gap-3 mb-12">
                    {quickCategories.map((cat, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToPage(cat.path)}
                        className="border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all px-5 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] tracking-[0.3em] font-bold uppercase text-gray-400 mb-5">
                    {lang === 'pt' ? 'Imóveis em Destaque' : 'Featured Properties'}
                  </p>
                  <div className="grid sm:grid-cols-3 gap-5">
                    {featuredProperties.map((p) => (
                      <button key={`${p.categoryPath}-${p.id}`} onClick={() => goToProperty(p)} className="text-left group">
                        <div className="w-full aspect-[4/3] overflow-hidden rounded-sm mb-3 bg-gray-100">
                          <img
                            src={p.image}
                            alt={lang === 'en' ? p.titleEn : p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <p className="font-qlassy text-lg text-gray-800 leading-tight">{lang === 'en' ? p.titleEn : p.title}</p>
                        <p className="text-gray-400 text-xs font-garamond flex items-center gap-1 mt-1">
                          <MapPin size={12} />{p.location}
                        </p>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {matchedProperties.length > 0 && (
                    <div className="mb-10">
                      <p className="text-[11px] tracking-[0.3em] font-bold uppercase text-gray-400 mb-4">
                        {lang === 'pt' ? `Imóveis (${matchedProperties.length})` : `Properties (${matchedProperties.length})`}
                      </p>
                      <div className="flex flex-col gap-1">
                        {matchedProperties.map((p, idx) => {
                          const isActive = activeResultIndex === idx;
                          return (
                            <button
                              key={`${p.categoryPath}-${p.id}`}
                              onClick={() => goToProperty(p)}
                              onMouseEnter={() => setActiveResultIndex(idx)}
                              className={`flex items-center gap-4 p-3 rounded-sm transition-colors text-left ${isActive ? 'bg-gray-50' : ''}`}
                            >
                              <div className="w-16 h-16 rounded-sm overflow-hidden bg-gray-100 flex-shrink-0">
                                <img src={p.image} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-qlassy text-lg text-gray-800 truncate">
                                    {highlightMatch(lang === 'en' ? p.titleEn : p.title, searchQuery)}
                                  </p>
                                  {p.sold && (
                                    <span className="text-[9px] font-bold tracking-widest uppercase bg-gray-900 text-white px-2 py-0.5 rounded-full flex-shrink-0">
                                      {lang === 'pt' ? 'Vendido' : 'Sold'}
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-400 text-xs font-garamond flex items-center gap-3 mt-1 flex-wrap">
                                  <span className="flex items-center gap-1"><MapPin size={12} />{p.location}</span>
                                  <span>{p.price}</span>
                                  {p.beds && <span className="hidden md:flex items-center gap-1"><BedDouble size={12} />{p.beds}</span>}
                                  {p.baths && <span className="hidden md:flex items-center gap-1"><Bath size={12} />{p.baths}</span>}
                                  {p.cars && <span className="hidden md:flex items-center gap-1"><Car size={12} />{p.cars}</span>}
                                </p>
                              </div>
                              <ArrowUpRight
                                size={16}
                                className={`flex-shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                style={{ color: cyanBrand }}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {matchedPages.length > 0 && (
                    <div>
                      <p className="text-[11px] tracking-[0.3em] font-bold uppercase text-gray-400 mb-4">
                        {lang === 'pt' ? 'Páginas' : 'Pages'}
                      </p>
                      <div className="flex flex-col gap-1">
                        {matchedPages.map((page, idx) => {
                          const globalIdx = matchedProperties.length + idx;
                          const isActive = activeResultIndex === globalIdx;
                          const Icon = pageIconMap[page.icon];
                          return (
                            <button
                              key={page.path}
                              onClick={() => goToPage(page.path, page.external)}
                              onMouseEnter={() => setActiveResultIndex(globalIdx)}
                              className={`flex items-center gap-4 p-3 rounded-sm transition-colors text-left ${isActive ? 'bg-gray-50' : ''}`}
                            >
                              <div
                                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${cyanBrand}18`, color: cyanBrand }}
                              >
                                <Icon size={18} strokeWidth={1.5} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-qlassy text-lg text-gray-800">
                                  {highlightMatch(lang === 'en' ? page.titleEn : page.title, searchQuery)}
                                </p>
                                <p className="text-gray-400 text-xs font-garamond">{lang === 'en' ? page.subtitleEn : page.subtitle}</p>
                              </div>
                              <ArrowUpRight
                                size={16}
                                className={`flex-shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                style={{ color: cyanBrand }}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {combinedResultsCount === 0 && (
                    <p className="text-gray-500 font-garamond italic text-lg">
                      {lang === 'pt' ? 'Nenhum resultado encontrado para sua busca.' : 'No results found for your search.'}
                    </p>
                  )}
                </>
              )}
            </div>

            {combinedResultsCount > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-300 tracking-widest uppercase font-bold border-t border-gray-100 pt-4 pb-6">
                <CornerDownLeft size={12} /> {lang === 'pt' ? 'para selecionar' : 'to select'}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// --- COMPONENTE FOOTER ---
const Footer = ({ lang }: { lang: 'pt' | 'en' }) => {
  const t = translations[lang];
  const navigate = useNavigate();
  const location = useLocation();

  const [emailInput, setEmailInput] = useState('');
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSending, setIsSending] = useState(false);

  const FORMSPREE_ID = "";
  const USE_AUTOMATIC_SEND = false;

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    if (path === "/") {
      if (location.pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (path === "#sobre") {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollToAbout: true } });
      } else {
        document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (path === "#contato") {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollToContact: true } });
      } else {
        document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim() !== '') {
      setIsNewsletterOpen(true);
    }
  };

  const handleSendForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      // Usando a API do Web3Forms com a sua chave recém-gerada
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: '33855d52-3709-489d-aac6-fd0e32d1c9a3',
          subject: lang === 'pt' ? 'Nova Assinatura - Revista Digital' : 'New Subscription - Digital Magazine',
          from_name: 'A Propriedade - Site',
          name: formData.name,
          email: emailInput,
          phone: formData.phone,
          message: 'Novo pedido de assinatura da revista digital através do rodapé do site.'
        })
      });

      if (response.ok) {
        alert(lang === 'pt' ? 'Inscrição realizada com sucesso!' : 'Subscription successful!');
      } else {
        alert(lang === 'pt' ? 'Ocorreu um erro. Tente novamente.' : 'An error occurred. Please try again.');
      }
    } catch (error) {
      alert(lang === 'pt' ? 'Erro de conexão.' : 'Connection error.');
    } finally {
      setIsSending(false);
      setIsNewsletterOpen(false);
      setEmailInput('');
      setFormData({ name: '', phone: '' });
    }
  };

  return (
    <footer id="contato" className="bg-white pt-12 md:pt-16 pb-8 border-t border-gray-100 relative z-40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-8 md:gap-12 mb-12 md:mb-16 text-center md:text-left">

          <div className="col-span-2 lg:col-span-1 flex flex-col items-center md:items-start lg:pr-4 ">
            <img src="/logo/title3.png" alt="A Propriedade" className="h-7 md:h-8 mb-4" />
            <p className="text-gray-500 text-sm leading-relaxed font-garamond">
              {lang === 'pt'
                ? 'Propriedades extraordinárias, unindo arquitetura contemporânea e design de interiores em um só destino.'
                : 'Exclusive curation of the most extraordinary properties, uniting contemporary architecture and interior design in one destination.'}
            </p>
          </div>

          <div>
            <h4 className="text-[15px] font-bold text-black uppercase mb-4">Explore</h4>
            <ul className="flex flex-col items-center md:items-start space-y-2.5">
              {t.nav.map((item, i) => {
                const path = menuRoutes[item] || "#";
                return (
                  <li key={i} className="group w-fit">
                    <Link
                      to={path.startsWith('#') ? "/" : path}
                      onClick={(e) => handleNavigation(e, path)}
                      className="relative text-gray-500 hover:text-black transition-colors text-xs font-bold tracking-[0.1em] uppercase block pb-1"
                    >
                      <span className="lang-fade-text">{item}</span>
                      <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-black transition-all duration-500 ease-in-out group-hover:w-full"></span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="text-[15px] font-bold text-black uppercase mb-4">
              {lang === 'pt' ? 'Contato' : 'Contact'}
            </h4>
            <ul className="flex flex-col items-center md:items-start space-y-2.5 text-gray-500 text-sm font-garamond-raw">
              <li className="group w-fit">
                <a
                  href="mailto:andre@apropriedade.com.br"
                  className="icon-tooltip-wrapper relative text-gray-500 hover:text-black transition-colors block pb-1"
                >
                  <Mail size={18} strokeWidth={1.5} stroke="currentColor" />
                  <span className="icon-tooltip">{lang === 'pt' ? 'Enviar e-mail' : 'Send email'}</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-black transition-all duration-500 ease-in-out group-hover:w-full"></span>
                </a>
              </li>

              <li className="group w-fit">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-tooltip-wrapper relative text-gray-500 hover:text-black transition-colors block pb-1"
                >
                  <MessageCircle size={18} strokeWidth={1.5} stroke="currentColor" />
                  <span className="icon-tooltip">WhatsApp</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-black transition-all duration-500 ease-in-out group-hover:w-full"></span>
                </a>
              </li>

              <li className="group w-fit">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-tooltip-wrapper relative text-gray-500 hover:text-black transition-colors block pb-1"
                >
                  <Instagram size={18} strokeWidth={1.5} stroke="currentColor" />
                  <span className="icon-tooltip">Instagram</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-black transition-all duration-500 ease-in-out group-hover:w-full"></span>
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-[15px] font-bold text-black uppercase mb-4">Newsletter</h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 md:mb-4 font-garamond text-balance max-w-[280px] mx-auto md:max-w-none md:mx-0">
              {lang === 'pt'
                ? 'Assine para receber nossa revista digital e lançamentos em primeira mão.'
                : 'Subscribe to receive our digital magazine and be the first to know about new listings.'}
            </p>
            <form onSubmit={handleOpenNewsletter} className="flex items-center w-full max-w-[280px] mx-auto md:max-w-none md:mx-0 border-b border-gray-300 focus-within:border-black transition-colors pb-1 group">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={lang === 'pt' ? 'Seu endereço de e-mail' : 'Your email address'}
                className="w-full outline-none text-base md:text-xs font-garamond text-gray-800 bg-transparent placeholder:text-gray-400"
              />
              <button type="submit" className="text-gray-400 group-hover:text-black transition-colors p-1">
                <ArrowUpRight size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-[9px] text-gray-400 uppercase font-bold ">
            {t.footer.rights}
          </p>
          <div className="flex gap-4 text-[10px] tracking-[0.2em] text-gray-400 uppercase font-bold">
            <Link to="/politica-de-privacidade" className="hover:text-black transition-colors">
              {lang === 'pt' ? 'Política de Privacidade' : 'Privacy Policy'}
            </Link>
            <Link to="/termos-de-uso" className="hover:text-black transition-colors">
              {lang === 'pt' ? 'Termos de Uso' : 'Terms of Use'}
            </Link>
          </div>
        </div>
      </div>

      {/* MODAL DO FORMULÁRIO */}
      {isNewsletterOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 md:p-8 rounded-none shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setIsNewsletterOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-qlassy text-black mb-2 uppercase tracking-wide">
              {lang === 'pt' ? 'Receber Revista Digital' : 'Receive Digital Magazine'}
            </h3>
            <p className="text-gray-500 font-garamond text-sm mb-6 leading-relaxed">
              {lang === 'pt'
                ? 'Por favor, preencha seus dados abaixo para completar sua assinatura.'
                : 'Please fill in your details below to complete your subscription.'}
            </p>
            <form onSubmit={handleSendForm} className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{lang === 'pt' ? 'Nome Completo' : 'Full Name'}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-b border-gray-300 py-2 text-sm font-garamond text-gray-800 focus:border-black outline-none transition-colors bg-transparent"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">E-mail</label>
                <input
                  type="email"
                  disabled
                  value={emailInput}
                  className="w-full border-b border-gray-200 py-2 text-sm font-garamond text-gray-400 outline-none bg-transparent cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{lang === 'pt' ? 'Telefone / WhatsApp' : 'Phone / WhatsApp'}</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="w-full border-b border-gray-300 py-2 text-sm font-garamond text-gray-800 focus:border-black outline-none transition-colors bg-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={isSending}
                className="w-full mt-4 bg-black text-white py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:bg-gray-400"
              >
                {isSending ? (lang === 'pt' ? 'ENVIANDO...' : 'SENDING...') : (lang === 'pt' ? 'CONCLUIR E ENVIAR' : 'COMPLETE AND SEND')}
              </button>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
};

// --- COMPONENTES AUXILIARES ---
const Counter = ({ end }: { end: number }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setIsVisible(true));
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const timer = setInterval(() => {
      start += end / 100;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [isVisible, end]);
  return <span ref={ref}>{count}</span>;
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`${className} transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {children}
    </div>
  );
};

// --- HERO INTEGRADO ---
const IntegratedHero = ({ lang }: { lang: 'pt' | 'en' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const t = translations[lang];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroContent.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const getAnimationClass = (index: number) => {
    const internalIdx = index % 4;
    if (internalIdx === 0) return 'animate-local-zoom-in';
    if (internalIdx === 1) return 'animate-local-zoom-out';
    if (internalIdx === 2) return 'animate-local-pan-left';
    return 'animate-local-pan-right';
  };

  return (
    <section className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden bg-black">
      {heroContent.map((item, index) => {
        const isCurrent = index === currentIndex;
        const titleList = t.hero.titles;
        const currentTitle = titleList[index % titleList.length];

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[2500ms] ease-in-out ${isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <img
              src={item.url}
              className={`w-full h-full object-cover opacity-65 ${getAnimationClass(index)}`}
              alt="Refúgio Exclusivo"
              style={{ animationDuration: '6s' }} /* 👈 ADICIONE ESSA LINHA AQUI */
            />

            <div className={`absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-16 z-20 transition-opacity duration-1000 ${isCurrent ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {isCurrent && (
                <Reveal key={`text-${currentIndex}-${lang}`} delay={400}>
                  <p className="text-white text-[11px] tracking-[0.4em] uppercase font-bold mb-2 opacity-80 font-heading">
                    {t.hero.label}
                  </p>
                  <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-extralight max-w-2xl leading-tight mb-4 md:mb-6 font-qlassy uppercase">
                    {currentTitle}
                  </h2>
                  <button
                    type="button"
                    onClick={() => navigate(item.link, item.openId ? { state: { openId: item.openId } } : undefined)}
                    className="border border-white text-white px-5 py-2 rounded-full text-[11px] tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300">
                    {lang === 'pt' ? 'SAIBA MAIS' : 'LEARN MORE'}
                  </button>
                </Reveal>
              )}
            </div>
          </div>
        );
      })}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none z-15"></div>
    </section>
  );
};

// --- PAGINA PRINCIPAL (HOMEPAGE) ---
const HomePage = ({ lang }: { lang: 'pt' | 'en' }) => {
  const t = translations[lang];
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      if (location.state?.scrollToAbout) {
        setTimeout(() => {
          document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' });
          window.history.replaceState({}, document.title);
        }, 100);
      } else if (location.state?.scrollToContact) {
        setTimeout(() => {
          document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
          window.history.replaceState({}, document.title);
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white selection:bg-[#49BFEA] selection:text-white">
      <IntegratedHero lang={lang} />

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center gap-2.5 w-11 h-11 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 border border-black/10 bg-white/50 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.06)] group hover:bg-black/50 hover:border-black/50 transition-all duration-300"
      >
        <MessageCircle
          size={18}
          strokeWidth={1.5}
          className="text-black group-hover:text-white transition-colors"
        />
        <span className="hidden sm:inline text-black text-[11px] font-medium tracking-[0.2em] uppercase group-hover:text-white transition-colors">
          {t.whatsappCTA || 'FALE CONOSCO'}
        </span>
      </a>

      <section id="sobre" className="py-16 md:py-20 bg-[#f8f8f8] w-full px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch mb-16 md:mb-24">
            <div className="w-full h-full min-h-[350px] sm:min-h-[400px] lg:min-h-[60vh]">
              <Reveal className="h-full">
                <div className="relative w-full h-full">
                  <img
                    src="/sobre/sobre-nos.jpg"
                    className="relative z-10 w-full h-full object-cover rounded-none shadow-xl"
                    alt="Sobre André Rodrigues"
                  />
                </div>
              </Reveal>
            </div>

            <div className="w-full space-y-5 md:space-y-6 flex flex-col justify-center lg:pr-6">
              <Reveal delay={200}>
                <h3 className="text-3xl font-qlassy text-[#1A1A1A]">
                  {t.about.title}
                </h3>
              </Reveal>

              <Reveal delay={400}>
                <div className="text-justify space-y-4 text-base text-gray-600 font-garamond leading-relaxed">
                  {lang === 'pt' ? (
                    <>
                      <p>A Propriedade foi criada com a ideia de ser um destino definitivo para imóveis de luxo, de maneira simplificada, tornando a experiência do cliente dinâmica e inesquecível. Apesar de parecer uma empresa jovem, criada em 2022, nosso founder e head da operação, André Rodrigues, já atuava como corretor de imóveis desde 2014 no mercado de alto padrão de lançamento e prontos, na renomada imobiliária Lopes, onde desenvolveu experiências e ferramentas que moldaram sua visão desse setor tão exigente, que demanda muita efetividade, conhecimento e organização.</p>
                      <p>O nome foi batizado no sentido literal da palavra - A Propriedade, com o intuito de considerar cada propriedade como única, no singular, de modo a desenvolver um trabalho especial e atraente que se destaque dos demais imóveis do mercado. Para isso, A Propriedade aplica técnicas e posicionamentos que dão ao imóvel alta visibilidade, através da inclusão de fotografias profissionais de alta qualidade de resolução, e filmes com técnicas cinematográficas. Assim, nossos clientes têm a possibilidade de uma imersão completa antes mesmo de visitarem o imóvel desejado.</p>
                      <p>Estamos presentes todos os dias da semana, sempre prontos para tornar a experiência do cliente inesquecível. Entendemos a mentalidade do cliente de alta renda e sabemos onde e como querem estar. Seja nas grandes cidades, no interior, no campo ou no litoral, o que há de mais recente em propriedades de luxo, selecionadas com critérios que valorizam a aquisição sempre com muita ética, cumprimento dos deveres legais e transparência.</p>
                    </>
                  ) : (
                    <>
                      <p>A Propriedade was created to be a definitive destination for luxury real estate, simplifying the process and making the client experience dynamic and unforgettable. Although founded in 2022, our founder and operation head, André Rodrigues, has been active as a real estate broker since 2014 in the high-end market for new and ready-to-move-in properties at the renowned Lopes real estate agency, where he developed experiences and tools that shaped his vision of this demanding sector, which requires great effectiveness, knowledge, and organization.</p>
                      <p>The name was chosen in the literal sense of the word - A Propriedade (The Property), with the aim of considering each property as unique, in the singular, in order to develop special and attractive work that stands out from other properties on the market. To achieve this, A Propriedade applies techniques and positioning that give the property high visibility, through the inclusion of high-resolution professional photography and films with cinematographic techniques. Thus, our clients have the possibility of complete immersion even before visiting the desired property.</p>
                      <p>We are present every day of the week, always ready to make the client's experience unforgettable. We understand the mindset of high-income clients and know where and how they want to be. Whether in major cities, the countryside, or the coast, we select the latest in luxury properties with criteria that always value acquisition with great ethics, compliance with legal duties, and transparency.</p>
                    </>
                  )}
                </div>
              </Reveal>
            </div>
          </div>

          <div className="pt-12 border-t border-black/10 w-full">
            <Reveal delay={500} className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="font-qlassy text-3xl sm:text-4xl md:text-5xl leading-none tracking-tighter">+<Counter end={12} /></p>
                <p className="font-['HeadingNow',sans-serif] text-[13px] sm:text-[15px] md:text-[17px] uppercase tracking-widest leading-tight text-black mt-3 flex items-center justify-center text-center min-h-[2.5em] md:block md:min-h-0">{t.about.stats[0]}</p>
              </div>
              <div>
                <p className="font-qlassy text-3xl sm:text-4xl md:text-5xl leading-none tracking-tighter" style={{ color: cyanBrand }}>
                  +<Counter end={30} />mi
                </p>
                <p className="font-['HeadingNow',sans-serif] text-[13px] sm:text-[15px] md:text-[17px] uppercase tracking-widest leading-tight text-black mt-3 flex items-center justify-center text-center min-h-[2.5em] md:block md:min-h-0">{t.about.stats[1]}</p>
              </div>
              <div>
                <p className="font-qlassy text-3xl sm:text-4xl md:text-5xl leading-none tracking-tighter"><Counter end={100} />%</p>
                <p className="font-['HeadingNow',sans-serif] text-[13px] sm:text-[15px] md:text-[17px] uppercase tracking-widest leading-tight text-black mt-3 flex items-center justify-center text-center min-h-[2.5em] md:block md:min-h-0">
                  {lang === 'pt' ? 'Foco em Luxo' : 'Luxury Focus'}
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full mb-24 pt-24">
          <div className="w-full flex flex-col justify-center">
            <Reveal className="space-y-6">
              <h2 className="text-4xl font-qlassy text-[#1A1A1A]/80 leading-[1.15] tracking-tight max-w-full">
                {lang === 'pt' ? (
                  <>A Propriedade Celebra Um Design Extraordinário Para Uma Comunidade Inspirada.</>
                ) : (
                  <>A Propriedade Celebrates Extraordinary Design For An Inspired Community.</>
                )}
              </h2>
              <p className="text-lg text-[#1A1A1A]/70 font-garamond max-w-xl leading-relaxed">
                {lang === 'pt' ? (
                  <>Promovendo o design autêntico por meio da publicação impressa A Propriedade, publicação digital, conteúdo em vídeo e canais de redes sociais, nossa missão é destacar e apoiar a comunidade local de design.</>
                ) : (
                  <>Promoting authentic design through A Propriedade print publication, digital publication, video content, and social media channels, our mission is to highlight and support the local design community.</>
                )}
              </p>
            </Reveal>
          </div>

          <div className="w-full h-full min-h-[300px] lg:min-h-[50vh] flex items-center">
            <Reveal delay={200} className="w-full h-full">
              <img
                src="/categorias/casas_urbanas/duasMarias/45.jpg"
                className="w-full h-full max-h-[60vh] object-cover rounded-none shadow-lg"
                alt="A Propriedade Panorama"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* O FOOTER AGORA ESTÁ AQUI DENTRO, DISPONÍVEL APENAS NA PÁGINA PRINCIPAL */}
      <Footer lang={lang} />
    </div>
  );
};

// --- ROTEADOR PRINCIPAL (APP) ---
const LANG_FADE_MS = 220;

export default function App() {
  const [lang, setLang] = useState<'pt' | 'en'>((localStorage.getItem('language') as 'pt' | 'en') || 'pt');
  const [isLangFading, setIsLangFading] = useState(false);
  const pendingLangRef = useRef<'pt' | 'en' | null>(null);

  // Troca apenas o TEXTO com fade (o CSS abaixo só atinge títulos/parágrafos/spans/labels,
  // nunca <img>), esperando o fade-out terminar antes de trocar o conteúdo, para não "pular".
  const changeLang = (newLang: 'pt' | 'en') => {
    if (newLang === lang || pendingLangRef.current) return;
    pendingLangRef.current = newLang;
    setIsLangFading(true);
    window.setTimeout(() => {
      const next = pendingLangRef.current;
      if (!next) return;
      pendingLangRef.current = null;
      setLang(next);
      localStorage.setItem('language', next);
      window.dispatchEvent(new Event('languageChange'));
      requestAnimationFrame(() => setIsLangFading(false));
    }, LANG_FADE_MS);
  };

  return (
    <Router>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap');
          
          @font-face { 
            font-family: 'Qlassy'; 
            src: url('/fonts/Qlassy.ttf') format('truetype'); 
            font-display: swap;
          }
          
          @font-face { 
            font-family: 'NeueHelvetica'; 
            src: url('/fonts/helvetica-condensed.ttf') format('truetype'); 
            font-display: swap;
          }

          @font-face { 
            font-family: 'HeadingNow'; 
            src: url('/fonts/HeadingNowTrial-43Book.ttf') format('truetype'); 
            font-display: swap;
          }

          .font-qlassy { font-family: 'Qlassy', serif !important; }
          .font-garamond { font-family: 'EB Garamond', serif !important; }
          .font-garamond-raw { font-family: 'EB Garamond', serif !important; }

          h1, h2, h3, .font-qlassy { 
            font-family: 'Qlassy', serif !important; 
          }

          .container-sobre-texto p { 
            font-family: 'EB Garamond', serif !important; 
            font-size: 1.1rem !important; 
            color: #555555 !important;
            line-height: 1.65 !important;
          }

          nav a, button, a, .tracking-widest { 
            font-family: 'HeadingNow', sans-serif !important; 
          }

          .font-garamond-raw, .font-garamond-raw a {
            font-family: 'EB Garamond', serif !important;
            text-transform: none !important;
            letter-spacing: normal !important;
          }

          .icon-tooltip-wrapper { position: relative; display: inline-flex; align-items: center; justify-content: center; }
          .icon-tooltip { position: absolute; left: 50%; bottom: calc(100% + 8px); transform: translateX(-50%) translateY(4px); background: #1a1a1a; color: white; padding: 6px 9px; border-radius: 3px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif !important; font-size: 10px; text-transform: none !important; letter-spacing: normal !important; line-height: 1.2; white-space: nowrap; opacity: 0; visibility: hidden; pointer-events: none; transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease; z-index: 50; box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
          .icon-tooltip-wrapper:hover .icon-tooltip { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }

          @keyframes localZoomIn {
            0% { transform: scale(1.02); }
            100% { transform: scale(1.10); }
          }
          .animate-local-zoom-in {
            animation: localZoomIn 24s infinite alternate ease-in-out;
          }

          @keyframes localZoomOut {
            0% { transform: scale(1.10); }
            100% { transform: scale(1.02); }
          }
          .animate-local-zoom-out {
            animation: localZoomOut 24s infinite alternate ease-in-out;
          }

          @keyframes localPanLeft {
            0% { transform: scale(1.08) translateX(1%); }
            100% { transform: scale(1.08) translateX(-1%); }
          }
          .animate-local-pan-left {
            animation: localPanLeft 24s infinite alternate ease-in-out;
          }

          @keyframes localPanRight {
            0% { transform: scale(1.08) translateX(-1%); }
            100% { transform: scale(1.08) translateX(1%); }
          }
          .animate-local-pan-right {
            animation: localPanRight 24s infinite alternate ease-in-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }

          /* Troca de idioma: só o TEXTO recebe fade, imagens/ícones nunca são afetados */
          h1, h2, h3, h4, h5, h6, p, span, label, .lang-fade-text {
            transition: opacity ${LANG_FADE_MS}ms ease;
          }
          .lang-fading h1, .lang-fading h2, .lang-fading h3, .lang-fading h4, .lang-fading h5, .lang-fading h6,
          .lang-fading p, .lang-fading span, .lang-fading label, .lang-fading .lang-fade-text {
            opacity: 0;
          }
        `}} />

      {/* O Header continua aqui fora, logo, ele é exibido fixamente em todas as rotas */}
      <div className={isLangFading ? 'lang-fading' : ''}>
        <Header lang={lang} setLang={changeLang} />

        <Routes>
          <Route path="/" element={<HomePage lang={lang} />} />
          <Route path="/magazinepage" element={<MagazinePage />} />
          <Route path="/casadecampoemontanha" element={<CasadeCampoeMontanha />} />
          <Route path="/casasurbanas" element={<CasasUrbanas />} />
          <Route path="/casasdemontanha" element={<Montanha />} />
          <Route path="/apartamentos" element={<Apartamentos />} />
          <Route path="/comercialecorporativo" element={<ComercialECorporativo />} />

          <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/termos-de-uso" element={<TermosUso />} />
        </Routes>
      </div>
    </Router>
  );
}
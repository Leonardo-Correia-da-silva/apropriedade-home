import React, { useEffect, useState, memo } from 'react';
import { usePropertyRoute } from './usePropertyRoute';
import { DealChooser, DealToggle, DealComingSoon } from './DealChooser';
import { gallery } from './galleries';
import Img from './Img';
import {
  Home,
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
  price?: string; // valor de venda (sem ele, o imóvel não aparece em "Comprar")
  rentPrice?: string; // aluguel por mês (com ele, o imóvel aparece em "Alugar")
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
    rentValue: "Valor de Locação",
    perMonth: "/mês",
    overview: "Visão Geral",
    features: "Características"
  },
  en: {
    segmentTitle: "Urban Houses",
    back: "BACK",
    details: "VIEW DETAILS",
    value: "Value",
    rentValue: "Monthly Rent",
    perMonth: "/month",
    overview: "Overview",
    features: "Features"
  }
};

export default function Urbanas() {
  const cyanBase = "#00B6E3";
  const [isLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

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
  }, [isLightboxOpen, lightboxIndex]);

  const t = translations[lang];

  const properties: PropertyListItem[] = [
    {
      id: 1,
      title: "Alphaville Campinas",
      titleEn: "Alphaville Campinas",
      location: "Campinas, SP",
      price: "R$ 22.900.000,00",
      images: [
        "/categorias/casas_urbanas/neoclassica-alphavile/capa1.jpg",
        "/categorias/casas_urbanas/neoclassica-alphavile/capa2.jpg",
        "/categorias/casas_urbanas/neoclassica-alphavile/capa3.jpg",
        "/categorias/casas_urbanas/neoclassica-alphavile/capa4.jpg",
        "/categorias/casas_urbanas/neoclassica-alphavile/capa5.jpg",
        "/categorias/casas_urbanas/neoclassica-alphavile/capa6.jpg"
      ],
      gallery: gallery("casas_urbanas/neoclassica-alphavile/fotos-mansao-neoclassica"),
      specs: { beds: 5, baths: 7, cars: 6, builtArea: "1.280m²", totalArea: "3.840m²" },
      description: "Mansão com arquitetura neoclássica disponível para venda no renomado condomínio clube Alphaville Campinas. Térrea, é destaque no residencial pela sua imponência, que impõe presença marcante e desperta admiração.\n\nIntegração dos ambientes, salas de estar para sete ambientes, cozinha com ilha central, espaço gourmet independente e conectado ao quintal. Piscina com hidromassagem e tratamento de ozônio, ideal para aquele relaxamento após um dia longo de trabalho. Academia e sala para massagem ou beauty care, home TV independente com sistema de som profissional, escritório amplo com total privacidade. Luz e ventilação naturais abundam em todos os ambientes, que possuem pé-direito alto. A área íntima contempla quatro amplas suítes, e os pisos receberam aquecimento controlado eletronicamente. A suíte principal conta com dois closets e banheiros separados, e se encontram em uma bela banheira de imersão - um spa dentro da suíte.\n\nDependência de empregada, despensa grande, quintal gramado espaçoso para recreação, praça externa italiana com fonte e paisagismo que acolhe.\n\nO terreno é bem amplo, um dos maiores do condomínio, e conta no fundo dele com um bosque privativo, onde não é permitido construção, mas sim contemplação. Lá de cima, é possível avistar os prédios da cidade, e assistir a uma bela paisagem.\n\nO condomínio Alphaville Campinas oferece uma gama completa de lazer, contando com quadras de tênis, futebol, academia ampla, salão de festas, playground, piscinas adulto e infantil, pista de caminhada e lagos. A segurança opera com portaria 24 horas, monitoramento por câmeras e ronda, além de total controle de acesso de moradores, visitantes e prestadores de serviços. Super bem localizado, fica às margens da rodovia SP-340 (Mogi-Campinas), e se conecta rapidamente aos principais shoppings da cidade e à rodovia Dom Pedro. Além disso, o residencial está ao lado do Alphaville Comercial, que oferece diversos serviços diariamente, como farmácia, banco, padaria, mercados, posto de combustível, salão de beleza e muito mais!",
      descriptionEn: "Mansion with neoclassical architecture available for sale in the renowned Alphaville Campinas club condominium. Single-story, it stands out in the community for its grandeur, which commands a striking presence and inspires admiration.\n\nIntegrated spaces, living rooms with seven areas, a kitchen with a central island, and an independent gourmet area connected to the backyard. A pool with hydromassage and ozone treatment, ideal for relaxing after a long day of work. Gym and a room for massage or beauty care, an independent home theater with a professional sound system, and a spacious office with complete privacy. Natural light and ventilation abound in every room, all with high ceilings. The private wing includes four spacious suites, and the floors feature electronically controlled heating. The master suite has two closets and separate bathrooms, which meet at a beautiful soaking tub - a spa within the suite.\n\nStaff quarters, a large pantry, a spacious lawn for recreation, an Italian-style outdoor plaza with a fountain, and welcoming landscaping.\n\nThe lot is very large, one of the biggest in the condominium, and at its rear there is a private woodland where building is not permitted - only contemplation. From up there, you can see the city's buildings and enjoy a beautiful view.\n\nThe Alphaville Campinas condominium offers a complete range of amenities, including tennis courts, soccer fields, a large gym, party hall, playground, adult and children's pools, a walking track, and lakes. Security operates with a 24-hour gatehouse, camera monitoring, and patrols, as well as full access control for residents, visitors, and service providers. Very well located, it sits along the SP-340 highway (Mogi-Campinas) and connects quickly to the city's main shopping malls and to the Dom Pedro highway. In addition, the community is next to Alphaville Comercial, which offers a variety of daily services, such as a pharmacy, bank, bakery, supermarkets, gas station, beauty salon, and much more!"
    },
    {
      id: 2,
      title: "Condomínio Fazenda Duas Marias Jaguariúna",
      titleEn: "Fazenda Duas Marias Condominium, Jaguariúna",
      location: "Jaguariúna, SP",
      price: "R$ 14.980.000,00",
      images: [
        "/categorias/casas_urbanas/duasMarias/45.jpg",
        "/categorias/casas_urbanas/duasMarias/37.jpg",
        "/categorias/casas_urbanas/duasMarias/39.jpg",
        "/categorias/casas_urbanas/duasMarias/27.jpg",
        "/categorias/casas_urbanas/duasMarias/52.jpg",
        "/categorias/casas_urbanas/duasMarias/56.jpg",
      ],
      gallery: gallery("casas_urbanas/duasMarias"),
      specs: { beds: 6, baths: 10, cars: 8, builtArea: "850m²", totalArea: "10.004m²" },
      description: "Casa localizada no condomínio fechado Fazenda Duas Marias, na cidade de Jaguariúna, interior de São Paulo, a aproximadamente 01h40 da capital. Conta com segurança profissional 24 horas, ronda e controle de acesso.\n\nDistribuída em blocos, oferece casa principal com seis dormitórios, sendo um de serviço, amplo living com pé-direito alto, cozinha com fogão assinado pela renomada Oficina Victorello, sala de TV independente, escritório, despensa, lavanderia, varanda social, piscina aquecida com iluminação, Spa e prainha, rodeada pelo solarium para um belo banho de sol. As suítes da casa principal e a sala de estar contam com piso aquecido eletronicamente, além de oferecer sistema de aspiração central. Casa automatizada com sistema Alexa.\n\nDuas garagens, sendo uma delas climatizada com mini-oficina para vários veículos, fogo de chão (firepit), rooftop em deck de madeira com vista panorâmica, lago ornamental cristalino para mergulho com peixes e tratamento de ozônio, salão de jogos climatizado, equipado e decorado, campo de futebol com grama especial e sistema de drenagem, vestiário com armários, banheiro e chuveiros, academia e sauna. Sistema de geração de energia fotovoltaica, irrigação, captação de água por cisterna e poço artesiano.\n\nO salão de festas gourmet, que fica no centro do terreno, tem mais de 130 m² de área, climatizado, lavabo, churrasqueiras a gás e carvão, sistema de som ambiente, bar, integração total com o quintal e paisagismo. Ideal para suas festas em família e amigos, isolada da casa principal, sem abrir mão da sua privacidade. O paisagismo assinado por Marcelo Novaes, conta com diversas espécies de plantas e árvores maduras adultas, como o pau-brasil que fica no jardim principal de boas-vindas. A parte mais densa do jardim guia, através de uma mini-trilha, aos redários acolhidos sob as imensas árvores adultas. No topo do terreno, horta, espaço zen, casa de árvore de madeira especial e o acesso social.",
      descriptionEn: "House located in the Fazenda Duas Marias gated community, in the city of Jaguariúna, in the countryside of São Paulo, approximately 1 hour and 40 minutes from the capital. It has 24-hour professional security, patrols, and access control.\n\nDistributed in separate blocks, it offers a main house with six bedrooms, one of them for staff, a spacious living room with high ceilings, a kitchen with a stove by the renowned Oficina Victorello, an independent TV room, office, pantry, laundry room, social veranda, and a heated pool with lighting, spa, and a shallow beach area, surrounded by a solarium for sunbathing. The suites of the main house and the living room feature electronically heated floors, as well as a central vacuum system. The house is automated with an Alexa system.\n\nTwo garages, one of them climate-controlled with a mini workshop for several vehicles, a firepit, a wooden-deck rooftop with panoramic views, a crystal-clear ornamental lake for swimming with fish and ozone treatment, a climate-controlled, fully equipped and decorated game room, a soccer field with special grass and a drainage system, a locker room with lockers, bathroom and showers, a gym, and a sauna. Photovoltaic power generation system, irrigation, cistern water collection, and an artesian well.\n\nThe gourmet party hall, located at the center of the lot, has more than 130 m², air conditioning, a powder room, gas and charcoal grills, an ambient sound system, a bar, and full integration with the backyard and landscaping. Ideal for parties with family and friends, set apart from the main house without giving up your privacy. The landscaping, designed by Marcelo Novaes, features a wide variety of plants and mature trees, such as the brazilwood tree in the main welcome garden. The densest part of the garden leads, through a small trail, to hammock areas sheltered beneath the immense mature trees. At the top of the lot are a vegetable garden, a zen space, a tree house made of special wood, and the main entrance."
    },
    {
      id: 5,
      title: "Condomínio Monte Sankhya",
      titleEn: "Monte Sankhya Condominium",
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
      gallery: gallery("casas_urbanas/serranegra"),
      specs: { beds: 4, baths: 5, cars: 4, builtArea: "400m²", totalArea: "2.600m²" },
      description: "Com quatro suítes confortáveis com armários, sendo a principal com closet grande, esta casa de montanha dentro de condomínio fechado possui ampla varanda que integra duas das suítes, com vista para as montanhas. A sala de estar com vários ambientes possui sala de lareira, estar e TV.\n\nA cozinha foi alocada em um espaço externo ao da casa principal, mas facilmente acessada. Foi onde os proprietários destinaram para receber familiares e amigos, aproveitando o prestígio das belas paisagens e vistas de tirar o fôlego de qualquer canto do ambiente. Fogão à lenha, churrasqueira, ilha central grande, sala de TV integrada para apoio aos eventos, sala de jogos, lavabo e sala de jantar. Com teto revestido de madeira e iluminação projetada, é o ponto mais utilizado da casa.\n\nO quintal é muito espaçoso e com vários níveis de topografia, devido a tipologia do terreno. Jardins e plantas compõem o quintal, que o convida para o descanso e apreciação da natureza. No nível mais baixo utilizado do terreno, há a área de lazer externa, com ampla piscina, solarium e pergolado.\n\nO condomínio oferece portaria com controle de acesso, sistema de câmeras, área de lazer com quadra, campo de futebol, salão de festas, jogos, biblioteca, mirante.",
      descriptionEn: "With four comfortable suites with built-in closets, the master featuring a large walk-in closet, this mountain house in a gated community has a wide veranda connecting two of the suites, with views of the mountains. The living room has several areas, including a fireplace room, a lounge, and a TV room.\n\nThe kitchen was placed in a space separate from the main house, but easily accessible. This is where the owners chose to host family and friends, taking advantage of the beautiful landscapes and breathtaking views from every corner of the space. Wood-burning stove, barbecue grill, a large central island, an integrated TV room to support gatherings, a game room, powder room, and dining room. With a wood-paneled ceiling and designed lighting, it is the most used area of the house.\n\nThe backyard is very spacious and has several levels due to the topography of the lot. Gardens and plants make up the backyard, inviting you to rest and enjoy nature. On the lowest level in use, there is the outdoor leisure area, with a large pool, solarium, and pergola.\n\nThe condominium offers a gatehouse with access control, a camera system, and a leisure area with a sports court, soccer field, party hall, game room, library, and lookout point."
    },
    {
      id: 6,
      title: "Casa no Bairro Cidade Jardim",
      titleEn: "House in the Cidade Jardim Neighborhood",
      location: "São Paulo, SP",
      price: "R$ 17.990.000,00",
      images: [
        "/categorias/casas_urbanas/cidade-jardim/16.jpg",
        "/categorias/casas_urbanas/cidade-jardim/7.jpg",
        "/categorias/casas_urbanas/cidade-jardim/2.jpg",
        "/categorias/casas_urbanas/cidade-jardim/1.jpg",
        "/categorias/casas_urbanas/cidade-jardim/8.jpg",
        "/categorias/casas_urbanas/cidade-jardim/45.jpg",
      ],
      gallery: gallery("casas_urbanas/cidade-jardim"),
      specs: { beds: 5, baths: 6, cars: 3, builtArea: "641m²", totalArea: "550m²" },
      description: "Casa Moderna recém construída (2024) disponível para venda em dos melhores bairros de São Paulo - o Cidade Jardim. Assinada por renomado escritório de arquitetura, que priorizou a integração dos ambientes, que foram preenchidos por uma paleta de cores suaves, claras e acolhedoras, cheios de muita luz e ventilação naturais. Materiais naturais, como a pedra, mármore e madeira, com destaque para a lareira na sala de estar, com pedras naturais nobres geometricamente assentadas.\n\nA cozinha com ilha central, fogão italiano e marcenaria sob medida em tom verde musgo, pode ser integrada ou isolada das salas de jantar e estar, através de painéis de madeira e vidro que se movimentam de um lado ao outro, instalados do chão ao teto, formando uma eclusa na cozinha, sem perder a visibilidade, além de dar um tom charmoso e sofisticado ao ambiente.\n\nPlanta inteligente, ambientes integrados, muita luz e ventilação naturais, distribuída em três pavimentos: garagem, academia, sauna, escritório e suíte de serviço, segundo pavimento com uma suíte, sala de TV independente, bar, lavabo, cozinha com ilha central integrada com o living, que também é integrado com o quintal privativo com piscina, espaço gourmet com churrasqueira, jardim, redário, e terceiro pavimento com três suítes, hall íntimo e biblioteca.\n\nEscritório, academia e estúdio, núcleo de serviços com dormitório, bar, home theater, espaço gourmet com churrasqueira, piscina e solarium. Um verdadeiro refúgio contemporâneo dentro da maior cidade da América Latina, a pouquíssimos minutos dos shoppings Cidade Jardim e JK, além de fácil acesso aos principais destinos gastronômicos, de entretenimento e financeiros da cidade.",
      descriptionEn: "Newly built modern house (2024) available for sale in one of the best neighborhoods in São Paulo - Cidade Jardim. Designed by a renowned architecture firm that prioritized the integration of spaces, filled with a palette of soft, light, and welcoming colors and abundant natural light and ventilation. Natural materials such as stone, marble, and wood stand out, highlighted by the living room fireplace, built with noble natural stones laid in a geometric pattern.\n\nThe kitchen, with a central island, an Italian range, and custom moss-green cabinetry, can be integrated with or separated from the dining and living rooms through floor-to-ceiling wood and glass panels that slide from one side to the other, creating an enclosure around the kitchen without losing visibility, while adding a charming and sophisticated touch to the space.\n\nA smart floor plan with integrated spaces and plenty of natural light and ventilation, distributed over three floors: the first with the garage, gym, sauna, office, and staff suite; the second with one suite, an independent TV room, bar, powder room, and a kitchen with a central island integrated with the living room, which in turn opens onto the private backyard with a pool, gourmet area with barbecue grill, garden, and hammock area; and the third with three suites, a private hall, and a library.\n\nOffice, gym and studio, service area with bedroom, bar, home theater, gourmet area with barbecue grill, pool, and solarium. A true contemporary retreat in the largest city in Latin America, just minutes from the Cidade Jardim and JK shopping malls, with easy access to the city's main dining, entertainment, and financial destinations."
    },
    {
      id: 7,
      title: "Villagio Via Condotti",
      titleEn: "Villagio Via Condotti",
      location: "Campinas, SP",
      price: "R$ 3.500.000,00",
      images: [
        "/categorias/casas_urbanas/villaggio/37.jpg",
        "/categorias/casas_urbanas/villaggio/1.jpg",
        "/categorias/casas_urbanas/villaggio/10.jpg",
        "/categorias/casas_urbanas/villaggio/5.jpg",
        "/categorias/casas_urbanas/villaggio/26.jpg",
        "/categorias/casas_urbanas/villaggio/25.jpg",
      ],
      gallery: gallery("casas_urbanas/villaggio"),
      specs: { beds: 5, baths: 7, cars: 6, builtArea: "449m²", totalArea: "691m²" },
      description: "O sobrado, dividido em dois pavimentos, possui terreno independente. O piso térreo conta com hall de entrada social, lavabo, sala de TV / home theater ou escritório / home office, living para diversos ambientes, sala de lareira, sala de jantar e estar, cozinha grande, despensa, sala de almoço, copa, área de serviço / lavanderia e quarto de serviço com banheiro independente. O piso do living, sala de jantar, estar e de TV / escritório é de madeira de alta qualidade, assim como nas suítes e área íntima. Grandes aberturas e portas dão acesso para a varanda externa. Esse é um ambiente privativo muito agradável e envolvido por jardins. O quintal externo lateral direito pode ser usado como área de serviço para secagem de roupas, pois dá acesso para a lavanderia e dormitório de empregada / serviço.\n\nO quintal elevado da área de lazer conta com piscina privativa, solarium, espaço gourmet coberto com churrasqueira privativa e banheiro de apoio. O segundo andar é onde fica toda área íntima. Ao chegar pela escada de acesso, já encontra-se a ala íntima - que pode ser usada também como sala de TV / home theater. São quatro suítes bem espaçosas, todas com armários grandes e piso de madeira. A suíte principal conta com closet, banheiro com banheira e varanda espaçosa que dá para a frente do imóvel. Ainda, conta com a área íntima, que pode ser utilizada como sala íntima ou sala de TV, duas suítes e dois dormitórios que compartilham um banheiro social.\n\nO condomínio é completo, contando com segurança e portaria presencial com serviço de identificação de acesso e eclusa de segurança 24 horas, área de lazer incluindo salão de festas grande, espaço gourmet com churrasqueira, piscina adulto e infantil, quadra de tênis, campo de futebol, academia / fitness e pista de caminhada / cooper. As áreas de lazer incluem piscina grande adulta e infantil, salão de festas, espaço gourmet, academia, quadra de tênis, campo de futebol e playground. Casas com terrenos independentes, com privacidade e segurança - são as características comuns do Villagio Via Condotti. A poucos minutos você conta com toda conveniência do Gramado Mall, desde farmácia, academia, açougue, empório, salão de beleza, caixa eletrônico, cafeteria, e muito mais!",
      descriptionEn: "This two-story house sits on its own independent lot. The ground floor features a formal entrance hall, powder room, TV room / home theater or office / home office, a living room with several areas, fireplace room, dining and living rooms, a large kitchen, pantry, breakfast room, butler's pantry, service area / laundry room, and a staff bedroom with its own bathroom. The living room, dining room, lounge, and TV room / office have high-quality hardwood floors, as do the suites and private area. Large openings and doors lead to the outdoor veranda, a very pleasant private space surrounded by gardens. The side yard on the right can be used as a service area for drying clothes, as it provides access to the laundry room and staff bedroom.\n\nThe raised backyard leisure area features a private pool, solarium, covered gourmet area with a private barbecue grill, and a support bathroom. The second floor houses the entire private area. Arriving by the staircase, you reach the private wing, which can also be used as a TV room / home theater. There are four very spacious suites, all with large closets and hardwood floors. The master suite has a walk-in closet, a bathroom with a bathtub, and a spacious balcony facing the front of the property. The floor also includes the private area, which can be used as a family room or TV room, two suites, and two bedrooms that share a bathroom.\n\nThe condominium is complete, offering security and a staffed gatehouse with access identification and a 24-hour security airlock, as well as leisure areas including a large party hall, gourmet area with barbecue grill, adult and children's pools, tennis court, soccer field, gym / fitness center, walking / jogging track, and playground. Houses on independent lots, with privacy and security, are the hallmark of Villagio Via Condotti. Just minutes away, you have all the convenience of Gramado Mall, from a pharmacy, gym, butcher shop, gourmet market, beauty salon, ATM, and café, and much more!"
    },
    {
      id: 8,
      title: "Condomínio Chácara Flora",
      titleEn: "Chácara Flora Condominium",
      location: "Valinhos, SP",
      price: "R$ 2.900.000,00",
      images: [
        "/categorias/casas_urbanas/chacara-flora/1.jpg",
        "/categorias/casas_urbanas/chacara-flora/3.jpg",
        "/categorias/casas_urbanas/chacara-flora/8.jpg",
        "/categorias/casas_urbanas/chacara-flora/14.jpg",
        "/categorias/casas_urbanas/chacara-flora/23.jpg",
        "/categorias/casas_urbanas/chacara-flora/29.jpg",
      ],
      gallery: gallery("casas_urbanas/chacara-flora"),
      specs: { beds: 3, baths: 6, cars: 4, builtArea: "435m²", totalArea: "823m²" },
      description: "Casa com arquitetura contemporânea, três suítes e quintal espaçoso disponível para venda a cerca de dez minutos de Campinas. Iluminação e ventilação naturais estão presentes em abundância nessa casa: amplas aberturas com alumínio e vidro, trazendo bastante claridade aos ambientes. O living e áreas de convivência ficam no piso do quintal. A sala para vários ambientes é bastante ampla, e conta também com pé-direito duplo. Persianas do living são controladas por controle remoto, e a iluminação em led com direcionamento de luz indireta torna a casa mais agradável e aconchegante.\n\nCozinha moderna com ilha central em pedra especial. Rica em armários, ela é integrada com as salas de jantar e estar e ao quintal. Da cozinha, pode-se observar todo esse pavimento. O quintal com piscina privativa é espaçoso. Deck de madeira, solarium, paisagismo exuberante com variedades de plantas que enriquecem a formação da paisagem. No piso superior ficam as três suítes. Todas ricas em marcenaria e piso de madeira. A suíte principal tem uma linda vista peculiar das árvores do terreno e, assim como as outras, são integradas por uma varanda extensa que tem vista do quintal.\n\nNo último piso inferior, há uma sala grande com muita luz natural, disponível para ser utilizada como estúdio, escritório, academia, etc. No piso das salas, há também lavabo e núcleo de serviços bem generoso em espaço.\n\nO condomínio Chácara Flora está localizado logo na entrada de Valinhos, facilitando o acesso dos moradores ao residencial e aos principais pontos da cidade, como o centro, por exemplo, que está a poucos minutos. A rodovia José Roberto Magalhães Teixeira fica a menos de três minutos do condomínio. O Chácara Flora conta com portaria com guarita operando 24 horas, controle de acesso de moradores, visitantes e prestadores de serviços, com monitoramento por diversas câmeras estrategicamente posicionadas.",
      descriptionEn: "A house with contemporary architecture, three suites, and a spacious backyard, available for sale about ten minutes from Campinas. Natural light and ventilation are abundant throughout: wide aluminum and glass openings bring plenty of brightness to every room. The living room and social areas are on the backyard level. The multi-area living room is very spacious and also features a double-height ceiling. The living room blinds are remote-controlled, and the LED lighting with indirect light makes the house even more pleasant and welcoming.\n\nA modern kitchen with a central island in special stone. With plenty of cabinets, it is integrated with the dining and living rooms and with the backyard. From the kitchen, you can see the entire floor. The backyard with a private pool is spacious, with a wooden deck, solarium, and lush landscaping featuring a variety of plants that enrich the scenery. The three suites are on the upper floor, all with fine woodwork and hardwood floors. The master suite has a lovely, unique view of the trees on the property and, like the others, opens onto an extensive veranda overlooking the backyard.\n\nOn the lowest floor, there is a large room with plenty of natural light, available for use as a studio, office, gym, and more. The living room floor also has a powder room and a generously sized service area.\n\nThe Chácara Flora condominium is located right at the entrance of Valinhos, making it easy for residents to reach the community and the city's main destinations, such as downtown, just a few minutes away. The José Roberto Magalhães Teixeira highway is less than three minutes from the condominium. Chácara Flora has a 24-hour staffed gatehouse, access control for residents, visitors, and service providers, and monitoring by several strategically positioned cameras."
    },
    {
      id: 10,
      title: "Condomínio Alphaville Dom Pedro II",
      titleEn: "Alphaville Dom Pedro II Condominium",
      location: "Campinas, SP",
      price: "R$ 4.450.000,00",
      rentPrice: "R$ 25.000,00",
      images: [
        "/categorias/casas_urbanas/alphaville-dom-pedro-ii/8.jpg",
        "/categorias/casas_urbanas/alphaville-dom-pedro-ii/5.jpg",
        "/categorias/casas_urbanas/alphaville-dom-pedro-ii/20.jpg",
        "/categorias/casas_urbanas/alphaville-dom-pedro-ii/24.jpg",
        "/categorias/casas_urbanas/alphaville-dom-pedro-ii/34.jpg",
        "/categorias/casas_urbanas/alphaville-dom-pedro-ii/28.jpg",
      ],
      gallery: gallery("casas_urbanas/alphaville-dom-pedro-ii"),
      specs: { beds: 4, baths: 6, cars: 3, builtArea: "358m²", totalArea: "466m²" },
      description: "Edificada em um terreno de aclive, esta casa nova e nunca habitada fica na parte alta do condomínio, com um ótimo aproveitamento da vista. Garagem ampla com depósito e acesso ao segundo pavimento através de escada ou elevador moderno já instalado e funcionando. Ambientes integrados e ricos em iluminação e ventilação naturais, essa casa está apta para receber sua família com muito estilo. Quatro suítes amplas, sendo duas no térreo e uma delas podendo se tornar escritório privativo. Varanda ampla com vista livre e aberta com piscina de borda infinita. A cozinha é o coração da casa: com ilha central e bancada com pedra de alto padrão, é de onde se vê tudo que acontece na casa.\n\nO condomínio Alphaville Dom Pedro II é referência de moradas de alto padrão, com uma variedade de estilos arquitetônicos, com projetos de alto nível. O clube é repleto de opções para todas as idades: piscinas adulto e infantil, academia moderna, playground, campo de futebol, quadra de tênis, salão de festas, espaço gourmet e mais. A segurança do residencial opera 24 horas por dia, controlando o acesso com tecnologia de ponta, monitoramento por câmeras e ronda armada.",
      descriptionEn: "Built on an upward-sloping lot, this brand-new, never-occupied house sits in the upper part of the condominium, making the most of the view. A spacious garage with a storage room provides access to the second floor via stairs or a modern elevator, already installed and working. With integrated spaces full of natural light and ventilation, this house is ready to welcome your family in style. There are four spacious suites, two of them on the ground floor, one of which can become a private office. A large veranda with an open, unobstructed view features an infinity-edge pool. The kitchen is the heart of the house: with a central island and high-end stone countertop, it is where you can see everything happening in the home.\n\nThe Alphaville Dom Pedro II condominium is a benchmark for high-end homes, with a variety of architectural styles and top-level designs. The club is full of options for all ages: adult and children's pools, a modern gym, playground, soccer field, tennis court, party hall, gourmet area, and more. The community's security operates 24 hours a day, controlling access with state-of-the-art technology, camera monitoring, and armed patrols."
    },
    {
      id: 11,
      title: "Condomínio Tamboré 1",
      titleEn: "Tamboré 1 Condominium",
      location: "Barueri, SP",
      price: "R$ 21.700.000,00",
      images: [
        "/categorias/casas_urbanas/tambore/3.jpg",
        "/categorias/casas_urbanas/tambore/11.jpg",
        "/categorias/casas_urbanas/tambore/15.jpg",
        "/categorias/casas_urbanas/tambore/18.jpg",
        "/categorias/casas_urbanas/tambore/22.jpg",
        "/categorias/casas_urbanas/tambore/31.jpg",
      ],
      gallery: gallery("casas_urbanas/tambore"),
      specs: { beds: 5, baths: 7, cars: 8, builtArea: "1.200m²", totalArea: "1.800m²" },
      description: "Projeto arquitetônico exclusivo, que preza pelas grandes aberturas, trazendo consigo abundância de luz e ventilação naturais. Distribuída em dois pavimentos, a casa conta com as áreas de lazer e social no piso térreo. Quintal amplo com piscina grande e prainha, solarium, ducha, espaço gourmet com churrasqueira, forno, fogão cooktop, firepit, spa com hidromassagem, gramado e paisagismo. Já na área social, cozinha independente com ilha, despensa, núcleo de serviço com dormitório, lavabo, sala de jantar ampla, sala de estar para vários ambientes com pé-direito duplo, que é o coração da residência, cheio de luz e ventilação naturais de todos os lados. Outros ambientes de living, separados da sala principal, como a sala de TV / home theater e sala de lareira.\n\nNo segundo andar, a área íntima. Suítes espaçosas, com bastante armários e claridade natural. Avarandadas, sendo a principal com sala íntima particular e casa de banho exclusiva. Há também neste andar a academia / fitness particular - malhar e praticar seus treinos nunca mais será igual aqui! Está localizada no fundo do terreno, integrada tanto pelo térreo como pelo segundo pavimento, através de uma passarela elegante envidraçada.\n\nMorar nesta casa é sinônimo de exclusividade e sofisticação. É uma verdadeira experiência do que uma casa desse nível pode oferecer aos moradores. Privacidade, segurança, conforto, paz e bem-estar. Sua excelente localização dentro do condomínio valoriza ainda mais o imóvel. O Tamboré 1, em Barueri, é um dos melhores condomínios da cidade e do Estado de São Paulo. Casas luxuosas, área de lazer bem estruturada, segurança 24 horas reforçada com guarita monitorando o acesso de moradores, visitantes e prestadores de serviços.",
      descriptionEn: "An exclusive architectural design that values large openings, bringing an abundance of natural light and ventilation. Spread over two floors, the house has its leisure and social areas on the ground floor. A large backyard with a big pool and beach entry, solarium, outdoor shower, gourmet area with barbecue grill, oven, cooktop, fire pit, spa with hot tub, lawn, and landscaping. In the social area, there is a separate kitchen with an island, pantry, service area with bedroom, powder room, spacious dining room, and a multi-area living room with a double-height ceiling, the heart of the home, filled with natural light and ventilation from every side. Other living spaces are separate from the main room, such as the TV room / home theater and the fireplace room.\n\nThe private area is on the second floor. Spacious suites with plenty of closets and natural light, all with balconies, the master featuring a private sitting room and an exclusive bathroom. This floor also has a private gym / fitness center - working out and training will never be the same here! It is located at the back of the lot, connected to both the ground floor and the second floor by an elegant glass walkway.\n\nLiving in this house means exclusivity and sophistication. It is a true experience of what a home of this caliber can offer its residents: privacy, security, comfort, peace, and well-being. Its excellent location within the condominium adds even more value to the property. Tamboré 1, in Barueri, is one of the best condominiums in the city and in the State of São Paulo, with luxurious homes, a well-structured leisure area, and reinforced 24-hour security with a gatehouse monitoring the access of residents, visitors, and service providers."
    },
    {
      id: 12,
      title: "Condomínio Tamboré Jaguariúna",
      titleEn: "Tamboré Jaguariúna Condominium",
      location: "Jaguariúna, SP",
      price: "R$ 2.900.000,00",
      images: [
        "/categorias/casas_urbanas/tambore-jaguariuna-venda/2.jpg",
        "/categorias/casas_urbanas/tambore-jaguariuna-venda/5.jpg",
        "/categorias/casas_urbanas/tambore-jaguariuna-venda/25.jpg",
        "/categorias/casas_urbanas/tambore-jaguariuna-venda/10.jpg",
        "/categorias/casas_urbanas/tambore-jaguariuna-venda/12.jpg",
        "/categorias/casas_urbanas/tambore-jaguariuna-venda/20.jpg",
      ],
      gallery: gallery("casas_urbanas/tambore-jaguariuna-venda"),
      specs: { beds: 4, baths: 6, cars: 4, builtArea: "330m²", totalArea: "670m²" },
      description: "Localizada no final da rua tipo Cul de Sac, esta casa é um verdadeiro refúgio para quem busca privacidade, segurança e conforto. Com quatro suítes, o projeto contemporâneo priorizou a integração dos ambientes. Cozinha com ilha central grande integrada com as salas de jantar e estar, com pé-direito duplo e ambientes ricamente iluminados por amplas aberturas de esquadrias em alumínio e vidro. O espaço gourmet externo coberto também pode ser integrado com a sala.\n\nQuintal com piscina aquecida privativa adulto e infantil. Paisagismo e horta somam no ambiente externo, que é bem privativo. A garagem ampla e coberta possui estação para carregamento de carros elétricos.\n\nO condomínio Tamboré Jaguariúna é um residencial com sistema de segurança 24 horas, ronda, controle de acesso e monitoramento por câmeras. A área de lazer é de clube: piscinas adulto e infantil, quadras de tênis, beach tennis, quadra poliesportiva, campo de futebol, sala de jogos, salão de festas, espaço gourmet, academia / fitness, deck sobre o lago para contemplação, pista de caminhada / cooper bem extensa, playground, brinquedoteca, horta comunitária, alameda de frutas. O residencial ideal para viver momentos inesquecíveis com sua família.",
      descriptionEn: "Located at the end of a cul-de-sac street, this house is a true retreat for those seeking privacy, security, and comfort. With four suites, the contemporary design prioritized integrated spaces. The kitchen with a large central island is integrated with the dining and living rooms, with a double-height ceiling and spaces richly lit by wide aluminum and glass openings. The covered outdoor gourmet area can also be integrated with the living room.\n\nThe backyard features a private heated pool for adults and children. Landscaping and a vegetable garden complete the outdoor area, which is very private. The large covered garage has an electric vehicle charging station.\n\nThe Tamboré Jaguariúna condominium offers a 24-hour security system, patrols, access control, and camera monitoring. The leisure area is club-like: adult and children's pools, tennis courts, beach tennis, multi-sport court, soccer field, game room, party hall, gourmet area, gym / fitness center, a deck over the lake for contemplation, a very long walking / jogging track, playground, toy library, community garden, and a fruit tree lane. The ideal community to enjoy unforgettable moments with your family."
    },
    {
      id: 13,
      title: "Condomínio Tamboré Jaguariúna",
      titleEn: "Tamboré Jaguariúna Condominium",
      location: "Jaguariúna, SP",
      price: "R$ 3.990.000,00",
      rentPrice: "R$ 15.900,00",
      images: [
        "/categorias/casas_urbanas/tambore-jaguariuna-venda-e-aluguel/24.jpg",
        "/categorias/casas_urbanas/tambore-jaguariuna-venda-e-aluguel/23.jpg",
        "/categorias/casas_urbanas/tambore-jaguariuna-venda-e-aluguel/27.jpg",
        "/categorias/casas_urbanas/tambore-jaguariuna-venda-e-aluguel/18.jpg",
        "/categorias/casas_urbanas/tambore-jaguariuna-venda-e-aluguel/8.jpg",
        "/categorias/casas_urbanas/tambore-jaguariuna-venda-e-aluguel/6.jpg",
      ],
      gallery: gallery("casas_urbanas/tambore-jaguariuna-venda-e-aluguel"),
      specs: { beds: 4, baths: 6, cars: 4, builtArea: "455m²", totalArea: "510m²" },
      description: "Residência com estilo contemporâneo, com três suítes amplas e aconchegantes, sendo a principal com closet amplo e banheiro com banheira de hidromassagem. No piso térreo, hall social com pé-direito duplo, escritório, lavabo, living para vários ambientes, sala de jantar, cozinha grande com ilha integrada ao living, despensa e área de serviço. O pé-direito duplo traz ao ambiente uma sensação de amplitude e bem-estar. Muita iluminação e ventilação naturais iluminam e refrescam a casa com sua ventilação cruzada. No piso superior, as três suítes privativas, com hall de circulação e varanda privativa em cada dormitório. Piscina grande, spa aquecido e quintal generoso com espaço gourmet são ambientes convidativos para seus eventos em família e amigos.\n\nCondomínio completo, estruturado com segurança e portaria 24 horas, ronda e controle de acesso. Área de lazer do clube com muitos itens, sendo: piscinas adulto e infantil, academia moderna, spa, salão de festas, espaço gourmet, horta comunitária, brinquedoteca, espaço infantil, playground, quadras de tênis, quadra poliesportiva, campo de futebol, beach tennis, pista de caminhada extensa e pomar. O residencial perfeito para quem deseja morar com segurança em grande estilo.",
      descriptionEn: "A contemporary-style residence with three spacious and cozy suites, the master featuring a large walk-in closet and a bathroom with a jetted tub. The ground floor has a double-height entrance hall, office, powder room, multi-area living room, dining room, a large kitchen with an island integrated with the living room, pantry, and laundry area. The double-height ceiling brings a sense of spaciousness and well-being. Abundant natural light and cross ventilation brighten and cool the house. The upper floor holds the three private suites, with a circulation hall and a private balcony in each bedroom. A large pool, heated spa, and generous backyard with a gourmet area are inviting spaces for gatherings with family and friends.\n\nA complete condominium with 24-hour security and gatehouse, patrols, and access control. The club leisure area offers many amenities: adult and children's pools, a modern gym, spa, party hall, gourmet area, community garden, toy library, kids' area, playground, tennis courts, multi-sport court, soccer field, beach tennis, a long walking track, and an orchard. The perfect community for those who want to live safely and in great style."
    },
    {
      id: 9,
      title: "Chácaras São Rafael",
      titleEn: "Chácaras São Rafael",
      location: "Campinas, SP",
      price: "R$ 2.700.000,00",
      images: [
        "/categorias/casas_urbanas/chacaras-sao-rafael/4.jpg",
        "/categorias/casas_urbanas/chacaras-sao-rafael/1.jpg",
        "/categorias/casas_urbanas/chacaras-sao-rafael/2.jpg",
        "/categorias/casas_urbanas/chacaras-sao-rafael/3.jpg",
        "/categorias/casas_urbanas/chacaras-sao-rafael/5.jpg",
        "/categorias/casas_urbanas/chacaras-sao-rafael/6.jpg",
      ],
      gallery: gallery("casas_urbanas/chacaras-sao-rafael"),
      specs: { beds: 3, baths: 5, cars: 4, builtArea: "251m²", totalArea: "316m²" },
      description: "Casa contemporânea, clean e com ambientes integrados. São dois pavimentos, sendo o térreo com lavabo, sala de estar e jantar integrados, segundo espaço de living, espaço zen no lado externo da casa, espaço gourmet equipado com bancada, churrasqueira e banheiro de apoio para seus eventos, e a piscina. Já no piso superior, as três suítes são equipadas com ar-condicionado. A suíte principal tem terraço privativo com ofurô com vista para o lago e da fazenda. É possível enxergar montanhas a quilômetros de distância. Neste pavimento também tem sala de TV, que pode ser utilizada como escritório.\n\nAcabamento de alto padrão nos detalhes, faz desta casa um imóvel diferenciado. Localizada em final de rua, com tranquilidade e privacidade, onde poucos carros passam pela rua - somente moradores e a ronda da segurança.\n\nEsse residencial fica próximo ao Alphaville Campinas e toda a conveniência que o Alphaville Empresarial oferece: lojas, academia, padaria, mercados, farmácia, empresas, salão de beleza, bancos, hotéis, escola, etc.",
      descriptionEn: "A contemporary, clean house with integrated spaces. It has two floors: the ground floor features a powder room, integrated living and dining rooms, a second living area, a zen space outside the house, a gourmet area equipped with a countertop, barbecue grill, and support bathroom for your events, and the pool. On the upper floor, the three suites are equipped with air conditioning. The master suite has a private terrace with a hot tub overlooking the lake and the farm, with mountains visible for miles. This floor also has a TV room that can be used as an office.\n\nHigh-end finishes in every detail make this house a truly distinctive property. Located at the end of the street, it offers peace and privacy, with very few cars passing by - only residents and security patrols.\n\nThe community is close to Alphaville Campinas and all the convenience offered by Alphaville Empresarial: shops, gym, bakery, supermarkets, pharmacy, offices, beauty salon, banks, hotels, school, and more."
    },
    {
      id: 14,
      title: "Condomínio Residências Parque Portugal",
      titleEn: "Residências Parque Portugal Condominium",
      location: "Taquaral, Campinas, SP",
      price: "R$ 2.500.000,00",
      rentPrice: "R$ 15.000,00",
      images: [
        "/categorias/casas_urbanas/parque-portugal/1.jpg",
        "/categorias/casas_urbanas/parque-portugal/2.jpg",
        "/categorias/casas_urbanas/parque-portugal/3.jpg",
        "/categorias/casas_urbanas/parque-portugal/4.jpg",
        "/categorias/casas_urbanas/parque-portugal/5.jpg",
        "/categorias/casas_urbanas/parque-portugal/6.jpg",
      ],
      gallery: gallery("casas_urbanas/parque-portugal"),
      specs: { beds: 4, baths: 6, cars: 4, builtArea: "350m²", totalArea: "350m²" },
      description: "Casa em condomínio fechado disponível para venda a quase um quilômetro da Lagoa do Taquaral, em Campinas. Com quatro dormitórios, sendo duas suítes, quarto de empregada com banheiro, amplos espaços para sala de jantar, living e TV. A cozinha recebe iluminação natural, despensa e área de serviço. O piso térreo reúne ambientes sociais, cozinha, jantar, serviço e quintal. No piso superior, a área íntima oferece os dormitórios. No terceiro piso, um sótão todo revestido em piso de madeira, iluminação natural, que pode ser utilizado como escritório, academia ou ainda sala de TV privativa. Dali, você pode acessar o terraço descoberto com vista para a cidade e para o condomínio.\n\nO condomínio Residências Parque Portugal possui apenas 20 residências, construídas em um terreno amplo, onde foi possível implantar uma extensa área de lazer no centro do residencial. Piscina grande com raia, piscina infantil, solarium, academia, salão de festas e quadra de tênis, além de muito paisagismo, verde e fiação subterrânea.\n\nSeu dia a dia fica muito mais prático e dinâmico com esse endereço! Fácil acesso para as principais vias da cidade, shoppings, serviços, escolas, universidades e muito mais!",
      descriptionEn: "A house in a gated community available for sale almost one kilometer from Lagoa do Taquaral, in Campinas. It has four bedrooms, two of them suites, a staff bedroom with bathroom, and spacious dining, living, and TV areas. The kitchen receives natural light and has a pantry and laundry area. The ground floor brings together the social areas, kitchen, dining room, service area, and backyard. The upper floor holds the private area with the bedrooms. On the third floor, an attic fully finished with hardwood floors and natural light can be used as an office, gym, or private TV room. From there, you can access the open terrace with views of the city and the condominium.\n\nThe Residências Parque Portugal condominium has only 20 homes, built on a large plot that made it possible to create an extensive leisure area at the center of the community: a large pool with a lap lane, children's pool, solarium, gym, party hall, and tennis court, plus abundant landscaping, greenery, and underground wiring.\n\nYour daily life becomes much more practical and dynamic at this address! Easy access to the city's main roads, shopping malls, services, schools, universities, and much more!"
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

  const { deal, listProperties, selectedProperty, openProperty: handleOpenDetails, closeProperty: handleCloseDetails } = usePropertyRoute(properties, '/casasurbanas');
  const valueLabel = deal === 'alugar' ? t.rentValue : t.value;
  const priceOf = (p: PropertyListItem) => (deal === 'alugar'
    ? <>{p.rentPrice}<span className="nav-label font-normal text-[0.7em] tracking-[0.15em] ml-1">{t.perMonth}</span></>
    : p.price);

  // Fecha a galeria ao trocar de imóvel (inclusive pela seta do navegador)
  useEffect(() => {
    setIsLightboxOpen(false);
  }, [selectedProperty?.id]);

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

      {!deal ? (
        <DealChooser
          lang={lang}
          title={t.segmentTitle}
          basePath="/casasurbanas"
          counts={{ comprar: properties.filter((p) => p.price).length, alugar: properties.filter((p) => p.rentPrice).length }}
        />
      ) : selectedProperty ? (
        <main className="pb-32 animate-fadeIn">

          <div className="absolute top-6 left-6 lg:top-8 lg:left-16 z-30">
            <button
              onClick={handleCloseDetails}
              className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 lg:px-5 lg:py-3 rounded-none shadow-sm hover:bg-white transition-all text-gray-800 nav-label text-[10px] tracking-widest font-bold"
            >
              <ArrowLeft size={14} /> {t.back}
            </button>
          </div>

          <div className="w-full h-[80vh] md:h-screen relative bg-gray-900 skeleton-dark">
            <Img
              src={selectedProperty.images[0]}
              alt={lang === 'en' && selectedProperty.titleEn ? selectedProperty.titleEn : selectedProperty.title}
              className="w-full h-full object-cover opacity-95 transition-opacity duration-700"
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

              <div className="order-2 lg:order-none space-y-8 md:space-y-16">
                {selectedProperty.gallery.map((img, index) => (
                  <div
                    key={index}
                    className="w-full overflow-hidden bg-gray-50 aspect-[16/10] skeleton cursor-zoom-in group/item relative"
                    onClick={() => openLightbox(index)}
                  >
                    <Img
                      src={img}
                      alt={`Galeria Detalhe ${index + 1}`}
                      className="w-full h-full object-cover sm:hover:scale-102 transition-[transform,opacity] duration-[2s] ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>

            {/* Valor no fim da página em telas menores (depois da galeria) */}
            <div className="order-4 lg:hidden border-t border-gray-100 pt-10 text-center">
              <span className="text-sm uppercase text-black block mb-1 md:mb-2 font-[HeadingNow,sans-serif]!">{valueLabel}</span>
                  <div className="font-segoe font-light text-4xl text-gray-900 tracking-tight">
                    {priceOf(selectedProperty)}
                  </div>
            </div>

            <div className="order-3 lg:order-none lg:col-span-5">
              <div className="lg:sticky lg:top-32 space-y-8 md:space-y-10 border-t lg:border-t-0 border-gray-100 pt-10 lg:pt-0 text-center lg:text-left">
                <div className="hidden lg:block">
                  <span className="text-sm uppercase text-black block mb-1 md:mb-2 font-[HeadingNow,sans-serif]!">{valueLabel}</span>
                  <div className="font-segoe font-light text-4xl text-gray-900 tracking-tight">
                    {priceOf(selectedProperty)}
                  </div>
                </div>

                <div className="hidden lg:block w-full h-[1px] bg-gray-200" />

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
      ) : listProperties.length === 0 ? (
        <DealComingSoon
          lang={lang}
          deal={deal}
          title={t.segmentTitle}
          basePath="/casasurbanas"
          noun={{ pt: 'casas urbanas', en: 'urban houses' }}
          icon={Home}
          isLoaded={isLoaded}
        />
      ) : (
        <main className={`pt-16 pb-32 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="w-full px-8 md:px-16 mb-20 text-center">
            <h1 className="text-4xl font-qlassy mb-4 md:mb-6 uppercase tracking-tighter text-gray-700">
              {t.segmentTitle}
            </h1>
            <div className="w-12 h-[1px] bg-gray-300 mx-auto mt-8"></div>
            <DealToggle lang={lang} basePath="/casasurbanas" deal={deal} />
          </div>

          <section className="w-full px-8 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {listProperties.map((item) => {
                const imgIndex = currentImgIndices[item.id] || 0;

                return (
                  <div key={item.id} className="group cursor-pointer" onClick={() => handleOpenDetails(item)}>
                    <div className="relative overflow-hidden rounded-sm mb-6 w-full pt-[62.5%] bg-gray-50 skeleton">
                      {item.images.map((imgSrc, idx) => (
                        <Img
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
                        <span className="nav-label text-[10px] text-gray-400 block mb-1">{valueLabel}</span>
                        <span className="font-segoe font-semibold text-lg text-gray-800 tracking-tight">{priceOf(item)}</span>
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
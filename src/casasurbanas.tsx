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
      price: "R$ 22.900.000,00",
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
      description: "Mansão com arquitetura neoclássica disponível para venda no renomado condomínio clube Alphaville Campinas. Térrea, é destaque no residencial pela sua imponência, que impõe presença marcante e desperta admiração.\n\nIntegração dos ambientes, salas de estar para sete ambientes, cozinha com ilha central, espaço gourmet independente e conectado ao quintal. Piscina com hidromassagem e tratamento de ozônio, ideal para aquele relaxamento após um dia longo de trabalho. Academia e sala para massagem ou beauty care, home TV independente com sistema de som profissional, escritório amplo com total privacidade. Luz e ventilação naturais abundam em todos os ambientes, que possuem pé-direito alto. A área íntima contempla quatro amplas suítes, e os pisos receberam aquecimento controlado eletronicamente. A suíte principal conta com dois closets e banheiros separados, e se encontram em uma bela banheira de imersão - um spa dentro da suíte.\n\nDependência de empregada, despensa grande, quintal gramado espaçoso para recreação, praça externa italiana com fonte e paisagismo que acolhe.\n\nO terreno é bem amplo, um dos maiores do condomínio, e conta no fundo dele com um bosque privativo, onde não é permitido construção, mas sim contemplação. Lá de cima, é possível avistar os prédios da cidade, e assistir a uma bela paisagem.\n\nO condomínio Alphaville Campinas oferece uma gama completa de lazer, contando com quadras de tênis, futebol, academia ampla, salão de festas, playground, piscinas adulto e infantil, pista de caminhada e lagos. A segurança opera com portaria 24 horas, monitoramento por câmeras e ronda, além de total controle de acesso de moradores, visitantes e prestadores de serviços. Super bem localizado, fica às margens da rodovia SP-340 (Mogi-Campinas), e se conecta rapidamente aos principais shoppings da cidade e à rodovia Dom Pedro. Além disso, o residencial está ao lado do Alphaville Comercial, que oferece diversos serviços diariamente, como farmácia, banco, padaria, mercados, posto de combustível, salão de beleza e muito mais!",
      descriptionEn: "Mansion with neoclassical architecture available for sale in the renowned Alphaville Campinas club condominium. Single-story, it stands out in the community for its grandeur, which commands a striking presence and inspires admiration.\n\nIntegrated spaces, living rooms with seven areas, a kitchen with a central island, and an independent gourmet area connected to the backyard. A pool with hydromassage and ozone treatment, ideal for relaxing after a long day of work. Gym and a room for massage or beauty care, an independent home theater with a professional sound system, and a spacious office with complete privacy. Natural light and ventilation abound in every room, all with high ceilings. The private wing includes four spacious suites, and the floors feature electronically controlled heating. The master suite has two closets and separate bathrooms, which meet at a beautiful soaking tub - a spa within the suite.\n\nStaff quarters, a large pantry, a spacious lawn for recreation, an Italian-style outdoor plaza with a fountain, and welcoming landscaping.\n\nThe lot is very large, one of the biggest in the condominium, and at its rear there is a private woodland where building is not permitted - only contemplation. From up there, you can see the city's buildings and enjoy a beautiful view.\n\nThe Alphaville Campinas condominium offers a complete range of amenities, including tennis courts, soccer fields, a large gym, party hall, playground, adult and children's pools, a walking track, and lakes. Security operates with a 24-hour gatehouse, camera monitoring, and patrols, as well as full access control for residents, visitors, and service providers. Very well located, it sits along the SP-340 highway (Mogi-Campinas) and connects quickly to the city's main shopping malls and to the Dom Pedro highway. In addition, the community is next to Alphaville Comercial, which offers a variety of daily services, such as a pharmacy, bank, bakery, supermarkets, gas station, beauty salon, and much more!"
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
      description: "Casa localizada no condomínio fechado Fazenda Duas Marias, na cidade de Jaguariúna, interior de São Paulo, a aproximadamente 01h40 da capital. Conta com segurança profissional 24 horas, ronda e controle de acesso.\n\nDistribuída em blocos, oferece casa principal com seis dormitórios, sendo um de serviço, amplo living com pé-direito alto, cozinha com fogão assinado pela renomada Oficina Victorello, sala de TV independente, escritório, despensa, lavanderia, varanda social, piscina aquecida com iluminação, Spa e prainha, rodeada pelo solarium para um belo banho de sol. As suítes da casa principal e a sala de estar contam com piso aquecido eletronicamente, além de oferecer sistema de aspiração central. Casa automatizada com sistema Alexa.\n\nDuas garagens, sendo uma delas climatizada com mini-oficina para vários veículos, fogo de chão (firepit), rooftop em deck de madeira com vista panorâmica, lago ornamental cristalino para mergulho com peixes e tratamento de ozônio, salão de jogos climatizado, equipado e decorado, campo de futebol com grama especial e sistema de drenagem, vestiário com armários, banheiro e chuveiros, academia e sauna. Sistema de geração de energia fotovoltaica, irrigação, captação de água por cisterna e poço artesiano.\n\nO salão de festas gourmet, que fica no centro do terreno, tem mais de 130 m² de área, climatizado, lavabo, churrasqueiras a gás e carvão, sistema de som ambiente, bar, integração total com o quintal e paisagismo. Ideal para suas festas em família e amigos, isolada da casa principal, sem abrir mão da sua privacidade. O paisagismo assinado por Marcelo Novaes, conta com diversas espécies de plantas e árvores maduras adultas, como o pau-brasil que fica no jardim principal de boas-vindas. A parte mais densa do jardim guia, através de uma mini-trilha, aos redários acolhidos sob as imensas árvores adultas. No topo do terreno, horta, espaço zen, casa de árvore de madeira especial e o acesso social.",
      descriptionEn: "House located in the Fazenda Duas Marias gated community, in the city of Jaguariúna, in the countryside of São Paulo, approximately 1 hour and 40 minutes from the capital. It has 24-hour professional security, patrols, and access control.\n\nDistributed in separate blocks, it offers a main house with six bedrooms, one of them for staff, a spacious living room with high ceilings, a kitchen with a stove by the renowned Oficina Victorello, an independent TV room, office, pantry, laundry room, social veranda, and a heated pool with lighting, spa, and a shallow beach area, surrounded by a solarium for sunbathing. The suites of the main house and the living room feature electronically heated floors, as well as a central vacuum system. The house is automated with an Alexa system.\n\nTwo garages, one of them climate-controlled with a mini workshop for several vehicles, a firepit, a wooden-deck rooftop with panoramic views, a crystal-clear ornamental lake for swimming with fish and ozone treatment, a climate-controlled, fully equipped and decorated game room, a soccer field with special grass and a drainage system, a locker room with lockers, bathroom and showers, a gym, and a sauna. Photovoltaic power generation system, irrigation, cistern water collection, and an artesian well.\n\nThe gourmet party hall, located at the center of the lot, has more than 130 m², air conditioning, a powder room, gas and charcoal grills, an ambient sound system, a bar, and full integration with the backyard and landscaping. Ideal for parties with family and friends, set apart from the main house without giving up your privacy. The landscaping, designed by Marcelo Novaes, features a wide variety of plants and mature trees, such as the brazilwood tree in the main welcome garden. The densest part of the garden leads, through a small trail, to hammock areas sheltered beneath the immense mature trees. At the top of the lot are a vegetable garden, a zen space, a tree house made of special wood, and the main entrance."
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
      description: "Com quatro suítes confortáveis com armários, sendo a principal com closet grande, esta casa de montanha dentro de condomínio fechado possui ampla varanda que integra duas das suítes, com vista para as montanhas. A sala de estar com vários ambientes possui sala de lareira, estar e TV.\n\nA cozinha foi alocada em um espaço externo ao da casa principal, mas facilmente acessada. Foi onde os proprietários destinaram para receber familiares e amigos, aproveitando o prestígio das belas paisagens e vistas de tirar o fôlego de qualquer canto do ambiente. Fogão à lenha, churrasqueira, ilha central grande, sala de TV integrada para apoio aos eventos, sala de jogos, lavabo e sala de jantar. Com teto revestido de madeira e iluminação projetada, é o ponto mais utilizado da casa.\n\nO quintal é muito espaçoso e com vários níveis de topografia, devido a tipologia do terreno. Jardins e plantas compõem o quintal, que o convida para o descanso e apreciação da natureza. No nível mais baixo utilizado do terreno, há a área de lazer externa, com ampla piscina, solarium e pergolado.\n\nO condomínio oferece portaria com controle de acesso, sistema de câmeras, área de lazer com quadra, campo de futebol, salão de festas, jogos, biblioteca, mirante.",
      descriptionEn: "With four comfortable suites with built-in closets, the master featuring a large walk-in closet, this mountain house in a gated community has a wide veranda connecting two of the suites, with views of the mountains. The living room has several areas, including a fireplace room, a lounge, and a TV room.\n\nThe kitchen was placed in a space separate from the main house, but easily accessible. This is where the owners chose to host family and friends, taking advantage of the beautiful landscapes and breathtaking views from every corner of the space. Wood-burning stove, barbecue grill, a large central island, an integrated TV room to support gatherings, a game room, powder room, and dining room. With a wood-paneled ceiling and designed lighting, it is the most used area of the house.\n\nThe backyard is very spacious and has several levels due to the topography of the lot. Gardens and plants make up the backyard, inviting you to rest and enjoy nature. On the lowest level in use, there is the outdoor leisure area, with a large pool, solarium, and pergola.\n\nThe condominium offers a gatehouse with access control, a camera system, and a leisure area with a sports court, soccer field, party hall, game room, library, and lookout point."
    },
    {
      id: 6,
      title: "Casa no bairro Cidade Jardim, em São Paulo",
      titleEn: "House in the Cidade Jardim Neighborhood, São Paulo",
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
      gallery: Array.from({ length: 48 }, (_, i) =>
        `/categorias/casas_urbanas/cidade-jardim/${i + 1}.jpg`
      ),
      specs: { beds: 5, baths: 6, cars: 3, builtArea: "641m²", totalArea: "550m²" },
      description: "Casa Moderna recém construída (2024) disponível para venda em dos melhores bairros de São Paulo - o Cidade Jardim. Assinada por renomado escritório de arquitetura, que priorizou a integração dos ambientes, que foram preenchidos por uma paleta de cores suaves, claras e acolhedoras, cheios de muita luz e ventilação naturais. Materiais naturais, como a pedra, mármore e madeira, com destaque para a lareira na sala de estar, com pedras naturais nobres geometricamente assentadas.\n\nA cozinha com ilha central, fogão italiano e marcenaria sob medida em tom verde musgo, pode ser integrada ou isolada das salas de jantar e estar, através de painéis de madeira e vidro que se movimentam de um lado ao outro, instalados do chão ao teto, formando uma eclusa na cozinha, sem perder a visibilidade, além de dar um tom charmoso e sofisticado ao ambiente.\n\nPlanta inteligente, ambientes integrados, muita luz e ventilação naturais, distribuída em três pavimentos: garagem, academia, sauna, escritório e suíte de serviço, segundo pavimento com uma suíte, sala de TV independente, bar, lavabo, cozinha com ilha central integrada com o living, que também é integrado com o quintal privativo com piscina, espaço gourmet com churrasqueira, jardim, redário, e terceiro pavimento com três suítes, hall íntimo e biblioteca.\n\nEscritório, academia e estúdio, núcleo de serviços com dormitório, bar, home theater, espaço gourmet com churrasqueira, piscina e solarium. Um verdadeiro refúgio contemporâneo dentro da maior cidade da América Latina, a pouquíssimos minutos dos shoppings Cidade Jardim e JK, além de fácil acesso aos principais destinos gastronômicos, de entretenimento e financeiros da cidade.",
      descriptionEn: "Newly built modern house (2024) available for sale in one of the best neighborhoods in São Paulo - Cidade Jardim. Designed by a renowned architecture firm that prioritized the integration of spaces, filled with a palette of soft, light, and welcoming colors and abundant natural light and ventilation. Natural materials such as stone, marble, and wood stand out, highlighted by the living room fireplace, built with noble natural stones laid in a geometric pattern.\n\nThe kitchen, with a central island, an Italian range, and custom moss-green cabinetry, can be integrated with or separated from the dining and living rooms through floor-to-ceiling wood and glass panels that slide from one side to the other, creating an enclosure around the kitchen without losing visibility, while adding a charming and sophisticated touch to the space.\n\nA smart floor plan with integrated spaces and plenty of natural light and ventilation, distributed over three floors: the first with the garage, gym, sauna, office, and staff suite; the second with one suite, an independent TV room, bar, powder room, and a kitchen with a central island integrated with the living room, which in turn opens onto the private backyard with a pool, gourmet area with barbecue grill, garden, and hammock area; and the third with three suites, a private hall, and a library.\n\nOffice, gym and studio, service area with bedroom, bar, home theater, gourmet area with barbecue grill, pool, and solarium. A true contemporary retreat in the largest city in Latin America, just minutes from the Cidade Jardim and JK shopping malls, with easy access to the city's main dining, entertainment, and financial destinations."
    },
    {
      id: 7,
      title: "Casa no Condomínio Villagio Via Condotti, bairro Gramado, em Campinas",
      titleEn: "House in the Villagio Via Condotti Condominium, Gramado Neighborhood, Campinas",
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
      gallery: Array.from({ length: 38 }, (_, i) =>
        `/categorias/casas_urbanas/villaggio/${i + 1}.jpg`
      ),
      specs: { beds: 5, baths: 7, cars: 6, builtArea: "449m²", totalArea: "691m²" },
      description: "O sobrado, dividido em dois pavimentos, possui terreno independente. O piso térreo conta com hall de entrada social, lavabo, sala de TV / home theater ou escritório / home office, living para diversos ambientes, sala de lareira, sala de jantar e estar, cozinha grande, despensa, sala de almoço, copa, área de serviço / lavanderia e quarto de serviço com banheiro independente. O piso do living, sala de jantar, estar e de TV / escritório é de madeira de alta qualidade, assim como nas suítes e área íntima. Grandes aberturas e portas dão acesso para a varanda externa. Esse é um ambiente privativo muito agradável e envolvido por jardins. O quintal externo lateral direito pode ser usado como área de serviço para secagem de roupas, pois dá acesso para a lavanderia e dormitório de empregada / serviço.\n\nO quintal elevado da área de lazer conta com piscina privativa, solarium, espaço gourmet coberto com churrasqueira privativa e banheiro de apoio. O segundo andar é onde fica toda área íntima. Ao chegar pela escada de acesso, já encontra-se a ala íntima - que pode ser usada também como sala de TV / home theater. São quatro suítes bem espaçosas, todas com armários grandes e piso de madeira. A suíte principal conta com closet, banheiro com banheira e varanda espaçosa que dá para a frente do imóvel. Ainda, conta com a área íntima, que pode ser utilizada como sala íntima ou sala de TV, duas suítes e dois dormitórios que compartilham um banheiro social.\n\nO condomínio é completo, contando com segurança e portaria presencial com serviço de identificação de acesso e eclusa de segurança 24 horas, área de lazer incluindo salão de festas grande, espaço gourmet com churrasqueira, piscina adulto e infantil, quadra de tênis, campo de futebol, academia / fitness e pista de caminhada / cooper. As áreas de lazer incluem piscina grande adulta e infantil, salão de festas, espaço gourmet, academia, quadra de tênis, campo de futebol e playground. Casas com terrenos independentes, com privacidade e segurança - são as características comuns do Villagio Via Condotti. A poucos minutos você conta com toda conveniência do Gramado Mall, desde farmácia, academia, açougue, empório, salão de beleza, caixa eletrônico, cafeteria, e muito mais!",
      descriptionEn: "This two-story house sits on its own independent lot. The ground floor features a formal entrance hall, powder room, TV room / home theater or office / home office, a living room with several areas, fireplace room, dining and living rooms, a large kitchen, pantry, breakfast room, butler's pantry, service area / laundry room, and a staff bedroom with its own bathroom. The living room, dining room, lounge, and TV room / office have high-quality hardwood floors, as do the suites and private area. Large openings and doors lead to the outdoor veranda, a very pleasant private space surrounded by gardens. The side yard on the right can be used as a service area for drying clothes, as it provides access to the laundry room and staff bedroom.\n\nThe raised backyard leisure area features a private pool, solarium, covered gourmet area with a private barbecue grill, and a support bathroom. The second floor houses the entire private area. Arriving by the staircase, you reach the private wing, which can also be used as a TV room / home theater. There are four very spacious suites, all with large closets and hardwood floors. The master suite has a walk-in closet, a bathroom with a bathtub, and a spacious balcony facing the front of the property. The floor also includes the private area, which can be used as a family room or TV room, two suites, and two bedrooms that share a bathroom.\n\nThe condominium is complete, offering security and a staffed gatehouse with access identification and a 24-hour security airlock, as well as leisure areas including a large party hall, gourmet area with barbecue grill, adult and children's pools, tennis court, soccer field, gym / fitness center, walking / jogging track, and playground. Houses on independent lots, with privacy and security, are the hallmark of Villagio Via Condotti. Just minutes away, you have all the convenience of Gramado Mall, from a pharmacy, gym, butcher shop, gourmet market, beauty salon, ATM, and café, and much more!"
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

              <div className="order-3 lg:order-none space-y-8 md:space-y-16">
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

            <div className="order-2 lg:order-none lg:col-span-5">
              <div className="lg:sticky lg:top-32 space-y-8 md:space-y-10 border-t lg:border-t-0 border-gray-100 pt-10 lg:pt-0 text-center lg:text-left">
                <div>
                  <span className="text-sm uppercase text-black block mb-1 md:mb-2 font-[HeadingNow,sans-serif]!">{t.value}</span>
                  <div className="font-segoe font-light text-4xl text-gray-900 tracking-tight">
                    {selectedProperty.price}
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-200" />

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
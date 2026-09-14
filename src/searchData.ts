export interface SearchProperty {
  id: number;
  categoryPath: string;
  categoryLabel: string;
  categoryLabelEn: string;
  title: string;
  titleEn: string;
  location: string;
  price: string;
  image: string;
  beds?: number;
  baths?: number;
  cars?: number;
  totalArea?: string;
  builtArea?: string;
  sold?: boolean;
}

export interface SearchPage {
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  path: string;
  icon: 'home' | 'info' | 'building' | 'mail' | 'newspaper' | 'shield' | 'doc' | 'whatsapp' | 'instagram';
  keywords?: string;
  external?: boolean;
}

export const contactEmail = "andre@apropriedade.com.br";
export const contactWhatsapp = "https://wa.me/5519982828990";
export const contactInstagram = "https://www.instagram.com/apropriedadeimoveis?igsh=MTh3dDlqYmozdXQ3eA==";

export const searchProperties: SearchProperty[] = [
  {
    id: 1,
    categoryPath: "/casadecampoemontanha",
    categoryLabel: "Casas de Campo e Montanha",
    categoryLabelEn: "Country & Mountain Houses",
    title: "Refúgio na Montanha",
    titleEn: "Mountain Refuge",
    location: "Nazaré Paulista, SP",
    price: "R$ 2.950.000",
    image: "/categorias/casas_montanha/nazare-paulista/5.jpg",
    beds: 6, baths: 6, cars: 4, totalArea: "55.000m²", builtArea: "450m²",
    sold: true
  },
  {
    id: 2,
    categoryPath: "/casadecampoemontanha",
    categoryLabel: "Casas de Campo e Montanha",
    categoryLabelEn: "Country & Mountain Houses",
    title: "Sítio com Casa de Campo",
    titleEn: "Country Estate",
    location: "Pilar do Sul, SP",
    price: "R$ 15.000.000,00",
    image: "/categorias/casas_montanha/PilarDoSul/28.jpg",
    beds: 10, baths: 11, cars: 6, totalArea: "278.000m²", builtArea: "4.000m²"
  },
  {
    id: 1,
    categoryPath: "/casasurbanas",
    categoryLabel: "Casas Urbanas",
    categoryLabelEn: "Urban Houses",
    title: "Mansão no condomínio, Alphaville Campinas",
    titleEn: "Mansion in the Condominium, Alphaville Campinas",
    location: "Campinas, SP",
    price: "R$ 22.900.000",
    image: "/categorias/casas_urbanas/neoclassica-alphavile/capa1.jpg",
    beds: 5, baths: 7, cars: 6, totalArea: "3.840m²", builtArea: "1.280m²"
  },
  {
    id: 2,
    categoryPath: "/casasurbanas",
    categoryLabel: "Casas Urbanas",
    categoryLabelEn: "Urban Houses",
    title: "Casa no condomínio, Fazenda Duas Marias Jaguariúna",
    titleEn: "House in the Condominium, Fazenda Duas Marias Jaguariúna",
    location: "Jaguariúna, SP",
    price: "R$ 17.990.000,00",
    image: "/categorias/casas_urbanas/duasMarias/45.jpg",
    beds: 6, baths: 10, cars: 8, totalArea: "10.004m²", builtArea: "850m²"
  },
  {
    id: 5,
    categoryPath: "/casasurbanas",
    categoryLabel: "Casas Urbanas",
    categoryLabelEn: "Urban Houses",
    title: "Casa no Condomínio Monte Sankhya",
    titleEn: "House in the Monte Sankhya Condominium",
    location: "Serra Negra, SP",
    price: "R$ 3.600.000,00",
    image: "/categorias/casas_urbanas/serranegra/4.jpg",
    beds: 4, baths: 5, cars: 4, totalArea: "2.600m²", builtArea: "400m²"
  },
  {
    id: 6,
    categoryPath: "/casasurbanas",
    categoryLabel: "Casas Urbanas",
    categoryLabelEn: "Urban Houses",
    title: "Parque Portugal, Taquaral",
    titleEn: "Parque Portugal, Taquaral",
    location: "Campinas, SP",
    price: "R$ 2.500.000",
    image: "/categorias/casas_urbanas/parqueportugal/52.jpg",
    beds: 4, baths: 6, cars: 4, totalArea: "350m²"
  },
  {
    id: 7,
    categoryPath: "/casasurbanas",
    categoryLabel: "Casas Urbanas",
    categoryLabelEn: "Urban Houses",
    title: "Villaggio Via Condotti, Gramado",
    titleEn: "Villaggio Via Condotti, Gramado",
    location: "Campinas, SP",
    price: "R$ 3.500.000",
    image: "/categorias/casas_urbanas/villaggio/83.jpg",
    beds: 5, baths: 7, cars: 6, totalArea: "691m²",
    sold: true
  },
  {
    id: 1,
    categoryPath: "/casasdemontanha",
    categoryLabel: "Terrenos",
    categoryLabelEn: "Land Plots",
    title: "Condomínio Tamboré",
    titleEn: "Exclusive Plot in Gated Community",
    location: "Jaguariúna, SP",
    price: "R$ 480.000,00",
    image: "/categorias/terrenos/lotetambore/5.jpg",
    totalArea: "510m²"
  },
  {
    id: 2,
    categoryPath: "/casasdemontanha",
    categoryLabel: "Terrenos",
    categoryLabelEn: "Land Plots",
    title: "Condomínio - Fazenda da Grama",
    titleEn: "Plot in Prime Area",
    location: "Itupeva, SP",
    price: "R$ 6.899.900,00",
    image: "/categorias/terrenos/lotefazendadagrama/6.jpg",
    totalArea: "2.669m²"
  },
  {
    id: 3,
    categoryPath: "/casasdemontanha",
    categoryLabel: "Terrenos",
    categoryLabelEn: "Land Plots",
    title: "Condomínio - Alphaville Dom Pedro II",
    titleEn: "Panoramic Plot",
    location: "Campinas, SP",
    price: "R$ 1.460.000,00",
    image: "/categorias/terrenos/lote25/6.jpg",
    totalArea: "537m²"
  }
];

export const searchPages: SearchPage[] = [
  {
    title: "Início", titleEn: "Home", subtitle: "Página inicial", subtitleEn: "Homepage",
    path: "/", icon: 'home',
    keywords: "home principal capa pagina inicial site"
  },
  {
    title: "Sobre Nós", titleEn: "About Us", subtitle: "Conheça a A Propriedade", subtitleEn: "Get to know A Propriedade",
    path: "#sobre", icon: 'info',
    keywords: "quem somos empresa historia sobre nos creci equipe about us company history"
  },
  {
    title: "Casas de Campo e Montanha", titleEn: "Country & Mountain Houses", subtitle: "Todos os imóveis dessa categoria", subtitleEn: "All properties in this category",
    path: "/casadecampoemontanha", icon: 'building',
    keywords: "sitio fazenda chacara campo montanha refugio country mountain farm"
  },
  {
    title: "Casas Urbanas", titleEn: "Urban Houses", subtitle: "Todos os imóveis dessa categoria", subtitleEn: "All properties in this category",
    path: "/casasurbanas", icon: 'building',
    keywords: "casa condominio mansao urbana urban house mansion"
  },
  {
    title: "Apartamentos", titleEn: "Apartments", subtitle: "Novidades em breve", subtitleEn: "Coming soon",
    path: "/apartamentos", icon: 'building',
    keywords: "apartamento cobertura flat apartment penthouse"
  },
  {
    title: "Terrenos", titleEn: "Land Plots", subtitle: "Todos os imóveis dessa categoria", subtitleEn: "All properties in this category",
    path: "/casasdemontanha", icon: 'building',
    keywords: "terreno lote area land plot"
  },
  {
    title: "Comercial e Corporativo", titleEn: "Commercial & Corporate", subtitle: "Novidades em breve", subtitleEn: "Coming soon",
    path: "/comercialecorporativo", icon: 'building',
    keywords: "comercial corporativo predio sala loja escritorio office commercial"
  },
  {
    title: "Magazine", titleEn: "Magazine", subtitle: "Nosso catálogo editorial", subtitleEn: "Our editorial catalog",
    path: "/magazinepage", icon: 'newspaper',
    keywords: "revista blog editorial catalogo artigos noticias magazine articles"
  },
  {
    title: "Contato", titleEn: "Contact", subtitle: "Fale com a nossa equipe", subtitleEn: "Talk to our team",
    path: "#contato", icon: 'mail',
    keywords: "contato falar equipe atendimento mensagem formulario contact"
  },
  {
    title: "Enviar E-mail", titleEn: "Send an Email", subtitle: contactEmail, subtitleEn: contactEmail,
    path: `mailto:${contactEmail}`, icon: 'mail', external: true,
    keywords: "email e-mail mandar mensagem andre correio mail"
  },
  {
    title: "Chamar no WhatsApp", titleEn: "Message on WhatsApp", subtitle: "+55 19 98282-8990", subtitleEn: "+55 19 98282-8990",
    path: contactWhatsapp, icon: 'whatsapp', external: true,
    keywords: "whatsapp zap telefone numero ligar celular phone call"
  },
  {
    title: "Seguir no Instagram", titleEn: "Follow on Instagram", subtitle: "@apropriedadeimoveis", subtitleEn: "@apropriedadeimoveis",
    path: contactInstagram, icon: 'instagram', external: true,
    keywords: "instagram insta redes sociais social media"
  },
  {
    title: "Política de Privacidade", titleEn: "Privacy Policy", subtitle: "Termos legais", subtitleEn: "Legal terms",
    path: "/politica-de-privacidade", icon: 'shield',
    keywords: "privacidade dados lgpd cookies privacy"
  },
  {
    title: "Termos de Uso", titleEn: "Terms of Use", subtitle: "Termos legais", subtitleEn: "Legal terms",
    path: "/termos-de-uso", icon: 'doc',
    keywords: "termos regras condicoes uso terms"
  }
];

export const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

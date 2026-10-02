import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export type Deal = 'comprar' | 'alugar';

// Converte o título em um trecho de URL: "Condomínio Monte Sankhya" -> "condominio-monte-sankhya"
export const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const isDeal = (value?: string): value is Deal => value === 'comprar' || value === 'alugar';

// Endereços de cada categoria:
//   /casasurbanas                         -> escolha entre comprar e alugar
//   /casasurbanas/comprar                 -> imóveis à venda (com `price`)
//   /casasurbanas/alugar                  -> imóveis para alugar (com `rentPrice`)
//   /casasurbanas/comprar/<imovel>        -> página do imóvel
// Assim a seta do navegador, o F5 e links compartilhados funcionam.
export function usePropertyRoute<T extends { id: number; title: string; price?: string; rentPrice?: string }>(
  properties: T[],
  basePath: string
) {
  const { modo, slug: slugParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { openId?: number; deal?: Deal; fromList?: boolean } | null;

  // Links antigos no formato /casasurbanas/<imovel> viram /casasurbanas/comprar/<imovel>
  const legacySlug = modo && !isDeal(modo) ? modo : undefined;
  const deal = isDeal(modo) ? modo : undefined;
  const slug = deal ? slugParam : undefined;

  // Imóveis com o mesmo título (ex: duas casas no mesmo condomínio) ganham o id no endereço
  const slugOf = (property: T) => {
    const base = slugify(property.title);
    const repeated = properties.filter((p) => slugify(p.title) === base).length > 1;
    return repeated ? `${base}-${property.id}` : base;
  };

  const listProperties = deal === 'alugar'
    ? properties.filter((p) => p.rentPrice)
    : properties.filter((p) => p.price);
  const selectedProperty = deal && slug ? listProperties.find((p) => slugOf(p) === slug) ?? null : null;

  const pathOf = (d: Deal, property?: T) => `${basePath}/${d}${property ? `/${slugOf(property)}` : ''}`;

  useEffect(() => {
    if (legacySlug) navigate(`${basePath}/comprar/${legacySlug}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legacySlug]);

  // A busca e a hero da home enviam { openId, deal }: troca pelo endereço do imóvel
  useEffect(() => {
    const d = state?.deal ?? 'comprar';
    const match = state?.openId ? properties.find((p) => p.id === state.openId) : undefined;
    if (match) navigate(pathOf(d, match), { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.openId]);

  // Endereço de imóvel que não existe (ex: título renomeado): volta para a lista
  useEffect(() => {
    if (deal && slug && !selectedProperty) navigate(pathOf(deal), { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deal, slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [deal, slug]);

  const openProperty = (property: T) => {
    if (deal) navigate(pathOf(deal, property), { state: { fromList: true } });
  };

  // Se veio da lista, volta no histórico (igual à seta do navegador); senão, vai para a lista
  const closeProperty = () => {
    if (state?.fromList) navigate(-1);
    else navigate(deal ? pathOf(deal) : basePath);
  };

  return { deal, listProperties, selectedProperty, openProperty, closeProperty };
}

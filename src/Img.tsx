import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react';

// <img> que fica invisível até terminar de baixar e então aparece de uma vez.
// O contêiner deve ter a classe "skeleton" (ou "skeleton-dark") para mostrar
// o brilho de carregamento enquanto isso (estilos em index.css).
export default function Img({ onLoad, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // foto já em cache: o evento load pode ter acontecido antes do React escutar
  useEffect(() => {
    setLoaded(Boolean(ref.current?.complete && ref.current.naturalWidth));
  }, [props.src]);

  return (
    <img
      ref={ref}
      {...props}
      data-loaded={loaded}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
    />
  );
}

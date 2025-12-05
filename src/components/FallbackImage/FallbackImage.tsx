'use client';

import { ImgHTMLAttributes, useEffect, useRef, useState } from 'react';

type FallbackImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
  fallback?: string;
};

const FallbackImage = ({ src, alt, fallback, ...rest }: FallbackImageProps) => {
  const [hasRendered, setHasRendered] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imgRef.current && hasRendered) {
      imgRef.current.src = src;
    }
  }, [src, hasRendered]);

  useEffect(() => {
    setHasRendered(true);
  }, []);

  return (
    <picture>
      <img
        {...rest}
        alt={alt}
        src={src}
        ref={imgRef}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = fallback ?? '/smurf.svg';
        }}
      />
    </picture>
  );
};

export default FallbackImage;

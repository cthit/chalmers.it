'use client';

import { ImgHTMLAttributes, useEffect, useRef, useState } from 'react';

const FallbackImage = ({
  src,
  alt,
  fallback,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { fallback?: string }) => {
  const [hasRendered, setHasRendered] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imgRef.current && hasRendered) {
      imgRef.current!.src = src || '';
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
        ref={imgRef as any}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = fallback || '/smurf.svg';
        }}
      />
    </picture>
  );
};

export default FallbackImage;

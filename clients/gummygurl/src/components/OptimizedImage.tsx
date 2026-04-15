import { useState, useCallback, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onLoad" | "onError"> {
  /** Extra classes for the wrapper div */
  wrapperClassName?: string;
  /** Aspect ratio CSS value, e.g. "1/1", "16/9". Prevents CLS. */
  aspectRatio?: string;
}

/**
 * Drop-in <img> replacement that:
 * 1. Shows a pulsing skeleton placeholder while loading (prevents CLS)
 * 2. Fades the image in on load using GPU-accelerated opacity
 * 3. Uses native lazy loading + async decoding
 */
export default function OptimizedImage({
  src,
  alt,
  className,
  wrapperClassName,
  aspectRatio = "1/1",
  style,
  ...rest
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => {
    setLoaded(true);
    setError(true);
  }, []);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        wrapperClassName
      )}
      style={{ aspectRatio, ...style }}
    >
      {/* Skeleton placeholder – visible until image loads */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-muted-foreground/5 to-muted" />
      )}

      {!error && src && (
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500 will-change-[opacity]",
            loaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...rest}
        />
      )}
    </div>
  );
}

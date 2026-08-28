import { useState, forwardRef } from "react";
import { resolveImagePath } from "../../utils/imageResolver";

const isVideoSrc = (url) => {
  if (!url) return false;
  return typeof url === "string" && (
    url.toLowerCase().endsWith(".mp4") || 
    url.toLowerCase().endsWith(".webm") || 
    url.toLowerCase().endsWith(".ogg")
  );
};

export function Image({
  src,
  alt = "",
  fallback = "/sobo_logo.webp",
  className = "",
  loading = "lazy",
  width,
  height,
  aspectRatio,
  style,
  decoding,
  preload = "metadata",
  ...props
}) {
  const resolvedSrc = resolveImagePath(src);
  const [prevSrc, setPrevSrc] = useState(resolvedSrc);
  const [imgSrc, setImgSrc] = useState(resolvedSrc);
  if (resolvedSrc !== prevSrc) {
    setPrevSrc(resolvedSrc);
    setImgSrc(resolvedSrc);
  }
  const isEager = loading === "eager" || props.fetchPriority === "high" || props.fetchpriority === "high";

  if (isVideoSrc(src)) {
    return (
      <video
        src={src}
        className={className}
        style={{
          aspectRatio,
          objectFit: aspectRatio ? "cover" : "cover",
          width: width || "100%",
          height: height || "100%",
          ...style,
        }}
        autoPlay
        loop
        muted
        playsInline
        preload={preload}
        {...props}
      />
    );
  }

  const objectFitStyle =
    style?.objectFit ||
    (className.includes("object-contain")
      ? "contain"
      : className.includes("object-cover")
      ? "cover"
      : aspectRatio
      ? "cover"
      : undefined);

  return (
    <img
      src={imgSrc || fallback}
      alt={alt}
      loading={loading}
      decoding={decoding || (isEager ? "sync" : "async")}
      width={width}
      height={height}
      className={className}
      style={{
        aspectRatio,
        objectFit: objectFitStyle,
        ...style,
      }}
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
      {...props}
    />
  );
}

export const ImageDiv = forwardRef(({
  image,
  fallback = "/sobo_logo.webp",
  children,
  className = "",
  innerClassName = "",
  overlay = false,
  overlayClass = "",
  innerRef,
  preload = "metadata",
  ...props
}, ref) => {
  const resolvedImage = resolveImagePath(image);
  const [prevImage, setPrevImage] = useState(resolvedImage);
  const [bgImage, setBgImage] = useState(resolvedImage);
  if (resolvedImage !== prevImage) {
    setPrevImage(resolvedImage);
    setBgImage(resolvedImage);
  }

  const isVideo = isVideoSrc(bgImage);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} {...props}>
      {isVideo ? (
        <video
          ref={innerRef}
          src={bgImage}
          className={`${innerClassName} absolute inset-0 w-full h-full object-cover`}
          style={{ zIndex: 0 }}
          autoPlay
          loop
          muted
          playsInline
          preload={preload}
        />
      ) : (
        <div
          ref={innerRef}
          className={innerClassName}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background: `url(${bgImage || fallback}) center/cover no-repeat`,
          }}
        />
      )}
      {overlay && (
        <div
          className={overlayClass}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />
      )}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
});

export default Image;
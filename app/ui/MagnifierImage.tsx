"use client";

import { useState } from "react";

type MagnifierImageProps = {
  src: string;
  alt: string;
  className?: string;
  zoom?: number;
  lensSize?: number;
};

export default function MagnifierImage({
  src,
  alt,
  className = "",
  zoom = 2.8,
  lensSize = 170,
}: MagnifierImageProps) {
  const [position, setPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    });
  };

  const borderColor = "#495352";
  const borderWidth = 10;
  const handleWidth = 18;
  const handleLength = 74;

  return (
    <div
      className="relative w-full cursor-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition(null)}
    >
      <img
        src={src}
        alt={alt}
        className={className}
        draggable={false}
      />

      {position && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            left: position.x - lensSize / 2,
            top: position.y - lensSize / 2,
            width: lensSize,
            height: lensSize,
            zIndex: 50,
          }}
        >
          {/* 손잡이: 렌즈와 살짝 겹치게 뒤에 배치 */}
          <div
            className="absolute rounded-full"
            style={{
              width: `${handleWidth}px`,
              height: `${handleLength}px`,
              backgroundColor: borderColor,
              left: `${lensSize * 0.72}px`,
              top: `${lensSize * 0.7}px`,
              transform: "rotate(-55deg)",
              transformOrigin: "top center",
              zIndex: 0,
            }}
          />

          {/* 원형 렌즈 */}
          <div
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{
              border: `${borderWidth}px solid ${borderColor}`,
              backgroundImage: `url("${src}")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${position.width * zoom}px ${position.height * zoom}px`,
              backgroundPosition: `-${
                position.x * zoom - lensSize / 2
              }px -${
                position.y * zoom - lensSize / 2
              }px`,
              boxSizing: "border-box",
              backgroundColor: "white",
              zIndex: 1,
            }}
          />
        </div>
      )}
    </div>
  );
}
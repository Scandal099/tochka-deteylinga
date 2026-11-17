"use client";

import { useId, type ComponentProps } from "react";

import { cn } from "@/lib/utils";

export interface NoiseTextureProps extends ComponentProps<"svg"> {
  className?: string;
  frequency?: number;
  octaves?: number;
  slope?: number;
  noiseOpacity?: number;
}

export const NoiseTexture = ({
  className,
  frequency = 0.55,
  octaves = 4,
  slope = 0.14,
  noiseOpacity = 0.35,
  ...props
}: NoiseTextureProps) => {
  const filterId = useId();

  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 z-0 size-full opacity-35 select-none",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={frequency}
          numOctaves={octaves}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="linear" slope={slope} />
          <feFuncG type="linear" slope={slope} />
          <feFuncB type="linear" slope={slope} />
        </feComponentTransfer>
      </filter>
      <rect
        width="100%"
        height="100%"
        filter={`url(#${filterId})`}
        opacity={noiseOpacity}
      />
    </svg>
  );
};

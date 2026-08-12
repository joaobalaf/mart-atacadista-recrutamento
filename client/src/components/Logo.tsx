interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  boxed?: boolean;
}

const HEIGHT_CLASS = {
  sm: "h-8",
  md: "h-11",
  lg: "h-16",
} as const;

/**
 * O arquivo /mart-logo.png é um quadrado 1024x1024 com a marca centralizada e uma
 * grande margem branca ao redor (imagem "crua" enviada pelo cliente, sem crop).
 * Os valores abaixo (calculados a partir dos pixels reais do arquivo) recortam via
 * CSS só a região da marca, evitando mostrar o quadrado branco inteiro.
 */
const CROP = {
  aspectRatio: "1.79 / 1",
  imgWidthPercent: 119.35,
  imgHeightPercent: 213.81,
  imgLeftPercent: -13.06,
  imgTopPercent: -56.39,
};

export function Logo({ className = "", size = "md", boxed = false }: LogoProps) {
  const crop = (
    <div
      className="relative overflow-hidden"
      style={{ aspectRatio: CROP.aspectRatio, height: "100%" }}
    >
      <img
        src="/mart-logo.png"
        alt="MART Atacadista"
        style={{
          position: "absolute",
          width: `${CROP.imgWidthPercent}%`,
          height: `${CROP.imgHeightPercent}%`,
          left: `${CROP.imgLeftPercent}%`,
          top: `${CROP.imgTopPercent}%`,
          maxWidth: "none",
        }}
      />
    </div>
  );

  return (
    <div className={`inline-flex items-center ${HEIGHT_CLASS[size]} ${className}`}>
      {boxed ? (
        <div className="h-full rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-900/5">{crop}</div>
      ) : (
        crop
      )}
    </div>
  );
}

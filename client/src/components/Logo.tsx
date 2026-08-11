interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export function Logo({ variant = "light", className = "" }: LogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-brand-ink";
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gold-500 text-sm font-black text-brand-ink">
        M
      </div>
      <div className={`leading-none ${textColor}`}>
        <div className="text-lg font-black tracking-tight">MART</div>
        <div className="text-[10px] font-semibold tracking-[0.25em] text-brand-gold-500">
          ATACADISTA
        </div>
      </div>
    </div>
  );
}

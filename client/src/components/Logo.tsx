interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const heightClass = {
    sm: "h-12",
    md: "h-20",
    lg: "h-32",
  }[size];

  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src="/mart-logo.png"
        alt="MART Atacadista"
        className={`${heightClass} w-auto object-contain drop-shadow-sm`}
      />
    </div>
  );
}

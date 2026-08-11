import type { ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-brand-gray-200 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-brand-red-600">{children}</h3>;
}

export function Label({ children, className = "", ...rest }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`mb-1.5 block text-sm font-medium text-brand-ink-soft ${className}`} {...rest}>
      {children}
    </label>
  );
}

const fieldBase =
  "w-full rounded-xl border border-brand-gray-300 bg-white px-3.5 py-2.5 text-sm text-brand-ink placeholder:text-brand-gray-400 outline-none transition focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100";

export function Input({ className = "", ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldBase} ${className}`} {...rest} />;
}

export function Textarea({ className = "", ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldBase} ${className}`} {...rest} />;
}

export function Select({ className = "", children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${fieldBase} ${className}`} {...rest}>
      {children}
    </select>
  );
}

export function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1 text-xs font-medium text-brand-red-600">{children}</p>;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ variant = "primary", className = "", ...rest }: ButtonProps) {
  const styles = {
    primary:
      "bg-brand-red-600 text-white hover:bg-brand-red-700 shadow-sm shadow-brand-red-600/20 disabled:bg-brand-gray-300",
    secondary:
      "bg-white text-brand-ink border border-brand-gray-300 hover:bg-brand-gray-50",
    ghost: "text-brand-red-600 hover:bg-brand-red-50",
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`}
      {...rest}
    />
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
  className = "",
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition ${
        checked
          ? "border-brand-red-500 bg-brand-red-50 text-brand-red-700 font-medium"
          : "border-brand-gray-300 text-brand-ink hover:border-brand-gray-400"
      } ${className}`}
    >
      <input
        type="checkbox"
        className="h-4 w-4 accent-brand-red-600"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary/90 shadow-glow",
  secondary: "bg-secondary text-white hover:bg-secondary/90",
  danger: "bg-rose-500 text-white hover:bg-rose-400",
  ghost: "border border-white/15 text-white/80 hover:border-primary/60 hover:text-white",
};

export const Button = ({ variant = "primary", className = "", ...props }: ButtonProps) => {
  return <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props} />;
};

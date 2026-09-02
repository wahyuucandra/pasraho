import React from "react";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  gradient?: boolean;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<string, string> = {
  primary:
    "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm",
  secondary:
    "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm",
  ghost:
    "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300",
  danger:
    "bg-red-500 hover:bg-red-600 text-white shadow-sm",
};

const sizes: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  gradient = false,
  className = "",
  children,
  disabled,
  ...rest
}) => {
  const gradientClass = gradient && variant === "primary"
    ? "btn-primary-gradient text-white"
    : "";

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${gradientClass || variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <span className="spinner" />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};

Button.displayName = "Button";
